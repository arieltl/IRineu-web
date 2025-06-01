import { db } from '../db';
import { commandsTable, type NewCommand } from '../schema';
import { eq } from 'drizzle-orm';

export const getCommandsByDeviceId = async (deviceId: number) => {
    try {
        const commands = await db.select().from(commandsTable).where(eq(commandsTable.deviceId, deviceId));
        return commands;
    } catch (error) {
        console.error('Error fetching commands:', error);
        // Return empty array if database is not available
        return [];
    }
};

export const addCommand = async (commandData: NewCommand) => {
    try {
        const [newCommand] = await db.insert(commandsTable).values(commandData).returning();
        return newCommand;
    } catch (error) {
        console.error('Error adding command:', error);
        throw error;
    }
};

export const updateCommand = async (id: number, commandData: Partial<NewCommand>) => {
    try {
        const [updatedCommand] = await db.update(commandsTable)
            .set(commandData)
            .where(eq(commandsTable.id, id))
            .returning();
        return updatedCommand;
    } catch (error) {
        console.error('Error updating command:', error);
        throw error;
    }
};

export const deleteCommand = async (id: number) => {
    try {
        await db.delete(commandsTable).where(eq(commandsTable.id, id));
    } catch (error) {
        console.error('Error deleting command:', error);
        throw error;
    }
};

 