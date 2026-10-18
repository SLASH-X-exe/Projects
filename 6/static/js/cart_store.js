// Alpine.js Cart Store for Qrtoba Marketplace
// This is NOT an external library - custom code for this project

document.addEventListener('alpine:init', () => {
    Alpine.store('cart', {
        items: {},
        count: 0,
        total: '0.00',
        total_egp: '0.00',
        loading: false,

        async init() {
            await this.fetchCart();
        },

        async fetchCart() {
            try {
                const response = await fetch('products/cart/api/index.html');
                const data = await response.json();
                this.items = data.cart_items || {};
                this.count = data.cart_count || 0;
                this.total = data.cart_total || '0.00';
                this.total_egp = data.cart_total_egp || '0.00';
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            }
        },

        async addToCart(productId, chosenOption = null, customizationNotes = null) {
            if (this.loading) return;
            this.loading = true;

            try {
                const response = await fetch(`/products/cart/add/${productId}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCsrfToken(),
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        chosen_option: chosenOption,
                        customization_notes: customizationNotes
                    })
                });

                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    this.items = data.cart_items || {};
                    this.count = data.cart_count || 0;
                    this.total = data.cart_total || '0.00';
                    this.total_egp = data.cart_total_egp || '0.00';
                    showToast(data.message || 'تم إضافة المنتج إلى السلة', 'success');
                } else {
                    showToast(data.message || 'حدث خطأ', 'error');
                }
            } catch (error) {
                console.error('Add to cart error:', error);
                showToast('حدث خطأ في الاتصال', 'error');
            } finally {
                this.loading = false;
            }
        },

        async removeFromCart(productKey) {
            if (this.loading) return;
            this.loading = true;

            try {
                // Encode key to handle spaces or special chars if any, though basic keys are safe
                const response = await fetch(`/products/cart/remove/${encodeURIComponent(productKey)}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCsrfToken(),
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                });

                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    this.items = data.cart_items || {};
                    this.count = data.cart_count || 0;
                    this.total = data.cart_total || '0.00';
                    this.total_egp = data.cart_total_egp || '0.00';
                    showToast(data.message || 'تم إزالة المنتج من السلة', 'info');
                } else {
                    showToast(data.message || 'حدث خطأ', 'error');
                }
            } catch (error) {
                console.error('Remove from cart error:', error);
                showToast('حدث خطأ في الاتصال', 'error');
            } finally {
                this.loading = false;
            }
        },

        async updateQuantity(productKey, quantity) {
            if (this.loading) return;
            this.loading = true;

            if (quantity < 1) {
                await this.removeFromCart(productKey);
                return;
            }

            try {
                const response = await fetch(`/products/cart/update/${encodeURIComponent(productKey)}/`, {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': getCsrfToken(),
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({ quantity: quantity })
                });

                const data = await response.json();

                if (response.ok && data.status === 'success') {
                    this.items = data.cart_items || {};
                    this.count = data.cart_count || 0;
                    this.total = data.cart_total || '0.00';
                    this.total_egp = data.cart_total_egp || '0.00';
                    // showToast('تم تحديث السلة', 'success'); // Optional: reduce noise
                } else {
                    showToast(data.message || 'حدث خطأ', 'error');
                }
            } catch (error) {
                console.error('Update quantity error:', error);
                showToast('حدث خطأ في الاتصال', 'error');
            } finally {
                this.loading = false;
            }
        }
    });
});

function getCsrfToken() {
    const tokenInput = document.querySelector('[name=csrfmiddlewaretoken]');
    if (tokenInput) return tokenInput.value;

    const tokenMeta = document.querySelector('meta[name="csrf-token"]');
    if (tokenMeta) return tokenMeta.content;

    const cookieMatch = document.cookie.match(/csrftoken=([^;]+)/);
    if (cookieMatch) return cookieMatch[1];

    console.warn('CSRF token not found');
    return '';
}

function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-5 right-5 z-[100] w-full max-w-xs';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-notification transform transition-all duration-300 ease-in-out opacity-0';

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    const iconClass = icons[type] || icons.info;
    const colorClass = colors[type] || colors.info;

    toast.innerHTML = [
        '<div class="' + colorClass + ' text-white px-6 py-4 rounded-lg border-2 border-dark shadow-lg flex items-center gap-3 mb-3">',
        '<i class="fas ' + iconClass + ' text-xl"></i>',
        '<span class="font-bold">' + message + '</span>',
        '</div>'
    ].join('');

    container.appendChild(toast);
    // Force reflow
    toast.offsetHeight;

    requestAnimationFrame(() => {
        toast.classList.add('opacity-100');
    });

    setTimeout(() => {
        toast.classList.remove('opacity-100');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


function toggleWishlist(productId, event) {
    event.preventDefault();
    event.stopPropagation();

    fetch(`/products/wishlist/toggle/${productId}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCsrfToken(),
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
    })
        .then(response => response.json())
        .then(data => {
            showToast(data.message, data.status === 'added' ? 'success' : 'info');

            const button = event.currentTarget;
            const icon = button.querySelector('i');

            if (data.status === 'added') {
                button.classList.add('text-red-500', 'bg-red-100');
                button.classList.remove('text-gray-400', 'bg-white');
                if (icon) icon.classList.add('text-red-500');
            } else {
                button.classList.remove('text-red-500', 'bg-red-100');
                button.classList.add('text-gray-400', 'bg-white');
                if (icon) icon.classList.remove('text-red-500');
            }
        })
        .catch(error => {
            console.error('Error toggling wishlist:', error);
            showToast('حدث خطأ، يرجى المحاولة مرة أخرى', 'error');
        });
}
