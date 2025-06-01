import { DeviceCard } from "../components/deviceCard.cmp";

export const DevicesPage = ({devices}: {devices: any[]}) => {
    return (
        <div class="p-4 relative">
            <h1 class="text-2xl font-bold mb-6 text-center">Connected Devices</h1>
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
               class="btn btn-primary btn-circle fixed bottom-20 right-4 shadow-lg z-40 hover:scale-110 transition-transform duration-200">
                <i class="fas fa-plus text-xl"></i>
            </a>
        </div>
    )
}