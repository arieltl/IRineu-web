import type { PropsWithChildren } from "hono/jsx";

export const Layout = ({ children }: PropsWithChildren) => {
    return <html lang="en" data-theme="dark">
        <head>
            <meta charset="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <title>Astra</title>
            <link rel="stylesheet" href="public/index.css" />
            <script src="https://unpkg.com/htmx.org@2.0.4"></script>
            <script defer src="https://unpkg.com/alpinejs@3.13.5/dist/cdn.min.js"></script>
        </head>
        <body class="bg-base-100 min-h-screen flex flex-col">
            <main class="flex-1 pb-16">
                 {children}
            </main>
            
            <div hx-boost="true"  class="btm-nav btm-nav-sm fixed bottom-0 z-50 shadow-lg bg-base-100 border-t border-base-200 flex justify-between w-full">
                <a href="/remotes" class="flex flex-col items-center justify-center flex-1 py-1 text-primary hover:bg-base-200 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="btm-nav-label font-medium text-xs">Remotes</span>
                </a>
                <a href="/devices" class="flex flex-col items-center justify-center flex-1 py-1 hover:bg-base-200 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span class="btm-nav-label font-medium text-xs">Devices</span>
                </a>
            </div>
        </body>
    </html>;
};