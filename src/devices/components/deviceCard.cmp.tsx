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
                'onclick': `alert('AC control panel coming soon!')`
            };
        }
        return {};
    };

    const clickAttrs = getClickAttributes();

    return (
        <div 
            class="card bg-base-200 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            {...clickAttrs}>
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

                    {/* Right Arrow Indicator */}
                    <div class="flex-shrink-0">
                        <i class="fas fa-chevron-right text-base-content opacity-40"></i>
                    </div>
                </div>
            </div>
        </div>
    );
}; 