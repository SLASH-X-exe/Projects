document.addEventListener('alpine:init', () => {
    Alpine.store('wishlist', {
        count: 0,
        items: [], // Array of IDs or objects if needed, locally we might just track IDs for UI state

        init() {
            this.fetchCount();
        },

        fetchCount() {
            fetch('products/wishlist/api/count/index.html')
                .then(response => response.json())
                .then(data => {
                    this.count = data.count;
                })
                .catch(error => console.error('Error fetching wishlist count:', error));
        },

        toggle(type, id, btnElement = null) {
            // type: 'product' or 'course'
            let url = '';
            if (type === 'product') {
                url = `/products/wishlist/toggle/${id}/`;
            } else if (type === 'course') {
                url = `/courses/wishlist/toggle/${id}/`;
            }

            if (!url) return Promise.reject('Invalid type');

            return fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                },
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'added' || data.status === 'removed') {
                        // Update global count
                        this.fetchCount();

                        // Specific UI updates if needed
                        if (data.status === 'added') {
                            this.showNotification('تم الإضافة لقائمة الأمنيات', 'success');
                            if (btnElement) btnElement.classList.add('active-wishlist'); // Example class
                        } else {
                            this.showNotification('تم الحذف من قائمة الأمنيات', 'info');
                            if (btnElement) btnElement.classList.remove('active-wishlist');
                        }
                    }
                    return data; // Return data for further processing
                })
                .catch(error => {
                    console.error('Error toggling wishlist:', error);
                    this.showNotification('حدث خطأ، يرجى المحاولة لاحقاً', 'error');
                    throw error; // Re-throw to allow caller to handle error
                });
        },

        showNotification(message, type = 'success') {
            // Simple toast notification logic could go here
            // For now, we can use a library if available or a simple alert/console
            // Or dispatch a custom event that a global toast component listens to
            window.dispatchEvent(new CustomEvent('notify', {
                detail: { message: message, type: type }
            }));
        }
    });
});

// Helper to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
