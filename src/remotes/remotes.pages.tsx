import { Hono } from 'hono'
import { RemotesPage } from './pages/remotes.page';
import { AddRemotePage } from './pages/addRemote.page';
import { getRemotes, addRemote, deleteRemote } from './remotes.service';

const app = new Hono()

app.get('/remotes', async (c) => {
  const remotes = await getRemotes();
  return c.render(RemotesPage({remotes}))
})

app.get('/remotes/add', (c) => {
  return c.render(AddRemotePage())
})

app.post('/remotes/add', async (c) => {
  try {
    const formData = await c.req.formData();
    const name = formData.get('name') as string;
    const icon = formData.get('icon') as string;
    const pairingCode = formData.get('pairingCode') as string;

    if (!name || !icon || !pairingCode) {
      return c.text('Name, icon, and pairing code are required', 400);
    }

    // Validate pairing code format (6 alphanumeric characters)
    if (!/^[A-Za-z0-9]{6}$/.test(pairingCode)) {
      return c.text('Pairing code must be exactly 6 alphanumeric characters', 400);
    }

    await addRemote({ name, icon, pairingCode: pairingCode.toUpperCase() });
    
    // Redirect back to remotes list
    const remotes = await getRemotes();
    return c.render(RemotesPage({remotes}));
  } catch (error) {
    console.error('Error adding remote:', error);
    return c.text('Error adding remote', 500);
  }
})

app.delete('/remotes/:id', async (c) => {
  try {
    const remoteId = parseInt(c.req.param('id'));
    
    if (isNaN(remoteId)) {
      return c.text('Invalid remote ID', 400);
    }

    await deleteRemote(remoteId);
    
    // Return updated remotes list
    const remotes = await getRemotes();
    return c.render(RemotesPage({remotes}));
  } catch (error) {
    console.error('Error deleting remote:', error);
    return c.text('Error deleting remote', 500);
  }
})

export default app;