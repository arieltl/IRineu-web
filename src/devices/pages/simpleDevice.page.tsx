import { raw } from "hono/html";

export const SimpleDevicePage = ({device, commands}: {device: any, commands: any[]}) => {

    return (
        <div class="p-4" x-data="{ editMode: false }">
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
                        <p class="text-sm opacity-70">Simple Device Controls</p>
                    </div>
                </div>
                
                {/* Edit Button */}
                <button 
                    class="btn btn-ghost btn-sm"
                    x-on:click="editMode = !editMode"
                    x-bind:class="editMode ? 'btn-error' : 'btn-ghost'"
                >
                    <i x-bind:style="!editMode ? 'display: inline' : 'display: none'" class="fas fa-edit"></i>
                    <i x-bind:style="editMode ? 'display: inline' : 'display: none'" class="fas fa-times"></i>
                    <span x-text="editMode ? 'Cancel' : 'Edit'" class="ml-1"></span>
                </button>
            </div>

            {/* Add Command Button */}
            <div class="mb-6">
                <a 
                    href={`/devices/${device.id}/add-command`}
                    hx-get={`/devices/${device.id}/add-command`}
                    hx-target="#main-content"
                    hx-push-url="true"
                    class="btn btn-primary btn-outline w-full"
                >
                    <i class="fas fa-plus"></i>
                    Add New Command
                </a>
            </div>

            {/* Commands Grid */}
            <div class="max-w-4xl mx-auto">
                {commands.length > 0 ? (
                    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {commands.map((command) => {
                            const isLearned = command.irData && command.irData.trim() !== '';
                            return (
                                <div key={command.id} id={`command-${command.id}`} class="relative">
                                    <button 
                                        class={`btn w-20 h-20 flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
                                            isLearned 
                                                ? `${command.color} hover:scale-105 active:scale-95` 
                                                : 'btn-outline btn-primary hover:scale-105'
                                        }`}
                                        x-bind:disabled="editMode"
                                        x-bind:class="editMode ? 'opacity-50 cursor-not-allowed' : ''"
                                        {...(isLearned ? {
                                            'hx-post': `/devices/${device.id}/send-command/${command.id}`,
                                            'hx-target': '#command-toast',
                                            'hx-swap': 'innerHTML'
                                        } : {
                                            'hx-post': `/devices/${device.id}/learn-command/${command.id}`,
                                            'hx-target': '#main-content',
                                            'hx-push-url': 'true'
                                        })}>
                                        {isLearned ? (
                                            <i class={`fas ${command.icon} text-lg`}></i>
                                        ) : (
                                            <>
                                                <i class="fas fa-satellite-dish text-lg text-primary"></i>
                                                <span class="text-xs font-bold text-primary">LEARN</span>
                                            </>
                                        )}
                                        <span class="text-xs font-medium leading-tight text-center">{command.name}</span>
                                    </button>
                                    
                                    {/* Delete Badge */}
                                    <button
                                        class="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error shadow-lg transition-all duration-200"
                                        x-bind:style="editMode ? 'display: block' : 'display: none'"
                                        hx-delete={`/devices/${device.id}/delete-command/${command.id}`}
                                        hx-target={`#command-${command.id}`}
                                        hx-swap="delete"
                                        hx-confirm="Are you sure you want to delete this command?"
                                    >
                                        <i class="fas fa-trash text-xs"></i>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div class="text-center py-12">
                        <div class="flex flex-col items-center gap-4">
                            <div class="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center">
                                <i class="fas fa-satellite-dish text-4xl text-base-content/30"></i>
                            </div>
                            <div>
                                <h3 class="text-xl font-semibold text-base-content/70 mb-2">No Commands Yet</h3>
                                <p class="text-sm text-base-content/50">
                                    Start by adding your first command to control this device
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>



            {/* Toast for feedback */}
            <div id="command-toast" class="toast toast-top toast-center hidden"></div>

            <script>{raw`
                // Show toast when HTMX content is swapped in
                document.addEventListener('htmx:afterSwap', function(evt) {
                    if (evt.target.id === 'command-toast') {
                        const toast = evt.target;
                        toast.classList.remove('hidden');
                        
                        // Hide toast after 3 seconds
                        setTimeout(() => {
                            toast.classList.add('hidden');
                        }, 3000);
                    }
                });
                
                // Prevent HTMX requests when in edit mode
                document.addEventListener('htmx:beforeRequest', function(evt) {
                    // Check if the triggering element is disabled
                    if (evt.target.disabled) {
                        evt.preventDefault();
                    }
                });
            `}</script>
        </div>
    )
} 