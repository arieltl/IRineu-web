import { raw } from "hono/html";

export const AcThermostatPage = ({device, acDevice, acState}: {device: any, acDevice: any, acState: any}) => {
    return (
        <div class="p-4" x-data={`{
            power: ${acState?.power || false},
            temperature: ${acState?.temperature || 23},
            mode: '${acState?.mode || 'Cool'}',
            fan: '${acState?.fan || 'Auto'}',
            pollInterval: null,
            
            async sendCommand() {
                const commandData = {
                    protocol: '${acDevice.protocol}',
                    model: ${acDevice.model},
                    power: this.power,
                    temperature: this.temperature,
                    mode: this.mode,
                    fan: this.fan
                };
                
                try {
                    await fetch('/ac/${device.id}/send-command', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(commandData)
                    });
                } catch (error) {
                    console.error('Error sending command:', error);
                }
            },
            
            async pollState() {
                try {
                    const response = await fetch('/ac/${device.id}/state');
                    const state = await response.json();
                    this.power = state.power;
                    this.temperature = state.temperature;
                    this.mode = state.mode;
                    this.fan = state.fan;
                } catch (error) {
                    console.error('Error polling state:', error);
                }
            },
            
            startPolling() {
                this.pollInterval = setInterval(() => {
                    this.pollState();
                }, 3000);
            },
            
            stopPolling() {
                if (this.pollInterval) {
                    clearInterval(this.pollInterval);
                    this.pollInterval = null;
                }
            }
        }`} 
        x-init="startPolling()" 
        {...{"x-on:beforeunload.window":"stopPolling()"}}>
        
            {/* Header */}
            <div class="flex items-center gap-4 mb-6">
                <a href="/devices" 
                   hx-get="/devices"
                   hx-target="#main-content"
                   hx-push-url="true"
                   class="btn btn-ghost btn-sm">
                    <i class="fas fa-arrow-left"></i>
                </a>
                <div class="flex items-center gap-3 flex-1">
                    <div class="w-12 h-12 bg-base-300 rounded-lg flex items-center justify-center">
                        {device.imageUrl ? (
                            <img 
                                src={device.imageUrl} 
                                alt={device.name}
                                class="w-full h-full object-cover rounded-lg"
                            />
                        ) : (
                            <i class={`fas ${device.icon} text-2xl text-primary`}></i>
                        )}
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold">{device.name}</h1>
                        <p class="text-sm opacity-70">
                            {acDevice.protocol} - Model {acDevice.model}
                        </p>
                    </div>
                </div>
            </div>

            {/* Thermostat Control */}
            <div class="max-w-md mx-auto">
                {/* Power Toggle */}
                <div class="card bg-base-100 shadow-xl mb-6">
                    <div class="card-body text-center">
                        <div class="form-control w-fit mx-auto">
                            <label class="label cursor-pointer gap-4">
                                <span class="label-text text-lg font-semibold">Power</span>
                                <input 
                                    type="checkbox" 
                                    class="toggle toggle-primary toggle-lg" 
                                    x-model="power"
                                    x-on:change="sendCommand()"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Temperature Control */}
                <div class="card bg-base-100 shadow-xl mb-6" x-show="power">
                    <div class="card-body">
                        <h3 class="card-title justify-center mb-4">Temperature</h3>
                        
                        <div class="flex items-center justify-center gap-4 mb-4">
                            <button 
                                class="btn btn-circle btn-lg btn-primary"
                                x-on:click="temperature = Math.max(16, temperature - 1); sendCommand()"
                            >
                                <i class="fas fa-minus text-xl"></i>
                            </button>
                            
                            <div class="text-center">
                                <div class="text-4xl font-bold" x-text="temperature"></div>
                                <div class="text-sm opacity-70">°C</div>
                            </div>
                            
                            <button 
                                class="btn btn-circle btn-lg btn-primary"
                                x-on:click="temperature = Math.min(30, temperature + 1); sendCommand()"
                            >
                                <i class="fas fa-plus text-xl"></i>
                            </button>
                        </div>
                        
                        <input 
                            type="range" 
                            min="16" 
                            max="30" 
                            class="range range-primary" 
                            x-model="temperature"
                            x-on:change="sendCommand()"
                        />
                    </div>
                </div>

                {/* Mode Control */}
                <div class="card bg-base-100 shadow-xl mb-6" x-show="power">
                    <div class="card-body">
                        <h3 class="card-title justify-center mb-4">Mode</h3>
                        
                        <div class="grid grid-cols-2 gap-2">
                            <button 
                                class="btn btn-outline"
                                x-bind:class="mode === 'Cool' ? 'btn-primary' : 'btn-outline'"
                                x-on:click="mode = 'Cool'; sendCommand()"
                            >
                                <i class="fas fa-snowflake mr-2"></i>
                                Cool
                            </button>
                            
                            <button 
                                class="btn btn-outline"
                                x-bind:class="mode === 'Heat' ? 'btn-primary' : 'btn-outline'"
                                x-on:click="mode = 'Heat'; sendCommand()"
                            >
                                <i class="fas fa-fire mr-2"></i>
                                Heat
                            </button>
                            
                            <button 
                                class="btn btn-outline"
                                x-bind:class="mode === 'Dry' ? 'btn-primary' : 'btn-outline'"
                                x-on:click="mode = 'Dry'; sendCommand()"
                            >
                                <i class="fas fa-tint mr-2"></i>
                                Dry
                            </button>
                            
                            <button 
                                class="btn btn-outline"
                                x-bind:class="mode === 'Fan' ? 'btn-primary' : 'btn-outline'"
                                x-on:click="mode = 'Fan'; sendCommand()"
                            >
                                <i class="fas fa-fan mr-2"></i>
                                Fan
                            </button>
                            
                            <button 
                                class="btn btn-outline col-span-2"
                                x-bind:class="mode === 'Auto' ? 'btn-primary' : 'btn-outline'"
                                x-on:click="mode = 'Auto'; sendCommand()"
                            >
                                <i class="fas fa-magic mr-2"></i>
                                Auto
                            </button>
                        </div>
                    </div>
                </div>

                {/* Fan Speed Control */}
                <div class="card bg-base-100 shadow-xl mb-6" x-show="power">
                    <div class="card-body">
                        <h3 class="card-title justify-center mb-4">Fan Speed</h3>
                        
                        <div class="grid grid-cols-2 gap-2">
                            <button 
                                class="btn btn-outline"
                                x-bind:class="fan === 'Auto' ? 'btn-primary' : 'btn-outline'"
                                x-on:click="fan = 'Auto'; sendCommand()"
                            >
                                <i class="fas fa-magic mr-2"></i>
                                Auto
                            </button>
                            
                            <button 
                                class="btn btn-outline"
                                x-bind:class="fan === 'Min' ? 'btn-primary' : 'btn-outline'"
                                x-on:click="fan = 'Min'; sendCommand()"
                            >
                                <i class="fas fa-fan mr-2"></i>
                                Min
                            </button>
                            
                            <button 
                                class="btn btn-outline"
                                x-bind:class="fan === 'Low' ? 'btn-primary' : 'btn-outline'"
                                x-on:click="fan = 'Low'; sendCommand()"
                            >
                                <i class="fas fa-fan mr-2"></i>
                                Low
                            </button>
                            
                            <button 
                                class="btn btn-outline"
                                x-bind:class="fan === 'Medium' ? 'btn-primary' : 'btn-outline'"
                                x-on:click="fan = 'Medium'; sendCommand()"
                            >
                                <i class="fas fa-fan mr-2"></i>
                                Medium
                            </button>
                            
                            <button 
                                class="btn btn-outline col-span-2"
                                x-bind:class="fan === 'Max' ? 'btn-primary' : 'btn-outline'"
                                x-on:click="fan = 'Max'; sendCommand()"
                            >
                                <i class="fas fa-fan mr-2"></i>
                                Max
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 