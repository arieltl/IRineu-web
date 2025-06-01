export const AddCommandPage = ({ device }: { device: any }) => {
    return (
        <div class="p-4">
            {/* Header */}
            <div class="flex items-center gap-4 mb-6">
                <a href={`/devices/${device.id}/simple`}
                   hx-get={`/devices/${device.id}/simple`}
                   hx-target="#main-content"
                   hx-push-url="true"
                   class="btn btn-ghost btn-sm">
                    <i class="fas fa-arrow-left"></i>
                </a>
                <div class="flex items-center gap-3">
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
                        <h1 class="text-2xl font-bold">Add Command</h1>
                        <p class="text-sm opacity-70">{device.name}</p>
                    </div>
                </div>
            </div>

            {/* Add Command Form */}
            <div class="max-w-md mx-auto">
                <form 
                    hx-post={`/devices/${device.id}/add-command`}
                    hx-target="#main-content"
                    hx-push-url="true"
                    class="space-y-6"
                >
                    {/* Command Name */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold">Command Name</span>
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="e.g., Netflix, Sleep Timer..." 
                            class="input input-bordered input-lg" 
                            required 
                            autofocus
                        />
                        <label class="label">
                            <span class="label-text-alt">Choose a descriptive name for this command</span>
                        </label>
                    </div>

                    {/* Icon Selection */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold">Icon</span>
                        </label>
                        <select 
                            name="icon" 
                            class="select select-bordered select-lg" 
                            required 
                            x-data="{ selectedIcon: 'fa-circle' }" 
                            x-model="selectedIcon"
                        >
                            <option value="" disabled selected>Choose an icon</option>
                            <option value="fa-power-off">Power</option>
                            <option value="fa-play">Play</option>
                            <option value="fa-pause">Pause</option>
                            <option value="fa-stop">Stop</option>
                            <option value="fa-volume-up">Volume Up</option>
                            <option value="fa-volume-down">Volume Down</option>
                            <option value="fa-volume-mute">Mute</option>
                            <option value="fa-chevron-up">Up</option>
                            <option value="fa-chevron-down">Down</option>
                            <option value="fa-chevron-left">Left</option>
                            <option value="fa-chevron-right">Right</option>
                            <option value="fa-check">OK</option>
                            <option value="fa-arrow-left">Back</option>
                            <option value="fa-home">Home</option>
                            <option value="fa-bars">Menu</option>
                            <option value="fa-cog">Settings</option>
                            <option value="fa-exchange-alt">Input</option>
                            <option value="fa-wifi">WiFi</option>
                            <option value="fa-bluetooth">Bluetooth</option>
                            <option value="fa-tv">TV</option>
                            <option value="fa-film">Movies</option>
                            <option value="fa-music">Music</option>
                            <option value="fa-gamepad">Gaming</option>
                            <option value="fa-bed">Sleep</option>
                            <option value="fa-sun">Bright</option>
                            <option value="fa-moon">Dark</option>
                            <option value="fa-circle">Default</option>
                        </select>
                        
                        {/* Icon Preview */}
                        <div class="mt-3 flex items-center justify-center p-4 bg-base-200 rounded-lg">
                            <div class="flex items-center gap-3">
                                <span class="text-sm font-medium">Preview:</span>
                                <i class="fas text-3xl text-primary" x-bind:class="selectedIcon"></i>
                            </div>
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text font-semibold">Button Color</span>
                        </label>
                        <div class="grid grid-cols-3 gap-3">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="color" value="btn-primary" class="radio radio-primary" required />
                                <span class="btn btn-primary btn-sm">Primary</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="color" value="btn-secondary" class="radio radio-secondary" />
                                <span class="btn btn-secondary btn-sm">Secondary</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="color" value="btn-accent" class="radio radio-accent" />
                                <span class="btn btn-accent btn-sm">Accent</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="color" value="btn-success" class="radio radio-success" />
                                <span class="btn btn-success btn-sm">Success</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="color" value="btn-warning" class="radio radio-warning" />
                                <span class="btn btn-warning btn-sm">Warning</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="color" value="btn-error" class="radio radio-error" />
                                <span class="btn btn-error btn-sm">Error</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="color" value="btn-info" class="radio radio-info" />
                                <span class="btn btn-info btn-sm">Info</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="color" value="btn-neutral" class="radio radio-neutral" />
                                <span class="btn btn-neutral btn-sm">Neutral</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="color" value="btn-ghost" class="radio" />
                                <span class="btn btn-ghost btn-sm">Ghost</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div class="form-control mt-8">
                        <button type="submit" class="btn btn-primary btn-lg">
                            <i class="fas fa-satellite-dish"></i>
                            Start Learning Command
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 