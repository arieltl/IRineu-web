import { Hono } from "hono";
import { AcAdoptionPage } from "./pages/acAdoption.page";
import { AcThermostatPage } from "./pages/acThermostat.page";
import { getDevices } from "../devices/devices.service";
import { 
  getAcDeviceByDeviceId, 
  addAcDevice, 
  getAcStateByAcDeviceId,
  updateAcStatesByProtocolAndModel,
  AcCommandData
} from "./ac.service";
import { publish } from "../mqtt/mqtt.service";
import { getRemoteByDeviceId } from "../remotes/remotes.service";
import { 
  startAcAdoptionSession, 
  getAcAdoptionSession, 
  clearAcAdoptionSession 
} from "./acLearning.service";

const app = new Hono();

// AC Device Route - shows adoption or thermostat based on setup status
app.get('/ac/:id', async (c) => {
  const deviceId = parseInt(c.req.param('id'));
  const devices = await getDevices();
  const device = devices.find(d => d.id === deviceId);
  
  if (!device) {
    return c.text('Device not found', 404);
  }
  
  if (device.type !== 'AC') {
    return c.text('This is not an AC device', 400);
  }
  
  // Check if AC device is already adopted (has protocol and model)
  const acDevice = await getAcDeviceByDeviceId(deviceId);
  
  if (!acDevice) {
    // Show adoption page
    return c.render(AcAdoptionPage({device}));
  }
  
  // Show thermostat
  const acState = await getAcStateByAcDeviceId(acDevice.id);
  return c.render(AcThermostatPage({device, acDevice, acState}));
});

// Start AC adoption process
app.post('/ac/:id/start-adoption', async (c) => {
  const deviceId = parseInt(c.req.param('id'));
  const devices = await getDevices();
  const device = devices.find(d => d.id === deviceId);
  
  if (!device) {
    return c.text('Device not found', 404);
  }
  
  try {
    // Start AC adoption session
    const remote = await startAcAdoptionSession(deviceId);
    
    // No need to send MQTT command - IR blaster is always listening
    // and will publish to ac/pairingcode/state when it detects AC commands
    
    // Return learning status UI
    return c.html(`
      <div class="card-body text-center" 
           hx-get="/ac/${deviceId}/adoption-status" 
           hx-trigger="every 2s"
           hx-target="this"
           hx-swap="outerHTML">
        <div class="mb-4">
          <div class="w-24 h-24 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div class="loading loading-spinner loading-lg text-warning"></div>
          </div>
          <h3 class="text-xl font-semibold mb-2">Learning...</h3>
          <p class="text-base-content/70">
            Press any button on your AC remote now
          </p>
        </div>
        
        <button class="btn btn-outline btn-sm" onclick="window.location.reload()">
          Cancel
        </button>
      </div>
    `);
  } catch (error) {
    console.error('Error starting AC adoption:', error);
    return c.text('Failed to start adoption session', 500);
  }
});

// Check adoption status
app.get('/ac/:id/adoption-status', async (c) => {
  const deviceId = parseInt(c.req.param('id'));
  console.log("Checking adoption status for device:", deviceId);
  
  // Check if AC device has been created (adoption completed)
  const acDevice = await getAcDeviceByDeviceId(deviceId);
  console.log("AC device found:", acDevice);
  
  if (acDevice) {
    // Clear the adoption session and show success
    const remote = await getRemoteByDeviceId(deviceId);
    if (remote) {
      clearAcAdoptionSession(remote.id);
    }
    
    // Adoption completed, redirect to thermostat
    return c.html(`
      <div class="card-body text-center">
        <div class="mb-4">
          <div class="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-check text-4xl text-success"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">Success!</h3>
          <p class="text-base-content/70">
            AC device adopted successfully<br/>
            Protocol: ${acDevice.protocol}, Model: ${acDevice.model}
          </p>
        </div>
        
        <button 
          class="btn btn-primary"
          hx-get="/ac/${deviceId}"
          hx-target="#main-content"
          hx-push-url="true"
        >
          Continue to Thermostat
        </button>
      </div>
    `);
  }
  
  // Check if there's an active adoption session
  const remote = await getRemoteByDeviceId(deviceId);
  console.log("Remote for device:", remote);
  const session = remote ? getAcAdoptionSession(remote.id) : null;
  console.log("Active adoption session:", session);
  console.log("Session completed status:", session?.completed);
  
  if (!session) {
    // No session found, redirect back to adoption page
    return c.html(`
      <div class="card-body text-center">
        <div class="mb-4">
          <div class="w-24 h-24 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-times text-4xl text-error"></i>
          </div>
          <h3 class="text-xl font-semibold mb-2">Session Expired</h3>
          <p class="text-base-content/70">
            The learning session has expired. Please try again.
          </p>
        </div>
        
        <button 
          class="btn btn-primary"
          hx-get="/ac/${deviceId}"
          hx-target="#main-content"
          hx-push-url="true"
        >
          Try Again
        </button>
      </div>
    `);
  }
  
  // Still learning
  return c.html(`
    <div class="card-body text-center" 
         hx-get="/ac/${deviceId}/adoption-status" 
         hx-trigger="every 2s"
         hx-target="this"
         hx-swap="outerHTML">
      <div class="mb-4">
        <div class="w-24 h-24 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <div class="loading loading-spinner loading-lg text-warning"></div>
        </div>
        <h3 class="text-xl font-semibold mb-2">Learning...</h3>
        <p class="text-base-content/70">
          Press any button on your AC remote now
        </p>
      </div>
      
      <button class="btn btn-outline btn-sm" onclick="window.location.reload()">
        Cancel
      </button>
    </div>
  `);
});

// Send AC command
app.post('/ac/:id/send-command', async (c) => {
  try {
    const deviceId = parseInt(c.req.param('id'));
    const commandData: AcCommandData = await c.req.json();
    
    const devices = await getDevices();
    const device = devices.find(d => d.id === deviceId);
    
    if (!device) {
      return c.json({ error: 'Device not found' }, 404);
    }
    
    // Get the AC device to update its state immediately
    const acDevice = await getAcDeviceByDeviceId(deviceId);
    if (!acDevice) {
      return c.json({ error: 'AC device not found' }, 404);
    }
    
    // Get the remote for this device to get pairing code
    const remote = await getRemoteByDeviceId(deviceId);
    if (!remote) {
      return c.json({ error: 'Remote not found for device' }, 404);
    }
    
    // Update AC state immediately in database for responsive UI
    const { updateAcState } = await import('./ac.service');
    await updateAcState(acDevice.id, {
      power: commandData.power,
      temperature: commandData.temperature,
      mode: commandData.mode,
      fan: commandData.fan
    });
    
    // Publish command to MQTT
    const commandTopic = `ac/${remote.pairingCode}/command`;
    const command = {
      protocol: commandData.protocol,
      model: commandData.model,
      power: commandData.power,
      temperature: commandData.temperature,
      mode: commandData.mode,
      fan: commandData.fan
    };
    
    publish(commandTopic, JSON.stringify(command));
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error sending AC command:', error);
    return c.json({ error: 'Failed to send command' }, 500);
  }
});

// Get AC state
app.get('/ac/:id/state', async (c) => {
  try {
    const deviceId = parseInt(c.req.param('id'));
    const acDevice = await getAcDeviceByDeviceId(deviceId);
    
    if (!acDevice) {
      return c.json({ error: 'AC device not found' }, 404);
    }
    
    const acState = await getAcStateByAcDeviceId(acDevice.id);
    
    if (!acState) {
      return c.json({ error: 'AC state not found' }, 404);
    }
    
    return c.json({
      power: acState.power,
      temperature: acState.temperature,
      mode: acState.mode,
      fan: acState.fan
    });
  } catch (error) {
    console.error('Error getting AC state:', error);
    return c.json({ error: 'Failed to get state' }, 500);
  }
});

export default app; 