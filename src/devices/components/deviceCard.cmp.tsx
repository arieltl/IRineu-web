interface Device {
    id: number;
    name: string;
    type: string;
    icon: string;
    imageUrl: string | null;
}

interface DeviceCardProps {
    device: Device;
}

export const DeviceCard = ({ device }: DeviceCardProps) => {
    const getTypeIcon = (type: string) => {
        return type === 'AC' ? 'fa-snowflake' : 'fa-microchip';
    };

    const getTypeColor = (type: string) => {
        return type === 'AC' ? 'text-blue-400' : 'text-green-400';
    };

    const handleDeviceClick = () => {
        if (device.type === 'simple') {
            return `/devices/${device.id}/simple`;
        } else if (device.type === 'AC') {
            // TODO: Navigate to AC device page when implemented
            return '#';
        }
        return '#';
    };

    const getClickAttributes = () => {
        if (device.type === 'simple') {
            return {
                'hx-get': `/devices/${device.id}/simple`,
                'hx-target': '#main-content',
                'hx-push-url': 'true'
            };
        } else if (device.type === 'AC') {
            return {
                'hx-get': `/ac/${device.id}`,
                'hx-target': '#main-content',
                'hx-push-url': 'true'
            };
        }
        return {};
    };

    const clickAttrs = getClickAttributes();

    const getClickAttributesForEditMode = () => {
        return {
            'x-bind:disabled': 'editMode',
            'x-bind:class': 'editMode ? "opacity-50 cursor-not-allowed" : ""',
            'x-on:click': 'if (!editMode) { ' + (device.type === 'simple' ? 
                `htmx.ajax('GET', '/devices/${device.id}/simple', '#main-content').then(() => htmx.pushUrl('/devices/${device.id}/simple'))` :
                `htmx.ajax('GET', '/ac/${device.id}', '#main-content').then(() => htmx.pushUrl('/ac/${device.id}'))`) + ' }'
        };
    };

    return (
        <div class="relative" id={`device-${device.id}`}>
            <div 
                class="card bg-base-200 shadow-md active:shadow-lg transition-all duration-200 cursor-pointer"
                {...getClickAttributesForEditMode()}>
                <div class="card-body p-4">
                    <div class="flex items-center gap-4">
                        {/* Device Image or Icon */}
                        <div class="flex-shrink-0 w-16 h-16 bg-base-300 rounded-lg flex items-center justify-center overflow-hidden">
                            {device.imageUrl ? (
                                <img 
                                    src={device.imageUrl} 
                                    alt={device.name}
                                    class="w-full h-full object-cover rounded-lg"
                                    onError="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                                />
                            ) : null}
                            <i 
                                class={`fas ${device.icon} text-2xl text-primary ${device.imageUrl ? 'hidden' : ''}`}
                                style={device.imageUrl ? "display: none;" : ""}
                            ></i>
                        </div>

                        {/* Device Info */}
                        <div class="flex-1 min-w-0">
                            <h2 class="card-title text-base font-semibold truncate mb-1">{device.name}</h2>
                            <div class={`badge badge-sm ${getTypeColor(device.type)} bg-opacity-20 border-current w-fit`}>
                                <i class={`fas ${getTypeIcon(device.type)} mr-1 text-xs`}></i>
                                {device.type}
                            </div>
                        </div>

                        {/* Right Arrow Indicator - hidden in edit mode */}
                        <div class="flex-shrink-0" x-show="!editMode">
                            <i class="fas fa-chevron-right text-base-content opacity-40"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Delete Button - shows in edit mode */}
            <button 
                class="absolute top-2 right-2 btn btn-circle btn-sm btn-error shadow-lg transition-all duration-200 z-10"
                x-show="editMode"
                hx-delete={`/devices/${device.id}`}
                hx-target={`#device-${device.id}`}
                hx-swap="delete"
                hx-confirm="Are you sure you want to delete this device?"
            >
                <i class="fas fa-trash text-sm"></i>
            </button>
        </div>
    );
}; 