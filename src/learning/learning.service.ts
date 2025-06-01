



import { eq } from "drizzle-orm";
import { db } from "../db";
import mqttClient from "../mqtt/mqtt.service";
import { commandsTable } from "../schema";
import { getRemoteByDeviceId, getRemoteByPairingCode } from "../remotes/remotes.service";

export const getCommandById = async (commandId: number) => {
    const result = await db.select().from(commandsTable).where(eq(commandsTable.id, commandId));
    return result[0] || null;
};

const learningSessions = new Map<number,any>()

export const getSession = (deviceId: number) => {
    return learningSessions.get(deviceId);
}

export const clearSession = (deviceId: number) => {
    learningSessions.delete(deviceId);
}

export const startLearningSession = async (commandId: number, commandName: string, deviceId: number) => {
    const remote = await getRemoteByDeviceId(deviceId);
    if (!remote) {
        throw new Error('Remote not found for device');
    }
    
    learningSessions.set(remote.id, {
        commandId,
        commandName,
        deviceId,
        createdAt: new Date(),
    });
    
    return remote;
}

export const createCommand = async (deviceId: number, name: string, icon: string, color: string) => {
    const command = await db.insert(commandsTable).values({
        deviceId,
        name,
        icon,
        color,
        irData: ""
    }).returning()
    const commandId = command[0].id
    const remote = await getRemoteByDeviceId(deviceId)
    learningSessions.set(remote!.id,{
        commandId,
        commandName: name,
        deviceId,
        createdAt: new Date(),
    })
}

mqttClient.on("message",async (topic, message)  => {
    console.log(topic, message)
    if (topic.startsWith("raw/") && topic.endsWith("/report")) {
        console.log("raw/report")

        const str = message.toString()
        console.log(str)
        const timigs = str.split(" ")
        const nTimings = timigs.length 
        // convert nTimings to a string representaion of 4 digit hex
        const hexString = nTimings.toString(16).padStart(4, '0')
 str
        const newStr = hexString + " " + str
        
        
        const pairingCode = topic.split("/")[1]
        const  remote = await getRemoteByPairingCode(pairingCode)
        console.log(learningSessions)
        const session = learningSessions.get(remote!.id)
        console.log(session)
        if (session) {
            console.log("session found")
            const str = message.toString()
            console.log(str)
            const timigs = str.split(" ")
            const nTimings = timigs.length 
            // convert nTimings to a string representaion of 4 digit hex
            const hexString = nTimings.toString(16).padStart(4, '0')
            const newStr = hexString + " " + str
            await db.update(commandsTable).set({
                irData: newStr
            }).where(eq(commandsTable.id, session.commandId))
            
            // Mark session as completed but don't delete it yet
            session.completed = true;
            session.completedAt = new Date();
        }
    }
})

const maxMinutes = 5;

setInterval(() => {
    console.log("clearing sessions")
    learningSessions.forEach((session, deviceId) => {
        if (session.createdAt.getTime() + maxMinutes * 60 * 1000 < Date.now()) {
            learningSessions.delete(deviceId)
        }
    })
}, 1000)