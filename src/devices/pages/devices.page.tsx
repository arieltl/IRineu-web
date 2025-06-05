import { DeviceCard } from "../components/deviceCard.cmp";

export const DevicesPage = ({devices}: {devices: any[]}) => {
    return (
        <div class="p-4 relative" x-data="{ editMode: false }">
            {/* Header with Edit Button */}
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-2xl font-bold text-center flex-1">Connected Devices</h1>
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
            
            <div class="space-y-4 max-w-2xl mx-auto">
                {devices.map((device) => (
                    <DeviceCard key={device.id} device={device} />
                ))}
            </div>

            {/* Floating Action Button */}
            <a href="/devices/add"
               hx-get="/devices/add"
               hx-target="#main-content"
               hx-push-url="true"
               class="btn btn-primary btn-circle fixed bottom-20 right-4 shadow-lg z-40 active:scale-95 transition-transform duration-200">
                <i class="fas fa-plus text-xl"></i>
            </a>
        </div>
    )
}