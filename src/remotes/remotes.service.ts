import { db } from '../db';
import { remotesTable, devicesTable, type NewRemote } from '../schema';
import { eq } from 'drizzle-orm';

export const getRemotes = async () => {
    try {
        const remotes = await db.select().from(remotesTable);
        
        // If no remotes exist, return some default data
        if (remotes.length === 0) {
    return [
        {
            id: 1,
                    name: 'Living Room',
                    icon: 'fa-couch',
                    pairingCode: 'ABC123'
                },
                {
                    id: 2,
                    name: 'Main Bedroom',
                    icon: 'fa-bed',
                    pairingCode: 'DEF456'
                },
                {
                    id: 3,
                    name: 'Children Bedroom',
                    icon: 'fa-child',
                    pairingCode: 'GHI789'
                }
            ];
        }
        
        return remotes;
    } catch (error) {
        console.error('Error fetching remotes:', error);
        // Return fallback data if database is not available
        return [
            {
                id: 1,
                name: 'Living Room',
                icon: 'fa-couch',
                pairingCode: 'ABC123'
            },
            {
                id: 2,
                name: 'Main Bedroom',
                icon: 'fa-bed',
                pairingCode: 'DEF456'
            },
            {
                id: 3,
                name: 'Children Bedroom',
                icon: 'fa-child',
                pairingCode: 'GHI789'
        }
        ];
    }
};

export const addRemote = async (remoteData: NewRemote) => {
    try {
        const [newRemote] = await db.insert(remotesTable).values(remoteData).returning();
        return newRemote;
    } catch (error) {
        console.error('Error adding remote:', error);
        throw error;
    }
};

export const deleteRemote = async (remoteId: number) => {
    try {
        const [deletedRemote] = await db.delete(remotesTable)
            .where(eq(remotesTable.id, remoteId))
            .returning();
        return deletedRemote;
    } catch (error) {
        console.error('Error deleting remote:', error);
        throw error;
    }
};

export const getRemoteByDeviceId = async (deviceId: number) => {
    try {
        // First get the device to find its remoteId
        const [device] = await db.select().from(devicesTable).where(eq(devicesTable.id, deviceId));
        
        if (!device || !device.remoteId) {
            return null;
        }

        // Then get the remote using the remoteId
        const [remote] = await db.select().from(remotesTable).where(eq(remotesTable.id, device.remoteId));
        
        return remote || null;
    } catch (error) {
        console.error('Error fetching remote by device ID:', error);
        return null;
    }
};

export const getRemoteByPairingCode = async (pairingCode: string) => {
    try {
        const [remote] = await db.select().from(remotesTable).where(eq(remotesTable.pairingCode, pairingCode));
        
        return remote || null;
    } catch (error) {
        console.error('Error fetching remote by pairing code:', error);
        return null;
    }
};