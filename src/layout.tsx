import { raw } from "hono/html";
import type { PropsWithChildren } from "hono/jsx";

interface LayoutProps extends PropsWithChildren {
    currentPath?: string;
}

export const Layout = ({ children, currentPath }: LayoutProps) => {
    const isActive = (path: string) => currentPath === path;
    const activeTabPath = currentPath || '/remotes'; // Default to remotes if no path
    
    // Debug logging
    console.log('Layout received currentPath:', currentPath);
    console.log('Layout computed activeTabPath:', activeTabPath);
    console.log('Is /devices active?', currentPath === '/devices');
    console.log('Is /remotes active?', currentPath === '/remotes');
    
    return <html lang="en" data-theme="dark">
        <head>
            <meta charset="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <title>Astra</title>
            <link rel="stylesheet" href="/public/index.css" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
            <script src="https://unpkg.com/htmx.org@2.0.4"></script>
            <script defer src="https://unpkg.com/alpinejs@3.13.5/dist/cdn.min.js"></script>
            <style>{`
                .htmx-indicator {
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s ease;
                }
                .htmx-request .htmx-indicator {
                    opacity: 1;
                    pointer-events: auto;
                }
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.3);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }
                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-top: 4px solid #fff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </head>
        <body class="bg-base-100 min-h-screen flex flex-col" x-data={`{ activeTab: '${activeTabPath}' }`}>
            {/* Loading Overlay */}
            <div id="loading-overlay" class="loading-overlay htmx-indicator">
                <div class="spinner"></div>
            </div>
            
            <main id="main-content" class="flex-1 pb-16">
                 {children}
            </main>
            
            <div class="btm-nav btm-nav-sm fixed bottom-0 z-50 shadow-lg bg-base-100 border-t border-base-200 flex justify-between w-full">
                <a href="/remotes" 
                   hx-get="/remotes"
                   hx-target="#main-content"
                   hx-sync="#main-content:abort"
                   hx-indicator="#loading-overlay"
                   hx-push-url="true"
                   x-on:click="activeTab = '/remotes'"
                   class="flex flex-col items-center justify-center flex-1 py-1 hover:bg-base-200 transition-colors duration-200"
                   x-bind:class="activeTab === '/remotes' ? 'text-primary bg-base-200' : ''">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="btm-nav-label font-medium text-xs">Remotes</span>
                </a>
                
                <a href="/devices" 
                   hx-get="/devices"
                   hx-target="#main-content"
                   hx-sync="#main-content:abort"
                   hx-indicator="#loading-overlay"
                   hx-push-url="true"
                   x-on:click="activeTab = '/devices'"
                   class="flex flex-col items-center justify-center flex-1 py-1 hover:bg-base-200 transition-colors duration-200"
                   x-bind:class="activeTab === '/devices' ? 'text-primary bg-base-200' : ''">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span class="btm-nav-label font-medium text-xs">Devices</span>
                </a>
            </div>
            
            <script>{raw(`
                console.log('Current path: ${currentPath || 'undefined'}');
                console.log('Active tab: ${activeTabPath}');
            `)}</script>
        </body>
    </html>;
};