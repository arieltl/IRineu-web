import { db } from '../db';
import { 
  acDevicesTable, 
  acStatesTable, 
  devicesTable,
  type NewAcDevice, 
  type NewAcState,
  type AcDevice,
  type AcState
} from '../schema';
import { eq, and } from 'drizzle-orm';

export interface AcStateUpdate {
  protocol: string;
  model: number;
  power: boolean;
  temperature: number;
  mode: string;
  fan: string;
}

export interface AcCommandData {
  protocol: string;
  model: number;
  power: boolean;
  temperature: number;
  mode: string;
  fan: string;
}

export const getAcDeviceByDeviceId = async (deviceId: number) => {
  try {
    const [acDevice] = await db
      .select()
      .from(acDevicesTable)
      .where(eq(acDevicesTable.deviceId, deviceId));
    return acDevice;
  } catch (error) {
    console.error('Error fetching AC device:', error);
    return null;
  }
};

export const getAcDevicesByProtocolAndModel = async (protocol: string, model: number) => {
  try {
    const acDevices = await db
      .select({
        acDevice: acDevicesTable,
        device: devicesTable
      })
      .from(acDevicesTable)
      .leftJoin(devicesTable, eq(acDevicesTable.deviceId, devicesTable.id))
      .where(and(
        eq(acDevicesTable.protocol, protocol),
        eq(acDevicesTable.model, model)
      ));
    return acDevices;
  } catch (error) {
    console.error('Error fetching AC devices by protocol and model:', error);
    return [];
  }
};

export const addAcDevice = async (acDeviceData: NewAcDevice) => {
  try {
    const [newAcDevice] = await db
      .insert(acDevicesTable)
      .values(acDeviceData)
      .returning();
    
    // Create initial AC state
    const initialState: NewAcState = {
      acDeviceId: newAcDevice.id,
      power: false,
      temperature: 23,
      mode: 'Cool',
      fan: 'Auto'
    };
    
    await db.insert(acStatesTable).values(initialState);
    
    return newAcDevice;
  } catch (error) {
    console.error('Error adding AC device:', error);
    throw error;
  }
};

export const getAcStateByAcDeviceId = async (acDeviceId: number) => {
  try {
    const [acState] = await db
      .select()
      .from(acStatesTable)
      .where(eq(acStatesTable.acDeviceId, acDeviceId));
    return acState;
  } catch (error) {
    console.error('Error fetching AC state:', error);
    return null;
  }
};

export const updateAcState = async (acDeviceId: number, stateData: Partial<NewAcState>) => {
  try {
    const [updatedState] = await db
      .update(acStatesTable)
      .set(stateData)
      .where(eq(acStatesTable.acDeviceId, acDeviceId))
      .returning();
    return updatedState;
  } catch (error) {
    console.error('Error updating AC state:', error);
    throw error;
  }
};

export const updateAcStatesByProtocolAndModel = async (
  protocol: string, 
  model: number, 
  stateUpdate: AcStateUpdate
) => {
  try {
    // Get all AC devices with matching protocol and model
    const acDevices = await getAcDevicesByProtocolAndModel(protocol, model);
    
    const updatePromises = acDevices.map(({ acDevice }) => 
      updateAcState(acDevice.id, {
        power: stateUpdate.power,
        temperature: stateUpdate.temperature,
        mode: stateUpdate.mode,
        fan: stateUpdate.fan
      })
    );
    
    await Promise.all(updatePromises);
    return acDevices.length;
  } catch (error) {
    console.error('Error updating AC states by protocol and model:', error);
    throw error;
  }
};

export const deleteAcDevice = async (deviceId: number) => {
  try {
    const acDevice = await getAcDeviceByDeviceId(deviceId);
    if (acDevice) {
      // Delete AC state first (foreign key constraint)
      await db.delete(acStatesTable).where(eq(acStatesTable.acDeviceId, acDevice.id));
      // Delete AC device
      await db.delete(acDevicesTable).where(eq(acDevicesTable.id, acDevice.id));
    }
  } catch (error) {
    console.error('Error deleting AC device:', error);
    throw error;
  }
}; 