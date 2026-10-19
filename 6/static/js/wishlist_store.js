// Alpine.js Wishlist Store
document.addEventListener('alpine:init', () => {
    Alpine.store('wishlist', {
        loading: false,

        async toggle(type, id, el = null) {
            if (this.loading) return;
            this.loading = true;

            // Determine endpoint based on type
            let endpoint = '';
            if (type === 'product') {
                endpoint = `/products/wishlist/toggle/${id}/`;
            } else if (type === 'course') {
                endpoint = `/courses/course/${id}/wishlist/toggle/`;
            } else {
                console.error('Invalid wishlist item type');
                this.loading = false;
                return;
            }

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCsrfToken(),
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                });

                const data = await response.json();

                // Show notification
                if (typeof showToast === 'function') {
                    showToast(data.message, data.status === 'added' ? 'success' : 'info');
                } else {
                    alert(data.message);
                }

                // Update UI if element is provided (optional, for direct DOM manipulation outside Alpine data)
                if (el) {
                    // This is afallback if not using x-data binding for state
                    // In course_detail.html, we use x-data="{ inWishlist: ... }" which is better
                    // But if we want to update the button style directly:
                    // toggle classes based on data.status
                }

                // Return status for x-data handlers to update their local state
                return data.status;

            } catch (error) {
                console.error('Wishlist toggle error:', error);
                if (typeof showToast === 'function') {
                    showToast('حدث خطأ في الاتصال', 'error');
                } else {
                    alert('حدث خطأ في الاتصال');
                }
            } finally {
                this.loading = false;
            }
        },

        // Helper to show notification from other components (like addToCart)
        showNotification(message, type) {
            if (typeof showToast === 'function') {
                showToast(message, type);
            }
        }
    });
});
