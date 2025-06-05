import { eq } from "drizzle-orm";
import { db } from "../db";
import mqttClient from "../mqtt/mqtt.service";
import { acDevicesTable, acStatesTable } from "../schema";
import { getRemoteByDeviceId, getRemoteByPairingCode } from "../remotes/remotes.service";
import { addAcDevice, updateAcStatesByProtocolAndModel, type AcStateUpdate } from "./ac.service";

// Store active AC adoption sessions
const acAdoptionSessions = new Map<number, any>();

export const getAcAdoptionSession = (remoteId: number) => {
    return acAdoptionSessions.get(remoteId);
};

export const clearAcAdoptionSession = (remoteId: number) => {
    acAdoptionSessions.delete(remoteId);
};

export const startAcAdoptionSession = async (deviceId: number) => {
    const remote = await getRemoteByDeviceId(deviceId);
    if (!remote) {
        throw new Error('Remote not found for device');
    }
    
    acAdoptionSessions.set(remote.id, {
        deviceId,
        remoteId: remote.id,
        pairingCode: remote.pairingCode,
        createdAt: new Date(),
        completed: false
    });
    
    return remote;
};

// Handle MQTT messages for AC devices
mqttClient.on("message", async (topic, message) => {
    console.log("AC MQTT:", topic, message.toString());
    
    // Handle AC state updates - format: ac/PAIRINGCODE/state
    if (topic.startsWith("ac/") && topic.endsWith("/state")) {
        try {
            const pairingCode = topic.split("/")[1];
            const remote = await getRemoteByPairingCode(pairingCode);
            
            if (!remote) {
                console.log("Remote not found for pairing code:", pairingCode);
                return;
            }
            
                    const stateData = JSON.parse(message.toString()) as AcStateUpdate;
        console.log("AC State Update:", stateData);
        console.log("Remote found:", remote);
        console.log("Looking for adoption session with remote ID:", remote.id);
        console.log("Available adoption sessions:", Array.from(acAdoptionSessions.entries()));
        
        // Check if this is part of an adoption session
        const adoptionSession = acAdoptionSessions.get(remote.id);
        console.log("Adoption session found:", adoptionSession);
        
        if (adoptionSession && !adoptionSession.completed) {
                console.log("AC Adoption session found, creating AC device");
                
                // Create AC device with the learned protocol and model
                await addAcDevice({
                    deviceId: adoptionSession.deviceId,
                    protocol: stateData.protocol,
                    model: stateData.model
                });
                
                            // Mark session as completed
            adoptionSession.completed = true;
            adoptionSession.completedAt = new Date();
            adoptionSession.protocol = stateData.protocol;
            adoptionSession.model = stateData.model;
            
            console.log("AC device adopted successfully");
            console.log("Session after marking completed:", adoptionSession);
            console.log("Session in map after update:", acAdoptionSessions.get(remote.id));
            }
            
            // Update all AC devices with matching protocol and model
            const updatedCount = await updateAcStatesByProtocolAndModel(
                stateData.protocol,
                stateData.model,
                stateData
            );
            
            console.log(`Updated ${updatedCount} AC devices with protocol ${stateData.protocol}, model ${stateData.model}`);
            
        } catch (error) {
            console.error("Error processing AC state update:", error);
        }
    }
    
    // Handle AC learning during adoption - format: ac/PAIRINGCODE/learn
    if (topic.startsWith("ac/") && topic.endsWith("/learn")) {
        try {
            const pairingCode = topic.split("/")[1];
            const remote = await getRemoteByPairingCode(pairingCode);
            
            if (!remote) {
                console.log("Remote not found for pairing code:", pairingCode);
                return;
            }
            
            const adoptionSession = acAdoptionSessions.get(remote.id);
            if (adoptionSession && !adoptionSession.completed) {
                const learnData = JSON.parse(message.toString());
                console.log("AC Learn data:", learnData);
                
                // Create AC device with the learned protocol and model
                await addAcDevice({
                    deviceId: adoptionSession.deviceId,
                    protocol: learnData.protocol,
                    model: learnData.model
                });
                
                // Mark session as completed
                adoptionSession.completed = true;
                adoptionSession.completedAt = new Date();
                adoptionSession.protocol = learnData.protocol;
                adoptionSession.model = learnData.model;
                
                console.log("AC device adopted via learn topic");
            }
        } catch (error) {
            console.error("Error processing AC learn message:", error);
        }
    }
});

// Clean up old adoption sessions
const maxMinutes = 5;

setInterval(() => {
    console.log("Cleaning up AC adoption sessions");
    acAdoptionSessions.forEach((session, remoteId) => {
        if (session.createdAt.getTime() + maxMinutes * 60 * 1000 < Date.now()) {
            console.log("Removing expired AC adoption session for remote:", remoteId);
            acAdoptionSessions.delete(remoteId);
        }
    });
}, 30000); // Check every 30 seconds

export { acAdoptionSessions }; 