export const RemotesPage = ({remotes}: {remotes: any[]}) => {
    return (
        <div class="p-4 relative" x-data="{ 
            showDeleteModal: false, 
            remoteToDelete: { id: null, name: '' },
            openDeleteModal(id, name) {
                this.remoteToDelete = { id: id, name: name };
                this.showDeleteModal = true;
            },
            closeDeleteModal() {
                this.showDeleteModal = false;
                this.remoteToDelete = { id: null, name: '' };
            },
            confirmDelete() {
                if (this.remoteToDelete.id) {
                    htmx.ajax('DELETE', '/remotes/' + this.remoteToDelete.id, {
                        target: '#main-content'
                    });
                    this.closeDeleteModal();
                }
            }
        }">
            <h1 class="text-2xl font-bold mb-6 text-center">Room Remotes</h1>
            <div class="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
                {remotes.map((remote) => (
                    <div key={remote.id} class="card bg-base-200 shadow-md transition-shadow duration-200 relative">
                        {/* Delete Button - Always visible for mobile */}
                        <button 
                            x-on:click={`openDeleteModal(${remote.id}, '${remote.name}')`}
                            class="btn btn-error btn-xs btn-circle absolute top-2 right-2 z-10 shadow-md">
                            <i class="fas fa-trash text-xs"></i>
                        </button>
                        
                        <div class="card-body p-4 text-center cursor-pointer">
                            <i class={`fas ${remote.icon} text-3xl text-primary mb-2`}></i>
                            <h2 class="card-title text-sm justify-center">{remote.name}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Action Button */}
            <a href="/remotes/add"
               hx-get="/remotes/add"
               hx-target="#main-content"
               hx-push-url="true"
               class="btn btn-primary btn-circle fixed bottom-20 right-4 shadow-lg z-40 hover:scale-110 transition-transform duration-200">
                <i class="fas fa-plus text-xl"></i>
            </a>

            {/* Delete Confirmation Modal */}
            <div x-show="showDeleteModal" 
                 x-transition:enter="transition ease-out duration-200"
                 x-transition:enter-start="opacity-0"
                 x-transition:enter-end="opacity-100"
                 x-transition:leave="transition ease-in duration-150"
                 x-transition:leave-start="opacity-100"
                 x-transition:leave-end="opacity-0"
                 class="modal modal-open"
                 {...{"x-on:keydown.escape": "closeDeleteModal()"}}
                 >
                <div class="modal-box" {...{"x-on:click.away": "closeDeleteModal()"}}>
                    <h3 class="text-lg font-bold">Confirm Deletion</h3>
                    <p class="py-4">
                        Are you sure you want to delete the remote "<span x-text="remoteToDelete.name" class="font-semibold"></span>"?
                        <br />
                        <span class="text-warning text-sm">This action cannot be undone.</span>
                    </p>
                    <div class="modal-action">
                        <button class="btn" x-on:click="closeDeleteModal()">Cancel</button>
                        <button 
                            class="btn btn-error"
                            x-on:click="confirmDelete()">
                            <i class="fas fa-trash mr-2"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}