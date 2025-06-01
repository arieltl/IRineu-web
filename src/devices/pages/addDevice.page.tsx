export const AddDevicePage = ({remotes}: {remotes: any[]}) => {
    return (
        <div class="p-4" x-data="{ selectedIcon: '', previewIcon: 'fa-question', selectedType: '' }">
            <div class="flex items-center gap-4 mb-6">
                <a href="/devices" 
                   hx-get="/devices"
                   hx-target="#main-content"
                   hx-push-url="true"
                   class="btn btn-ghost btn-sm">
                    <i class="fas fa-arrow-left"></i>
                </a>
                <h1 class="text-2xl font-bold">Add New Device</h1>
            </div>

            <div class="max-w-md mx-auto">
                <form hx-post="/devices/add" 
                      hx-target="#main-content"
                      hx-push-url="/devices"
                      class="space-y-4">
                    
                    {/* Device Name */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Device Name</span>
                        </label>
                        <input 
                            type="text" 
                            name="name"
                            placeholder="e.g., Living Room TV, Samsung AC"
                            class="input input-bordered"
                            required
                        />
                    </div>

                    {/* Device Type */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Device Type</span>
                        </label>
                        <select 
                            name="type" 
                            class="select select-bordered" 
                            required
                            x-model="selectedType">
                            <option value="">Choose device type</option>
                            <option value="AC">Air Conditioner</option>
                            <option value="simple">Simple Device (TV, Sound System, etc.)</option>
                        </select>
                    </div>

                    {/* Remote Selection */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Remote</span>
                        </label>
                        <select name="remoteId" class="select select-bordered" required>
                            <option value="">Choose remote</option>
                            {remotes.map((remote) => (
                                <option key={remote.id} value={remote.id}>
                                    <i class={`fas ${remote.icon}`}></i> {remote.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Icon Selection */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Device Icon</span>
                        </label>
                        <select 
                            name="icon" 
                            class="select select-bordered" 
                            required
                            x-model="selectedIcon"
                            x-on:change="previewIcon = selectedIcon || 'fa-question'">
                            <option value="">Choose an icon</option>
                            {/* AC Icons */}
                            <optgroup label="Air Conditioner">
                                <option value="fa-snowflake">❄️ Snowflake (AC)</option>
                                <option value="fa-temperature-low">🌡️ Temperature Low</option>
                                <option value="fa-wind">💨 Wind</option>
                            </optgroup>
                            {/* TV/Entertainment Icons */}
                            <optgroup label="Entertainment">
                                <option value="fa-tv">📺 TV</option>
                                <option value="fa-video">📹 Video/Projector</option>
                                <option value="fa-volume-high">🔊 Speaker/Sound System</option>
                                <option value="fa-headphones">🎧 Headphones</option>
                                <option value="fa-radio">📻 Radio</option>
                            </optgroup>
                            {/* General Device Icons */}
                            <optgroup label="General Devices">
                                <option value="fa-microchip">🔲 Microchip (General)</option>
                                <option value="fa-fan">🌀 Fan</option>
                                <option value="fa-lightbulb">💡 Light</option>
                                <option value="fa-plug">🔌 Power Device</option>
                                <option value="fa-satellite-dish">📡 Satellite</option>
                                <option value="fa-router">📶 Router/Network</option>
                            </optgroup>
                        </select>
                    </div>

                    {/* Image URL (Optional) */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Image URL (Optional)</span>
                        </label>
                        <input 
                            type="url" 
                            name="imageUrl"
                            placeholder="https://example.com/device-image.jpg"
                            class="input input-bordered"
                        />
                        <label class="label">
                            <span class="label-text-alt">Leave empty to use the icon instead</span>
                        </label>
                    </div>

                    {/* Icon Preview */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Icon Preview</span>
                        </label>
                        <div class="bg-base-200 rounded-lg p-4 text-center">
                            <i x-bind:class="`fas ${previewIcon} text-3xl text-primary`"></i>
                            <p class="text-sm mt-2 opacity-70" x-show="!selectedIcon">Select an icon to see preview</p>
                            <p class="text-sm mt-2 opacity-70" x-show="selectedIcon" x-text="`Selected: ${selectedIcon}`"></p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div class="form-control mt-6">
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus mr-2"></i>
                            Add Device
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 