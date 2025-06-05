import { raw } from "hono/html";

export const AcAdoptionPage = ({device}: {device: any}) => {
    return (
        <div class="p-4">
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
                        <p class="text-sm opacity-70">AC Device Setup</p>
                    </div>
                </div>
            </div>

            {/* Setup Instructions */}
            <div class="max-w-2xl mx-auto">
                <div class="card bg-base-200 mb-6">
                    <div class="card-body">
                        <h2 class="card-title text-primary">
                            <i class="fas fa-snowflake mr-2"></i>
                            AC Device Adoption
                        </h2>
                        <p class="mb-4">
                            To control your AC, we need to learn its protocol and model. This only needs to be done once.
                        </p>
                        <div class="steps steps-vertical lg:steps-horizontal w-full">
                            <div class="step step-primary">Point remote at device</div>
                            <div class="step">Press any AC button</div>
                            <div class="step">Wait for detection</div>
                        </div>
                    </div>
                </div>

                {/* Learning Status */}
                <div id="learning-status" class="card bg-base-100 shadow-xl">
                    <div class="card-body text-center">
                        <div class="mb-4">
                            <div class="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-satellite-dish text-4xl text-primary"></i>
                            </div>
                            <h3 class="text-xl font-semibold mb-2">Ready to Learn</h3>
                            <p class="text-base-content/70">
                                Click the button below, then press any button on your AC remote
                            </p>
                        </div>
                        
                        <button 
                            id="learn-button"
                            class="btn btn-primary btn-lg"
                            hx-post={`/ac/${device.id}/start-adoption`}
                            hx-target="#learning-status"
                            hx-swap="innerHTML"
                        >
                            <i class="fas fa-play mr-2"></i>
                            Start Learning
                        </button>
                    </div>
                </div>
            </div>

            <script>{raw`
                // Auto-refresh learning status every 2 seconds when learning is active
                function startPolling() {
                    const interval = setInterval(() => {
                        const statusElement = document.getElementById('learning-status');
                        if (statusElement && statusElement.dataset.learning === 'true') {
                            htmx.trigger(statusElement, 'refresh');
                        } else {
                            clearInterval(interval);
                        }
                    }, 2000);
                }

                // Listen for HTMX events to start/stop polling
                document.addEventListener('htmx:afterSwap', function(evt) {
                    if (evt.target.id === 'learning-status') {
                        const learning = evt.target.dataset.learning === 'true';
                        if (learning) {
                            startPolling();
                        }
                    }
                });
            `}</script>
        </div>
    );
}; 