import mqtt, { MqttClient } from 'mqtt';


const mqttClient = mqtt.connect({
    host: "167.234.242.168",
    port: 1883,
    username: "test",
    password: "test"
});


mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
});



export const subscribe = (topic: string) => {
    mqttClient.subscribe(topic);
};

export const publish = (topic: string, message: string) => {
    mqttClient.publish(topic, message);
};

mqttClient.subscribe("raw/#")
mqttClient.subscribe("ac/#")
export default mqttClient;