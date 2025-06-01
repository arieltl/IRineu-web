import { Hono } from "hono";
import { createCommand, getSession, getCommandById, clearSession, startLearningSession } from "./learning.service";
import { getDevices } from "../devices/devices.service";
import { AddCommandPage } from "../devices/pages/addCommand.page";
import { LearningStatusPage, LearningSuccessPage } from "../devices/pages/learningStatus.page";

const app = new Hono();

// Show add command page
app.get('/devices/:id/add-command', async (c) => {
    const deviceId = parseInt(c.req.param('id'));
    const devices = await getDevices();
    const device = devices.find(d => d.id === deviceId);
    
    if (!device) {
        return c.text('Device not found', 404);
    }

    return c.render(AddCommandPage({ device }));
});

// Handle add command form submission
app.post('/devices/:id/add-command', async (c) => {
    try {
        const deviceId = parseInt(c.req.param('id'));
        const formData = await c.req.formData();
        
        const name = formData.get('name') as string;
        const icon = formData.get('icon') as string;
        const color = formData.get('color') as string;

        if (!name || !icon || !color) {
            return c.text('Name, icon, and color are required', 400);
        }

        // Get device
        const devices = await getDevices();
        const device = devices.find(d => d.id === deviceId);
        
        if (!device) {
            return c.text('Device not found', 404);
        }

        // Create command and start learning
        await createCommand(deviceId, name, icon, color);

        // Show learning status page
        return c.render(LearningStatusPage({ 
            device,
            commandName: name, 
            commandIcon: icon, 
            commandColor: color 
        }));
    } catch (error) {
        console.error('Error starting learning:', error);
        return c.text('Failed to start learning session', 500);
    }
});

// Check learning status (called by polling)
app.get('/devices/:id/learning-status', async (c) => {
    try {
        const deviceId = parseInt(c.req.param('id'));
        
        // Get device info
        const devices = await getDevices();
        const device = devices.find(d => d.id === deviceId);
        
        if (!device) {
            return c.text('Device not found', 404);
        }

        // Check if there's an active learning session
        const session = getSession(deviceId);
        
        if (session) {
            // Check if session is marked as completed
            if (session.completed) {
                // Clear the session and show success page  
                clearSession(deviceId);
                return c.html(
                    <div 
                        hx-get={`/devices/${deviceId}/learning-success?commandName=${encodeURIComponent(session.commandName)}`}
                        hx-trigger="load"
                        hx-target="#main-content"
                        hx-push-url={`/devices/${deviceId}/learning-success`}
                    >
                        <div class="flex items-center justify-center p-8">
                            <div class="loading loading-spinner loading-lg"></div>
                            <span class="ml-2">Loading success page...</span>
                        </div>
                    </div>
                );
            }
            
            // Still learning - check if command has been learned (backup check)
            const command = await getCommandById(session.commandId);
            if (command && command.irData && command.irData.trim() !== '') {
                // Mark as completed for next poll
                session.completed = true;
            }
        } else {
            // No active session - redirect back to device page
            return c.redirect(`/devices/${deviceId}/simple`);
        }

        // Still learning - return just the status indicator div
        return c.html(
            <div 
                id="learning-status"
                class="bg-primary/10 border-2 border-primary border-dashed rounded-2xl p-8"
                hx-get={`/devices/${device.id}/learning-status`}
                hx-trigger="every 2s"
                hx-target="this"
                hx-swap="outerHTML"
            >
                <div class="flex flex-col items-center gap-4">
                    <div class="loading loading-spinner loading-lg text-primary"></div>
                    <div>
                        <h3 class="font-bold text-lg">Listening for IR Signal...</h3>
                        <p class="text-sm opacity-70 mt-1">Press the button on your remote now</p>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error checking learning status:', error);
        return c.text('Error checking learning status', 500);
    }
});

// Start learning for an existing command
app.post('/devices/:id/learn-command/:commandId', async (c) => {
    try {
        const deviceId = parseInt(c.req.param('id'));
        const commandId = parseInt(c.req.param('commandId'));
        
        // Get device and command info
        const devices = await getDevices();
        const device = devices.find(d => d.id === deviceId);
        
        if (!device) {
            return c.text('Device not found', 404);
        }
        
        // Get the existing command
        const command = await getCommandById(commandId);
        if (!command) {
            return c.text('Command not found', 404);
        }
        
        // Verify command belongs to device
        if (command.deviceId !== deviceId) {
            return c.text('Command does not belong to this device', 403);
        }
        
        // Clear existing IR data and start learning
        const { db } = await import('../db');
        const { commandsTable } = await import('../schema');
        const { eq } = await import('drizzle-orm');
        
        await db.update(commandsTable).set({
            irData: ""
        }).where(eq(commandsTable.id, commandId));
        
        // Start learning session for existing command
        await startLearningSession(command.id, command.name, deviceId);

        // Show learning status page
        return c.render(LearningStatusPage({ 
            device,
            commandName: command.name, 
            commandIcon: command.icon, 
            commandColor: command.color 
        }));
    } catch (error) {
        console.error('Error starting learning for existing command:', error);
        return c.text('Failed to start learning session', 500);
    }
});

// Show learning success page
app.get('/devices/:id/learning-success', async (c) => {
    try {
        const deviceId = parseInt(c.req.param('id'));
        const commandName = c.req.query('commandName') || 'Unknown Command';
        
        // Get device info
        const devices = await getDevices();
        const device = devices.find(d => d.id === deviceId);
        
        if (!device) {
            return c.text('Device not found', 404);
        }

        return c.render(LearningSuccessPage({ 
            device,
            commandName: decodeURIComponent(commandName)
        }));
    } catch (error) {
        console.error('Error showing success page:', error);
        return c.text('Error showing success page', 500);
    }
});

// Send IR command via MQTT
app.post('/devices/:id/send-command/:commandId', async (c) => {
    try {
        const deviceId = parseInt(c.req.param('id'));
        const commandId = parseInt(c.req.param('commandId'));
        
        // Get the command details
        const command = await getCommandById(commandId);
        if (!command || !command.irData || command.irData.trim() === '') {
            return c.html(
                <div class="alert alert-error">
                    <span>Error: Command not found or not learned</span>
                </div>
            );
        }
        
        // Verify command belongs to the device
        if (command.deviceId !== deviceId) {
            return c.html(
                <div class="alert alert-error">
                    <span>Error: Command does not belong to this device</span>
                </div>
            );
        }

        // Get device to find the pairing code
        const { getRemoteByDeviceId } = await import('../remotes/remotes.service');
        const remote = await getRemoteByDeviceId(deviceId);
        
        if (!remote) {
            return c.html(
                <div class="alert alert-error">
                    <span>Error: Remote not found for device</span>
                </div>
            );
        }

        // Publish to MQTT
        const mqttClient = (await import('../mqtt/mqtt.service')).default;
        const topic = `raw/${remote.pairingCode}/command`;
        const message = command.irData;
        
        console.log(`Publishing command "${command.name}" to topic: ${topic}`);
        console.log(`IR Data: ${message}`);
        
        mqttClient.publish(topic, message, (err) => {
            if (err) {
                console.error('MQTT publish error:', err);
            } else {
                console.log(`Successfully published command "${command.name}" to ${topic}`);
            }
        });

        // Return success toast HTML
        return c.html(
            <div class="alert alert-success">
                <span>Sent: {command.name}</span>
            </div>
        );
    } catch (error) {
        console.error('Error sending command:', error);
        return c.html(
            <div class="alert alert-error">
                <span>Error: Failed to send command</span>
            </div>
        );
    }
});

// Delete success toast
app.get('/devices/:id/delete-success', async (c) => {
    const commandName = c.req.query('commandName') || 'Command';
    return c.html(
        <div class="alert alert-success">
            <span>Deleted: {decodeURIComponent(commandName)}</span>
        </div>
    );
});

// Delete command
app.delete('/devices/:id/delete-command/:commandId', async (c) => {
    try {
        const deviceId = parseInt(c.req.param('id'));
        const commandId = parseInt(c.req.param('commandId'));
        
        // Get and verify command
        const command = await getCommandById(commandId);
        if (!command) {
            return c.html(
                <div 
                    hx-trigger="load"
                    hx-target="#command-toast"
                    hx-swap="innerHTML"
                >
                    <div class="alert alert-error">
                        <span>Error: Command not found</span>
                    </div>
                </div>
            );
        }
        
        // Verify command belongs to device
        if (command.deviceId !== deviceId) {
            return c.html(
                <div 
                    hx-trigger="load"
                    hx-target="#command-toast"
                    hx-swap="innerHTML"
                >
                    <div class="alert alert-error">
                        <span>Error: Command does not belong to this device</span>
                    </div>
                </div>
            );
        }
        
        // Delete the command
        const { db } = await import('../db');
        const { commandsTable } = await import('../schema');
        const { eq } = await import('drizzle-orm');
        
        await db.delete(commandsTable).where(eq(commandsTable.id, commandId));
        
        console.log(`Deleted command "${command.name}" (ID: ${commandId}) from device ${deviceId}`);
        
        // Return success response (HTMX will delete the element with hx-swap="delete")
        // Also trigger a toast notification
        return c.html(
            <div 
                hx-trigger="load"
                hx-get={`/devices/${deviceId}/delete-success?commandName=${encodeURIComponent(command.name)}`}
                hx-target="#command-toast"
                hx-swap="innerHTML"
            >
                {/* This triggers the toast */}
            </div>
        );
        
    } catch (error) {
        console.error('Error deleting command:', error);
        return c.html(
            <div 
                hx-trigger="load"
                hx-target="#command-toast"
                hx-swap="innerHTML"
            >
                <div class="alert alert-error">
                    <span>Error: Failed to delete command</span>
                </div>
            </div>
        );
    }
});

// Cancel learning
app.post('/devices/:id/cancel-learning', async (c) => {
    try {
        const deviceId = parseInt(c.req.param('id'));
        // Simply redirect back to device - the session will timeout naturally
        const devices = await getDevices();
        return c.redirect(`/devices/${deviceId}/simple`);
    } catch (error) {
        console.error('Error canceling learning:', error);
        return c.text('Error canceling learning', 500);
    }
});

export default app; 