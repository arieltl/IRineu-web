import { db } from '../db';
import { devicesTable, type NewDevice } from '../schema';
import { eq } from 'drizzle-orm';
import { deleteAcDevice } from '../ac/ac.service';

export const getDevices = async () => {
    try {
        const devices = await db.select().from(devicesTable);
        
        // If no devices exist, return some default data
        if (devices.length === 0) {
            return [
                {
                    id: 1,
                    name: 'Living Room TV',
                    type: 'simple',
                    icon: 'fa-tv',
                    imageUrl: null
                },
                {
                    id: 2,
                    name: 'Samsung Smart TV',
                    type: 'simple',
                    icon: 'fa-tv',
                    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop&crop=center'
                },
                {
                    id: 3,
                    name: 'LG Air Conditioner',
                    type: 'AC',
                    icon: 'fa-snowflake',
                    imageUrl: 'https://images.unsplash.com/photo-1581783898377-1dcfeada7e50?w=400&h=300&fit=crop&crop=center'
                },
                {
                    id: 4,
                    name: 'Bedroom AC Unit',
                    type: 'AC',
                    icon: 'fa-snowflake',
                    imageUrl: null
                },
                {
                    id: 5,
                    name: 'Sound System',
                    type: 'simple',
                    icon: 'fa-volume-high',
                    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop&crop=center'
                },
                {
                    id: 6,
                    name: 'Kitchen TV',
                    type: 'simple',
                    icon: 'fa-tv',
                    imageUrl: null
                },
                {
                    id: 7,
                    name: 'Office AC',
                    type: 'AC',
                    icon: 'fa-snowflake',
                    imageUrl: null
                },
                {
                    id: 8,
                    name: 'Projector',
                    type: 'simple',
                    icon: 'fa-video',
                    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center'
                },
                {
                    id: 9,
                    name: 'Ceiling Fan',
                    type: 'simple',
                    icon: 'fa-fan',
                    imageUrl: null
                },
                {
                    id: 10,
                    name: 'Guest Room AC',
                    type: 'AC',
                    icon: 'fa-snowflake',
                    imageUrl: 'https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=400&h=300&fit=crop&crop=center'
                }
            ];
        }
        
        return devices;
    } catch (error) {
        console.error('Error fetching devices:', error);
        // Return fallback data if database is not available
        return [
            {
                id: 1,
                name: 'Living Room TV',
                type: 'simple',
                icon: 'fa-tv',
                imageUrl: null
            },
            {
                id: 2,
                name: 'Samsung Smart TV',
                type: 'simple',
                icon: 'fa-tv',
                imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop&crop=center'
            },
            {
                id: 3,
                name: 'LG Air Conditioner',
                type: 'AC',
                icon: 'fa-snowflake',
                imageUrl: 'https://images.unsplash.com/photo-1581783898377-1dcfeada7e50?w=400&h=300&fit=crop&crop=center'
            }
        ];
    }
};

export const addDevice = async (deviceData: NewDevice) => {
    try {
        const [newDevice] = await db.insert(devicesTable).values(deviceData).returning();
        return newDevice;
    } catch (error) {
        console.error('Error adding device:', error);
        throw error;
    }
};

export const deleteDevice = async (deviceId: number) => {
    try {
        // Get device to check type
        const [device] = await db.select().from(devicesTable).where(eq(devicesTable.id, deviceId));
        
        if (!device) {
            throw new Error('Device not found');
        }
        
        // If it's an AC device, delete AC-related data first
        if (device.type === 'AC') {
            await deleteAcDevice(deviceId);
        }
        
        // Delete the device itself
        await db.delete(devicesTable).where(eq(devicesTable.id, deviceId));
        
        return device;
    } catch (error) {
        console.error('Error deleting device:', error);
        throw error;
    }
}; 