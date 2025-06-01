export const LearningStatusPage = ({ device, commandName, commandIcon, commandColor }: { 
    device: any, 
    commandName: string, 
    commandIcon: string, 
    commandColor: string 
}) => {
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
                        <h1 class="text-2xl font-bold">Learning Command</h1>
                        <p class="text-sm opacity-70">{device.name}</p>
                    </div>
                </div>
            </div>

            {/* Learning Status */}
            <div class="max-w-md mx-auto text-center space-y-8">
                {/* Command Preview */}
                <div class="bg-base-200 rounded-2xl p-8">
                    <h2 class="text-lg font-semibold mb-4">Learning This Command:</h2>
                    <div class={`btn ${commandColor} btn-lg mx-auto`}>
                        <i class={`fas ${commandIcon} text-xl`}></i>
                        <span class="ml-2 font-medium">{commandName}</span>
                    </div>
                </div>

                {/* Instructions */}
                <div class="alert alert-info">
                    <i class="fas fa-info-circle text-2xl"></i>
                    <div class="text-left">
                        <h3 class="font-bold text-lg">Ready to Learn!</h3>
                        <ol class="list-decimal list-inside mt-2 space-y-1 text-sm">
                            <li>Point your remote control at the IR receiver</li>
                            <li>Press the button you want to learn</li>
                            <li>Wait for confirmation</li>
                        </ol>
                    </div>
                </div>

                {/* Status Indicator */}
                <div 
                    id="learning-status"
                    class="bg-primary/10 border-2 border-primary border-dashed rounded-2xl p-8"
                    hx-get={`/devices/${device.id}/learning-status`}
                    hx-trigger="every 2s"
                    hx-target="this"
                    hx-swap="outerHTML"
                >
                    <div class="flex flex-col items-center gap-4">
                        <div class="loading loading-spinner loading-lg text-primary"></div>
                        <div>
                            <h3 class="font-bold text-lg">Listening for IR Signal...</h3>
                            <p class="text-sm opacity-70 mt-1">Press the button on your remote now</p>
                        </div>
                    </div>
                </div>

                {/* Cancel Button */}
                <div class="pt-4">
                    <button 
                        class="btn btn-outline btn-error"
                        hx-post={`/devices/${device.id}/cancel-learning`}
                        hx-target="#main-content"
                        hx-push-url="true"
                        hx-confirm="Are you sure you want to cancel learning this command?"
                    >
                        <i class="fas fa-times"></i>
                        Cancel Learning
                    </button>
                </div>
            </div>
        </div>
    );
};

export const LearningSuccessPage = ({ device, commandName }: { device: any, commandName: string }) => {
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
                        <h1 class="text-2xl font-bold">Command Learned!</h1>
                        <p class="text-sm opacity-70">{device.name}</p>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            <div class="max-w-md mx-auto text-center space-y-8">
                <div class="bg-success/10 border-2 border-success rounded-2xl p-8">
                    <div class="flex flex-col items-center gap-4">
                        <i class="fas fa-check-circle text-6xl text-success"></i>
                        <div>
                            <h2 class="text-2xl font-bold text-success">Success!</h2>
                            <p class="text-lg mt-2">Command "{commandName}" has been learned and saved.</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div class="space-y-3">
                    <a 
                        href={`/devices/${device.id}/simple`}
                        hx-get={`/devices/${device.id}/simple`}
                        hx-target="#main-content"
                        hx-push-url="true"
                        class="btn btn-primary btn-lg w-full"
                    >
                        <i class="fas fa-check"></i>
                        Back to Device Controls
                    </a>
                    
                    <a 
                        href={`/devices/${device.id}/add-command`}
                        hx-get={`/devices/${device.id}/add-command`}
                        hx-target="#main-content"
                        hx-push-url="true"
                        class="btn btn-outline btn-lg w-full"
                    >
                        <i class="fas fa-plus"></i>
                        Add Another Command
                    </a>
                </div>
            </div>
        </div>
    );
}; 