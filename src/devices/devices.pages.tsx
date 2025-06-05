import { Hono } from "hono";
import { DevicesPage } from "./pages/devices.page";
import { AddDevicePage } from "./pages/addDevice.page";
import { SimpleDevicePage } from "./pages/simpleDevice.page";
import { getDevices, addDevice, deleteDevice } from "./devices.service";
import { getRemotes } from "../remotes/remotes.service";
import { getCommandsByDeviceId } from "../commands/commands.service";

const app = new Hono()

app.get('/devices', async (c) => {
  // add fake delay to simulate loading
  await new Promise(resolve => setTimeout(resolve, 1000))
  const devices = await getDevices();
  return c.render(DevicesPage({devices}))
  })

app.get('/devices/add', async (c) => {
  const remotes = await getRemotes();
  return c.render(AddDevicePage({remotes}))
})

app.get('/devices/:id/simple', async (c) => {
  const deviceId = parseInt(c.req.param('id'));
  const devices = await getDevices();
  const device = devices.find(d => d.id === deviceId);
  
  if (!device) {
    return c.text('Device not found', 404);
  }
  
  if (device.type !== 'simple') {
    return c.text('This is not a simple device', 400);
  }
  
  const commands = await getCommandsByDeviceId(deviceId);
  
  return c.render(SimpleDevicePage({device, commands}));
})

app.post('/devices/add', async (c) => {
  try {
    const formData = await c.req.formData();
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const icon = formData.get('icon') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const remoteId = formData.get('remoteId') as string;

    if (!name || !type || !icon || !remoteId) {
      return c.text('Name, type, icon, and remote are required', 400);
    }

    // Validate device type
    if (!['AC', 'simple'].includes(type)) {
      return c.text('Device type must be either "AC" or "simple"', 400);
    }

    const deviceData: any = {
      name,
      type,
      icon,
      remoteId: parseInt(remoteId)
    };

    // Only add imageUrl if it's provided and not empty
    if (imageUrl && imageUrl.trim() !== '') {
      deviceData.imageUrl = imageUrl.trim();
    }

    await addDevice(deviceData);
    
    // Redirect back to devices list
    const devices = await getDevices();
    return c.render(DevicesPage({devices}));
  } catch (error) {
    console.error('Error adding device:', error);
    return c.text('Error adding device', 500);
  }
})

// Delete device
app.delete('/devices/:id', async (c) => {
  try {
    const deviceId = parseInt(c.req.param('id'));
    
    await deleteDevice(deviceId);
    
    // Return success response for HTMX
    return c.text('Device deleted successfully');
  } catch (error) {
    console.error('Error deleting device:', error);
    return c.text('Error deleting device', 500);
  }
})

export default app
