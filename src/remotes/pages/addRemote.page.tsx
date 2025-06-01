export const AddRemotePage = () => {
    return (
        <div class="p-4" x-data="{ selectedIcon: '', previewIcon: 'fa-question' }">
            <div class="flex items-center gap-4 mb-6">
                <a href="/remotes" 
                   hx-get="/remotes"
                   hx-target="#main-content"
                   hx-push-url="true"
                   class="btn btn-ghost btn-sm">
                    <i class="fas fa-arrow-left"></i>
                </a>
                <h1 class="text-2xl font-bold">Add New Remote</h1>
            </div>

            <div class="max-w-md mx-auto">
                <form hx-post="/remotes/add" 
                      hx-target="#main-content"
                      hx-push-url="/remotes"
                      class="space-y-4">
                    
                    {/* Remote Name */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Remote Name</span>
                        </label>
                        <input 
                            type="text" 
                            name="name"
                            placeholder="e.g., Living Room, Kitchen"
                            class="input input-bordered"
                            required
                        />
                    </div>

                    {/* Pairing Code */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Pairing Code</span>
                        </label>
                        <input 
                            type="text" 
                            name="pairingCode"
                            placeholder="Enter 6-digit pairing code"
                            class="input input-bordered font-mono text-center text-lg tracking-wider"
                            maxlength={6}
                            minlength={6}
                            pattern="[A-Za-z0-9]{6}"
                            title="Please enter exactly 6 alphanumeric characters"
                            required
                        />
                        <label class="label">
                            <span class="label-text-alt">Enter the 6-character code from your infrared hub device</span>
                        </label>
                    </div>

                    {/* Icon Selection */}
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Icon Name (Font Awesome)</span>
                        </label>
                        <select 
                            name="icon" 
                            class="select select-bordered" 
                            required
                            x-model="selectedIcon"
                            x-on:change="previewIcon = selectedIcon || 'fa-question'">
                            <option value="">Choose an icon</option>
                            <option value="fa-couch">🛋️ Couch (Living Room)</option>
                            <option value="fa-bed">🛏️ Bed (Bedroom)</option>
                            <option value="fa-utensils">🍴 Utensils (Kitchen)</option>
                            <option value="fa-wine-glass">🍷 Wine Glass (Dining Room)</option>
                            <option value="fa-briefcase">💼 Briefcase (Office)</option>
                            <option value="fa-child">👶 Child (Kids Room)</option>
                            <option value="fa-door-open">🚪 Door (Guest Room)</option>
                            <option value="fa-stairs">🪜 Stairs (Basement)</option>
                            <option value="fa-car">🚗 Car (Garage)</option>
                            <option value="fa-tv">📺 TV (Entertainment)</option>
                            <option value="fa-bath">🛁 Bath (Bathroom)</option>
                            <option value="fa-sun">☀️ Sun (Balcony/Patio)</option>
                            <option value="fa-tree">🌳 Tree (Garden)</option>
                            <option value="fa-home">🏠 Home (Main Area)</option>
                        </select>
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
                            Add Remote
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 