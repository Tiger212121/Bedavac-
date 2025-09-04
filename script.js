document.addEventListener('DOMContentLoaded', () => {

    // ========================================================================================= //
    // --- ELEMENT TANIMLAMALARI (GÜVENLİK KONTROLLERİ EKLENDİ) ---
    // ========================================================================================= //
    const profileIconWrapper = document.getElementById('profile-icon-wrapper');
    const profileMenu = document.getElementById('profile-menu');
    const loggedOutMenu = document.getElementById('profile-menu-logged-out');
    const loggedInMenu = document.getElementById('profile-menu-logged-in');
    const modalOverlay = document.getElementById('modal-overlay');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const profileModal = document.getElementById('profile-modal');
    const bcModal = document.getElementById('bc-modal');
    const ordersModal = document.getElementById('orders-modal');
    const trackingModal = document.getElementById('tracking-modal');
    const favoritesModal = document.getElementById('favorites-modal');
    const productDetailModal = document.getElementById('productDetailModal');
    const shareModal = document.getElementById('share-modal');
    // YENİ EKLENEN MODAL TANIMLAMALARI
    const couponsModal = document.getElementById('coupons-modal');
    const settingsModal = document.getElementById('settings-modal');
    const helpModal = document.getElementById('help-modal');
    const cartOpenBtn = document.getElementById('cart-open-btn');
    const cartPanel = document.getElementById('cart-panel');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartBody = document.getElementById('cart-body');
    const checkoutPage = document.getElementById('checkout-page');
    const categoriesIcon = document.getElementById('categories-icon');
    const categoriesDropdown = document.getElementById('categories-dropdown');
    const productGrid = document.getElementById('product-grid');
    const searchBanner = document.getElementById('search-banner');
    const searchInput = document.getElementById('search-input');
    const filterBtn = document.getElementById('filter-btn');
    const filterPanel = document.getElementById('filter-panel');
    const sortBtn = document.getElementById('sort-btn');
    const sortPanel = document.getElementById('sort-panel');
    // Ürün Detay Modal Elementleri
    const detailName = document.getElementById('detailName');
    const detailPrice = document.getElementById('detailPrice');
    const detailDiscount = document.getElementById('detailDiscount');
    const detailAttributes = document.getElementById('detailAttributes');
    const detailImage = document.getElementById('detailImage');
    const addToCartDetailBtn = document.getElementById('addToCartDetail');
    const starRatingContainer = document.getElementById('starRatingDetail');
    // ÖNEMLİ DÜZELTME: Kodun durmasını engelleyen güvenlik kontrolü
    const starRatingDetail = starRatingContainer ? starRatingContainer.querySelectorAll('span') : [];
    const reviewTextDetail = document.getElementById('reviewTextDetail');
    const reviewImageDetail = document.getElementById('reviewImageDetail');
    const submitReviewDetail = document.getElementById('submitReviewDetail');
    const reviewsListDetail = document.getElementById('reviewsListDetail');
    // VTO (Sanal Deneme) Modal Elementleri
    const vtoOverlay = document.getElementById('virtual-try-on-overlay');
    const vtoCloseBtn = document.getElementById('close-vto-btn');
    const vtoVideo = document.getElementById('vto-video');
    const vtoCanvas = document.getElementById('vto-canvas');
    const vtoProductName = document.getElementById('vto-product-name');
    const vtoProductColors = document.getElementById('vto-product-colors');
    const vtoAddToCartBtn = document.getElementById('vto-add-to-cart');
    // VTO Global Değişkenleri
    let faceMeshModel = null;
    let vtoIsRunning = false;
    let vtoAnimationId = null;
    let currentVTOProduct = null;
    let currentVTOColor = null;
    let videoStream = null;
    // Global State
    let currentDetailProductId = null;
    let currentShareProductId = null;
    let detailRating = 0;
    let treasureProductId = null;

    // ========================================================================================= //
    // --- ÖRNEK VERİTABANI (KUPONLAR) ---
    // ========================================================================================= //
     const couponsDB = [
        { id: 1, code: 'BEDAVA10', description: 'Tüm ürünlerde %10 indirim', status: 'active', expiry: '2025-12-31' },
        { id: 2, code: 'YAZ2025', description: 'Moda kategorisinde 500 TL üzerine 100 TL indirim', status: 'active', expiry: '2025-09-01' },
        { id: 3, code: 'TECH5', description: 'Teknoloji ürünlerinde %5 indirim', status: 'expired', expiry: '2025-03-01' }
    ];

    // ========================================================================================= //
    // --- ÜRÜN VERİTABANI ---
    // ========================================================================================= //
    const productsDB = [
        { 
            id: 1, name: 'Akıllı Telefon', price: 35000, img: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845699492', attributes: 'Model: Pro, Renk: Titanyum', stock: 5, category: 'teknoloji', onSale: true, discountPrice: 32500,
            related_products: [
                { id: 2, text: 'Müziğin keyfini çıkarın' },
                { id: 3, text: 'Telefonunuzu bileğinizde taşıyın' }
            ]
        },
        { id: 2, name: 'Kablosuz Kulaklık', price: 4500, img: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MME73?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1632861342000', attributes: 'Renk: Beyaz', stock: 10, category: 'teknoloji', onSale: false },
        { id: 3, name: 'Akıllı Saat', price: 12000, img: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/apple-watch-ultra-2-witb-202309?wid=1364&hei=932&fmt=jpeg&qlt=90&.v=1692737943449', attributes: 'Model: Spor, Kordon: Mavi', stock: 3, category: 'teknoloji', onSale: false },
        { 
            id: 4, name: 'Siyah T-Shirt', price: 500, img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format&fit=crop&q=60', attributes: 'Kumaş: Pamuk', stock: 25, category: 'moda', onSale: true, discountPrice: 425, sizes: ['S', 'M', 'L'],
            bundle_offer: {
                name: "Casual Kombin",
                partner_ids: [5, 8],
                discount_percentage: 10,
                text: "Bu kombini tamamlayarak %10 indirim kazanın!"
            }
        },
        { 
            id: 5, name: 'Jean Pantolon', price: 1200, img: 'https://images.unsplash.com/photo-1602293589914-9FF0554d1b0d?w=500&auto=format&fit=crop&q=60', attributes: 'Model: Slim Fit', stock: 15, category: 'moda', onSale: false, sizes: ['M', 'L', 'XL'],
            bundle_offer: { name: "Casual Kombin", partner_ids: [4, 8], discount_percentage: 10, text: "Bu kombini tamamlayarak %10 indirim kazanın!"}
        },
        { 
            id: 6, name: 'Ruj', price: 850, img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&auto=format&fit=crop&q=60', attributes: 'Kalıcı & Mat', stock: 8, category: 'kozmetik', onSale: false, colors: [ { name: 'Tutkulu Kırmızı', hex: '#C70039' }, { name: 'Şeker Pembe', hex: '#F96167' }, { name: 'Nude', hex: '#E2B6A1' }, { name: 'Bordo', hex: '#800020' } ]
        },
        { id: 7, name: 'Kahve Makinesi', price: 3200, img: 'https://images.unsplash.com/photo-1565452344049-52c2da239c93?w=500&auto=format&fit=crop&q=60', attributes: 'Tip: Filtre', stock: 6, category: 'ev-yasam', onSale: true, discountPrice: 2999 },
        { 
            id: 8, name: 'Beyaz Sneaker', price: 2800, img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop&q=60', attributes: 'Malzeme: Deri', stock: 12, category: 'moda', onSale: false, sizes: ['M', 'L'],
            bundle_offer: { name: "Casual Kombin", partner_ids: [4, 5], discount_percentage: 10, text: "Bu kombini tamamlayarak %10 indirim kazanın!"}
        },
    ];

    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    let coupon = null;
    let currentFilters = { category: 'all', minPrice: '', maxPrice: '', sizes: [], onSale: false };
    let currentSort = 'default';
    const checkoutState = { address: null, delivery: { type: 'standart', price: 29.99 }, payment: 'card', giftWrap: false };
    // ========================================================================================= //
    // --- MERKEZİ VERİ YÖNETİMİ VE YARDIMCI FONKSİYONLAR ---
    // ========================================================================================= //
    const getUserDatabase = () => JSON.parse(localStorage.getItem('users')) || [];
    const saveUserDatabase = (users) => localStorage.setItem('users', JSON.stringify(users));
    const getActiveUser = () => JSON.parse(sessionStorage.getItem('currentUser'));
    const setActiveUser = (user) => sessionStorage.setItem('currentUser', JSON.stringify(user));
    const logoutUser = () => sessionStorage.removeItem('currentUser');
    const updateActiveUser = (updatedUser) => {
        const users = getUserDatabase();
        const currentUser = getActiveUser();
        if (!currentUser) return;
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex > -1) {
            users[userIndex] = updatedUser;
            saveUserDatabase(users);
            setActiveUser(updatedUser);
        }
    };
    const showNotification = (message, type) => {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        container.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    };
    const validateUsername = (username) => /^[a-zA-Z0-9]{4,}$/.test(username);
    const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
    const validatePhone = (phone) => /^(05\d{9})$/.test(phone);
    const validatePassword = (password) => /^[a-zA-Z0-9\p{P}\p{S}]{6,}$/u.test(password);

    // ========================================================================================= //
    // --- MODAL YÖNETİMİ ---
    // ========================================================================================= //
    const openModal = (modalElement) => {
        if (!modalElement) return;
        modalOverlay.style.display = 'flex';
        modalOverlay.querySelectorAll('.modal-content').forEach(modal => modal.style.display = 'none');
        modalElement.style.display = modalElement.classList.contains('enhanced') || modalElement.classList.contains('modal-content-profile') ? 'flex' : 'block';
    };
    const closeModal = () => {
        modalOverlay.style.display = 'none';
    };
    // ========================================================================================= //
    // --- CANLI ARAMA FONKSİYONU ---
    // ========================================================================================= //
    const showLiveSearchResults = () => {
        const resultsPanel = document.getElementById('search-results-panel');
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm.length < 2) {
            resultsPanel.style.display = 'none';
            return;
        }

        const filtered = productsDB.filter(p => p.name.toLowerCase().includes(searchTerm)).slice(0, 5);
        if (filtered.length > 0) {
            resultsPanel.innerHTML = filtered.map(product => `
                <div class="search-result-item" data-product-id="${product.id}">
                    <img src="${product.img}" alt="${product.name}" class="search-result-img">
                    <span class="search-result-name">${product.name}</span>
                </div>
          `).join('');
        } else {
            resultsPanel.innerHTML = `<div class="no-results-message">Sonuç bulunamadı.</div>`;
        }
        resultsPanel.style.display = 'block';
    };
    // ========================================================================================= //
    // --- PAYLAŞMA MODALI FONKSİYONLARI ---
    // ========================================================================================= //
    const openShareModal = (product) => {
        currentShareProductId = product.id;
        const shareImage = document.getElementById('share-product-image');
        const shareName = document.getElementById('share-product-name');
        const shareLink = document.getElementById('share-product-link');

        shareImage.src = product.img;
        shareName.textContent = product.name;
        shareLink.value = `https://bedavaci.com/product/${product.id}`;

        openModal(shareModal);
    };
    const claimShareReward = () => {
        const user = getActiveUser();
        if (!user) {
            showNotification('BC Puanı kazanmak için giriş yapmalısınız.', 'error');
            openModal(loginModal);
            return;
        }

        const lastSharedKey = `lastShared_${currentShareProductId}`;
        const lastSharedTime = sessionStorage.getItem(lastSharedKey);
        if (lastSharedTime) {
            showNotification('Bu ürün için paylaşım ödülünü zaten aldınız.', 'success');
            return;
        }

        user.bc = (user.bc || 0) + 15;
        updateActiveUser(user);
        updateUI();
        showNotification('Paylaşımınız için teşekkürler! +15 BC kazandınız!', 'success');
        sessionStorage.setItem(lastSharedKey, Date.now());
    };
    // ========================================================================================= //
    // --- FAVORİLER FONKSİYONLARI ---
    // ========================================================================================= //
    const toggleFavorite = (productId) => {
        const user = getActiveUser();
        if (!user) {
            showNotification('Favorilere eklemek için giriş yapmalısınız.', 'error');
            openModal(loginModal);
            return;
        }
        user.favorites = user.favorites || [];
        const productIndex = user.favorites.indexOf(productId);
        if (productIndex > -1) {
            user.favorites.splice(productIndex, 1);
            showNotification('Ürün favorilerden çıkarıldı.', 'success');
        } else {
            user.favorites.push(productId);
            showNotification('Ürün favorilere eklendi!', 'success');
        }
        updateActiveUser(user);
        updateFavoriteIcons();
    };
    const updateFavoriteIcons = () => {
        const user = getActiveUser();
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const productId = parseInt(btn.dataset.productId);
            if (user && user.favorites && user.favorites.includes(productId)) {
                btn.classList.add('favorited');
                btn.innerHTML = '♥'; // Dolu kalp
            } else {
                btn.classList.remove('favorited');
                btn.innerHTML = '♡'; // Boş kalp
            }
        });
    };

    // ========================================================================================= //
    // --- YENİLENMİŞ & YENİ MODAL İÇERİK FONKSİYONLARI ---
    // ========================================================================================= //

    // === GELİŞTİRİLMİŞ PROFİL MODALI İÇERİĞİ ===
    const renderProfileModal = () => {
        const user = getActiveUser();
        if (!user) return;

        // Genel Bakış Tabı
        const overviewContainer = document.getElementById('profile-overview');
        const totalOrders = user.orders ? user.orders.length : 0;
        const totalSpent = user.orders ? user.orders.reduce((sum, order) => sum + order.total, 0) : 0;
        overviewContainer.innerHTML = `
            <div class="profile-overview-grid">
                <div class="overview-card">
                    <h4>Toplam Sipariş</h4>
                    <p>Bugüne kadar verdiğiniz sipariş sayısı.</p>
                    <strong>${totalOrders}</strong>
                </div>
                <div class="overview-card">
                    <h4>Toplam Harcama</h4>
                    <p>Sitemizde yaptığınız toplam harcama.</p>
                    <strong>${totalSpent.toFixed(2)} ₺</strong>
                </div>
                <div class="overview-card">
                    <h4>BC Puanları</h4>
                    <p>Mevcut sadakat puanlarınız.</p>
                    <strong>${user.bc || 0} BC</strong>
                </div>
            </div>`;

        // Bilgileri Düzenle Tabı
        const profileEditForm = document.getElementById('profile-edit-form');
        profileEditForm.innerHTML = `
            <div class="form-row">
                <div class="form-group"><label for="edit-name">İsim</label><input type="text" id="edit-name" value="${user.name}" required></div>
                <div class="form-group"><label for="edit-surname">Soyisim</label><input type="text" id="edit-surname" value="${user.surname}" required></div>
            </div>
            <div class="form-group"><label for="edit-username">Kullanıcı Adı</label><input type="text" id="edit-username" value="${user.username}" required></div>
            <div class="form-group"><label for="edit-email">E-posta</label><input type="email" id="edit-email" value="${user.email}" required></div>
            <div class="form-group"><label for="edit-phone">Telefon</label><input type="tel" id="edit-phone" value="${user.phone}" required></div>
            <div class="form-group"><label for="edit-password">Yeni Şifre (değiştirmek için doldurun)</label><input type="password" id="edit-password"></div>
            <button type="submit" class="modal-btn">Değişiklikleri Kaydet</button>`;

        // Adreslerim Tabı
        const addressesContainer = document.getElementById('profile-addresses');
        addressesContainer.innerHTML = `
            <div class="address-list">
                <div class="address-card">
                    <strong>Ev Adresi</strong>
                    <p>${user.address ? user.address.address : 'Sokak, mahalle, no...'}</p>
                    <p>${user.address ? user.address.city : 'İl'}</p>
                    <div class="address-actions"><button>✏️</button><button>🗑️</button></div>
                </div>
            </div>
            <button class="modal-btn" style="background-color: #6c757d; margin-top: 15px;">Yeni Adres Ekle</button>`;
    };

    // === GELİŞTİRİLMİŞ SİPARİŞLER MODALI İÇERİĞİ ===
    const renderOrders = (statusFilter = 'all') => {
        const user = getActiveUser();
        const container = document.getElementById('orders-list-container');
        if (!user) {
             showNotification('Siparişleri görmek için giriş yapmalısınız.', 'error');
             return;
        }
        if (!user.orders || user.orders.length === 0) {
            container.innerHTML = `<div class="cart-empty-message"><h3>Henüz siparişiniz yok.</h3><p>Alışverişe başlayarak harika fırsatları yakalayın!</p></div>`;
            return;
        }

        const filteredOrders = statusFilter === 'all' 
            ? user.orders 
            : user.orders.filter(order => order.status === statusFilter);

        container.innerHTML = filteredOrders.slice().reverse().map(order => {
             const firstProduct = productsDB.find(p => p.id === order.items[0].productId);
             return `
            <div class="enhanced-order-item">
                <img src="${firstProduct.img}" alt="${firstProduct.name}" class="enhanced-item-img">
                <div class="enhanced-item-details">
                    <h4>Sipariş #${order.id}</h4>
                    <p>Tarih: ${new Date(order.date).toLocaleDateString('tr-TR')} | Tutar: <strong>${order.total.toFixed(2)} ₺</strong></p>
                    <p>Durum: <span class="order-status status-${order.status.replace(' ','_')}">${order.status}</span></p>
                </div>
                <div class="enhanced-item-actions">
                    <button class="track-cargo-btn" data-order-id="${order.id}">Kargo Takip</button>
                </div>
            </div>`;
        }).join('');
    };

    // === GELİŞTİRİLMİŞ FAVORİLER MODALI İÇERİĞİ ===
    const renderFavorites = () => {
        const user = getActiveUser();
        const container = document.getElementById('favorites-list-container');
        if (!user || !user.favorites || user.favorites.length === 0) {
            container.innerHTML = `<div class="cart-empty-message"><h3>Favori ürününüz yok.</h3><p>Bir ürünü favorilerinize eklemek için kalp ikonuna tıklayın.</p></div>`;
            return;
        }
        const favoriteProducts = user.favorites.map(id => productsDB.find(p => p.id === id)).filter(p => p);
        container.innerHTML = favoriteProducts.map(product => {
            const priceHTML = product.onSale ? `<span class="discount">${product.price.toFixed(2)} ₺</span>${product.discountPrice.toFixed(2)} ₺` : `${product.price.toFixed(2)} ₺`;
            return `
            <div class="enhanced-favorite-item">
                 <img src="${product.img}" alt="${product.name}" class="enhanced-item-img">
                 <div class="enhanced-item-details">
                     <h4>${product.name}</h4>
                    <p class="cart-item-price">${priceHTML}</p>
                 </div>
                 <div class="enhanced-item-actions">
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Sepete Ekle</button>
                </div>
            </div>`;
        }).join('');
    };

    // === YENİ KUPONLAR MODALI İÇERİĞİ ===
    const renderCoupons = () => {
        const activeContainer = document.getElementById('active-coupons');
        const expiredContainer = document.getElementById('expired-coupons');

        activeContainer.innerHTML = couponsDB.filter(c => c.status === 'active').map(coupon => `
            <div class="coupon-card">
                <div class="coupon-icon">🎟️</div>
                <div class="coupon-details">
                    <strong>${coupon.code}</strong>
                    <p>${coupon.description}</p>
                    <p>Son Geçerlilik: ${coupon.expiry}</p>
                </div>
            </div>
        `).join('');
        expiredContainer.innerHTML = couponsDB.filter(c => c.status === 'expired').map(coupon => `
            <div class="coupon-card expired">
                <div class="coupon-icon">🎟️</div>
                <div class="coupon-details">
                    <strong>${coupon.code}</strong>
                    <p>${coupon.description}</p>
                </div>
            </div>
        `).join('');
    };

    const renderTrackingInfo = (order) => {
        document.getElementById('tracking-modal-title').textContent = `Kargo Takip #${order.id}`;
        const timelineContainer = document.getElementById('tracking-timeline-container');
        const statuses = [
            { stage: 'Sipariş Alındı', date: new Date(order.date).toLocaleString('tr-TR'), completed: true },
            { stage: 'Ödeme Onaylandı', date: new Date(order.date + 1000*60*5).toLocaleString('tr-TR'), completed: true },
            { stage: 'Sipariş Hazırlanıyor', date: new Date(order.date + 1000*60*60*3).toLocaleString('tr-TR'), completed: ['Kargoda', 'Teslim Edildi'].includes(order.status) },
            { stage: 'Kargoya Verildi', date: new Date(order.date + 1000*60*60*24).toLocaleString('tr-TR'), completed: order.status === 'Teslim Edildi' },
            { stage: 'Teslim Edildi', date: new Date(order.date + 1000*60*60*24*3).toLocaleString('tr-TR'), completed: order.status === 'Teslim Edildi' },
        ];
        timelineContainer.innerHTML = statuses.map(s => `
            <div class="timeline-item ${s.completed ? 'completed' : ''}">
                <div class="timeline-item-content">
                    <strong>${s.stage}</strong>
                    <span>${s.completed ? s.date : 'Bekleniyor...'}</span>
                </div>
            </div>
        `).join('');
    };

    // ========================================================================================= //
    // --- ÜRÜN & FİLTRELEME FONKSİYONLARI ---
    // ========================================================================================= //
    const renderProducts = (productsToRender) => {
        if (!productGrid) return;
        const currentUser = getActiveUser();
        const today = new Date().toDateString();
        productGrid.innerHTML = productsToRender.map(product => {
            const priceHTML = product.onSale
                ? `<span class="discount">${product.price.toFixed(2)} ₺</span>${product.discountPrice.toFixed(2)} ₺`
                : `${product.price.toFixed(2)} ₺`;

            const vtoButtonHTML = product.category === 'kozmetik' && product.colors
                ? `<button class="vto-trigger-btn" data-product-id="${product.id}">✨ Sanal Dene</button>`
                : '';

            let treasureHTML = '';
            if (currentUser && currentUser.lastTreasureClaimDate !== today && product.id === treasureProductId) {
                treasureHTML = `<div class="treasure-chest" title="Hazineyi buldun!">🎁</div>`;
            }
           let lowStockHTML = '';
            if (product.stock <= 5 && product.stock > 0) {
                lowStockHTML = `<div class="low-stock-warning">Son ${product.stock} ürün!</div>`;
            }

            return `
    <div class="product-card" data-product-id="${product.id}">
                ${treasureHTML}
                ${lowStockHTML}

                <div class="product-card-actions">
                    <button class="favorite-btn" data-product-id="${product.id}" title="Favorilere Ekle">♡</button>
                    <button class="share-btn" data-product-id="${product.id}" title="Paylaş">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"></path></svg>
                    </button>
                </div>

                <img src="${product.img}" alt="${product.name}" style="cursor: pointer;" class="product-image-for-detail">

                <h3>${product.name}</h3>
                <div class="price">${priceHTML}</div>
                <button class="add-to-cart-btn" data-product-id="${product.id}">Sepete Ekle</button>
                ${vtoButtonHTML}
            </div>`;
        }).join('');
        updateFavoriteIcons();
    };
    const applyAllFilters = () => {
        let filtered = [...productsDB];
        if (currentFilters.category !== 'all') filtered = filtered.filter(p => p.category === currentFilters.category);
        if (currentFilters.onSale) filtered = filtered.filter(p => p.onSale);
        const min = parseFloat(currentFilters.minPrice);
        const max = parseFloat(currentFilters.maxPrice);
        if (!isNaN(min)) filtered = filtered.filter(p => (p.onSale ? p.discountPrice : p.price) >= min);
        if (!isNaN(max)) filtered = filtered.filter(p => (p.onSale ? p.discountPrice : p.price) <= max);
        if (currentFilters.sizes.length > 0) filtered = filtered.filter(p => p.sizes && p.sizes.some(size => currentFilters.sizes.includes(size)));
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));

        if (currentSort === 'price-asc') {
            filtered.sort((a, b) => {
                const priceA = a.onSale ? a.discountPrice : a.price;
                const priceB = b.onSale ? b.discountPrice : b.price;
                return priceA - priceB;
            });
        } else if (currentSort === 'price-desc') {
            filtered.sort((a, b) => {
                const priceA = a.onSale ? a.discountPrice : a.price;
                const priceB = b.onSale ? b.discountPrice : b.price;
                return priceB - priceA;
            });
        } else if (currentSort === 'newest') {
            filtered.sort((a, b) => b.id - a.id);
        }

        renderProducts(filtered);
    };
    // ========================================================================================= //
    // --- SEPET FONKSİYONLARI ---
    // ========================================================================================= //
    const saveCart = () => sessionStorage.setItem('cart', JSON.stringify(cart));
    const openCart = () => { renderCart(); cartPanel.classList.add('open'); cartOverlay.style.display = 'block'; };
    const closeCart = () => { cartPanel.classList.remove('open'); cartOverlay.style.display = 'none'; };

    const addToCart = (productId, isVTO = false) => {
        const product = productsDB.find(p => p.id === productId);
        if (!product) return;

        let itemIdentifier = String(productId);
        if (isVTO && currentVTOColor) {
            const colorName = product.colors.find(c => c.hex === currentVTOColor)?.name || '';
            itemIdentifier += `-${colorName.replace(/\s/g, '')}`;
        }

        const existingItem = cart.find(item => item.id === itemIdentifier);
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
                showNotification(`${product.name} adedi artırıldı.`, 'success');
            } else {
                showNotification(`Stokta yeterli ${product.name} yok!`, 'error');
            }
        } else {
            const newItem = {
                id: itemIdentifier,
                productId: productId,
                quantity: 1,
                ...(isVTO && { color: product.colors.find(c => c.hex === currentVTOColor) })
            };
            cart.push(newItem);
            showNotification(`${product.name} sepete eklendi.`, 'success');
        }
        saveCart();
        renderCart();
        const cartIcon = document.querySelector('.cart-icon-wrapper');
        if (cartIcon) {
            cartIcon.classList.remove('pop');
            void cartIcon.offsetWidth;
            cartIcon.classList.add('pop');
        }
    };
    const updateQuantity = (itemId, newQuantity) => {
        const itemInCart = cart.find(item => item.id === itemId);
        if (!itemInCart) return;
        const product = productsDB.find(p => p.id === itemInCart.productId);
        if (!product) return;
        if (newQuantity > 0 && newQuantity <= product.stock) {
            itemInCart.quantity = newQuantity;
        } else if (newQuantity > product.stock) {
            showNotification(`Stokta sadece ${product.stock} adet mevcut!`, 'error');
            itemInCart.quantity = product.stock;
        } else {
            cart = cart.filter(item => item.id !== itemId);
        }
        saveCart();
        renderCart();
    };
    const removeFromCart = (itemId) => {
        cart = cart.filter(item => item.id !== itemId);
        saveCart();
        renderCart();
    };
    const applyCoupon = () => {
        const couponInput = document.getElementById('coupon-input');
        const code = couponInput.value.trim().toUpperCase();
        if (code === 'BEDAVA10') {
            coupon = { code: 'BEDAVA10', discount: 0.10 };
            showNotification('Kupon başarıyla uygulandı!', 'success');
        } else {
            coupon = null;
            showNotification('Geçersiz kupon kodu.', 'error');
        }
        couponInput.value = '';
        updateTotals();
    };
    const updateTotals = () => {
        const subtotal = cart.reduce((total, item) => {
            const product = productsDB.find(p => p.id === item.productId);
            const price = product.onSale ? product.discountPrice : product.price;
            return total + (price * item.quantity);
        }, 0);
        const FREE_SHIPPING_THRESHOLD = 500;
        const SHIPPING_FEE = 29.99;
        const shipping = subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;

        let couponDiscountAmount = 0;
        const discountLine = document.getElementById('cart-discount-line');
        if (coupon) {
            couponDiscountAmount = subtotal * coupon.discount;
        }

        let bundleDiscountAmount = 0;
        const processedBundles = new Set();
        for (const cartItem of cart) {
            const product = productsDB.find(p => p.id === cartItem.productId);
            if (product && product.bundle_offer && !processedBundles.has(product.bundle_offer.name)) {

                const allBundleItemsInCart = product.bundle_offer.partner_ids.every(id => cart.some(item => item.productId === id));
                if (allBundleItemsInCart) {
                    let bundleTotalPrice = product.onSale ? product.discountPrice : product.price;
                    product.bundle_offer.partner_ids.forEach(id => {
                        const partnerProduct = productsDB.find(p => p.id === id);
                        bundleTotalPrice += partnerProduct.onSale ? partnerProduct.discountPrice : partnerProduct.price;
                    });
                    bundleDiscountAmount += bundleTotalPrice * (product.bundle_offer.discount_percentage / 100);
                    processedBundles.add(product.bundle_offer.name);
                }
            }
        }

        const totalDiscount = couponDiscountAmount + bundleDiscountAmount;
        if (totalDiscount > 0) {
            discountLine.style.display = 'flex';
        } else {
            discountLine.style.display = 'none';
        }

        const total = subtotal + shipping - totalDiscount;

        document.getElementById('cart-subtotal').textContent = `${subtotal.toFixed(2)} ₺`;
        document.getElementById('cart-shipping').textContent = shipping > 0 ? `${shipping.toFixed(2)} ₺` : 'Ücretsiz';
        document.getElementById('cart-discount').textContent = `-${totalDiscount.toFixed(2)} ₺`;
        document.getElementById('cart-total-price').textContent = `${total.toFixed(2)} ₺`;
        const progressContainer = document.getElementById('free-shipping-progress');
        if (subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD) {
            const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
            progressContainer.textContent = `Ücretsiz kargo için ${remaining.toFixed(2)} ₺ daha ekle!`;
            progressContainer.style.display = 'block';
        } else {
            progressContainer.style.display = 'none';
        }
    };
    const renderCart = () => {
        if (cart.length === 0) {
            cartBody.innerHTML = `<div class="cart-empty-message"><h3>Sepetiniz şu an boş.</h3><p>Hemen alışverişe başlayın!</p></div>`;
        } else {
            cartBody.innerHTML = cart.map(item => {
                const product = productsDB.find(p => p.id === item.productId);
                if (!product) return '';
                const price = product.onSale ? product.discountPrice : product.price;
                const attributesHTML = item.color ? `Renk: ${item.color.name}` : product.attributes;
                return `<div class="cart-item" data-item-id="${item.id}"><img src="${product.img}" alt="${product.name}" class="cart-item-img"><div class="cart-item-details"><div class="cart-item-title">${product.name}</div><div class="cart-item-attributes">${attributesHTML}</div><div class="cart-item-price">${(price * item.quantity).toFixed(2)} ₺</div></div><div class="cart-item-actions"><div class="quantity-control"><button class="quantity-btn decrease-qty">-</button><span class="item-quantity">${item.quantity}</span><button class="quantity-btn increase-qty">+</button></div><button class="remove-item-btn">&times;</button></div></div>`;
            }).join('');
        }
        updateTotals();
        updateCartAssistant();
        const cartItemCountEl = document.querySelector('.cart-item-count');
        if (cartItemCountEl) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            if (totalItems > 0) {
                cartItemCountEl.textContent = totalItems;
                cartItemCountEl.style.display = 'flex';
                cartItemCountEl.classList.add('visible');
            } else {
                cartItemCountEl.style.display = 'none';
                cartItemCountEl.classList.remove('visible');
            }
        }
    };
    const updateCartAssistant = () => {
        const assistantContainer = document.getElementById('cart-assistant-container');
        const assistantBody = document.getElementById('assistant-body');
        assistantBody.innerHTML = '';

        if (cart.length === 0) {
            assistantContainer.style.display = 'none';
            return;
        }

        let offersHTML = new Set();
        for (const cartItem of cart) {
            const product = productsDB.find(p => p.id === cartItem.productId);
            if (!product) continue;

            if (product.related_products) {
                for (const related of product.related_products) {
                    if (!cart.some(item => item.productId === related.id)) {
                        const relatedProduct = productsDB.find(p => p.id === related.id);
                        if(relatedProduct) {
                            offersHTML.add(`
                                <div class="assistant-offer">
                                    <p><strong>${product.name}</strong> için harika bir tamamlayıcı!</p>
                                    <div class="suggestion-product">
                                        <img src="${relatedProduct.img}" alt="${relatedProduct.name}">
                                        <div class="suggestion-product-info">
                                            <strong>${relatedProduct.name}</strong>
                                            <span>${(relatedProduct.onSale ? relatedProduct.discountPrice : relatedProduct.price).toFixed(2)} ₺</span>
                                        </div>
                                        <button class="add-to-cart-btn" data-product-id="${relatedProduct.id}">Ekle</button>
                                   </div>
                                </div>`);
                        }
                    }
                }
            }

            if (product.bundle_offer) {
                const allPartnerIds = [product.id, ...product.bundle_offer.partner_ids];
                const itemsInCartForBundle = cart.filter(item => allPartnerIds.includes(item.productId));
                const uniqueItemsInCartForBundle = [...new Set(itemsInCartForBundle.map(item => item.productId))];
                if (uniqueItemsInCartForBundle.length < allPartnerIds.length) {
                    const missingPartnerIds = allPartnerIds.filter(id => !uniqueItemsInCartForBundle.includes(id));
                    offersHTML.add(`
                        <div class="assistant-offer">
                            <p><strong>${product.bundle_offer.name} Fırsatı:</strong> ${product.bundle_offer.text}</p>
                            ${missingPartnerIds.map(id => {
                                 const p = productsDB.find(prod => prod.id === id);
                                return `<div class="suggestion-product" style="margin-bottom: 8px;">
                                    <img src="${p.img}" alt="${p.name}">
                                     <div class="suggestion-product-info"><strong>${p.name}</strong></div>
                                    <button class="add-to-cart-btn" data-product-id="${p.id}">Ekle</button>
                                </div>`;
                            }).join('')}
                        </div>`);
                }
            }
        }

        if (offersHTML.size > 0) {
            assistantContainer.style.display = 'block';
            assistantBody.innerHTML = [...offersHTML].join('');
        } else {
            assistantContainer.style.display = 'none';
        }
    };

    // ========================================================================================= //
    // --- ÖDEME AKIŞI YÖNETİMİ ---
    // ========================================================================================= //
    const initCheckout = () => {
        if (cart.length === 0) {
            showNotification('Ödeme yapmak için sepetinizde ürün olmalıdır.', 'error');
            return;
        }
        closeCart();
        document.body.classList.add('checkout-active');
        checkoutPage.style.display = 'block';
        document.getElementById('checkout-pre-summary').style.display = 'flex';
        document.getElementById('checkout-main-content').style.display = 'none';
        renderCheckoutSummary();
        document.getElementById('pre-summary-items').innerHTML = document.getElementById('summary-items').innerHTML;
        document.getElementById('pre-summary-totals').innerHTML = document.getElementById('summary-totals').innerHTML;
        updateDeliveryDates();
    };
    const closeCheckout = () => {
        document.body.classList.remove('checkout-active');
        checkoutPage.style.display = 'none';
    };
    const goToStep = (stepIdentifier) => {
        document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
        const stepEl = document.getElementById(stepIdentifier);
        if (stepEl) stepEl.classList.add('active');

        const isConfirmation = stepIdentifier === 'order-confirmation';
        const currentStepNumber = isConfirmation ? 4 : parseInt(stepIdentifier.replace('step-', ''));

        document.querySelectorAll('.progress-step-graphic').forEach(ps => {
            const graphicStepNumber = parseInt(ps.dataset.step);
            ps.classList.toggle('active', graphicStepNumber <= currentStepNumber);
        });
    };
    const renderCheckoutSummary = () => {
        document.getElementById('summary-items').innerHTML = cart.map(item => {
            const product = productsDB.find(p => p.id === item.productId);
            const price = product.onSale ? product.discountPrice : product.price;
            return `<div class="summary-item"><img src="${product.img}" class="summary-item-img"><div class="summary-item-info"><div>${product.name}</div><span>Adet: ${item.quantity}</span></div><strong class="summary-item-price">${(price * item.quantity).toFixed(2)} ₺</strong></div>`;
        }).join('');
        updateCheckoutTotals();
    };
    const updateCheckoutTotals = () => {
        const subtotal = cart.reduce((total, item) => {
            const product = productsDB.find(p => p.id === item.productId);
            return total + ((product.onSale ? product.discountPrice : product.price) * item.quantity);
        }, 0);
        const shipping = checkoutState.delivery.price;
        const giftWrapFee = checkoutState.giftWrap ? 19.99 : 0;
        let discountAmount = 0;
        if(coupon) {
            discountAmount = subtotal * coupon.discount;
            document.getElementById('summary-discount-line').style.display = 'flex';
            document.getElementById('summary-discount').textContent = `-${discountAmount.toFixed(2)} ₺`;
        } else {
            document.getElementById('summary-discount-line').style.display = 'none';
        }
        const total = subtotal + shipping + giftWrapFee - discountAmount;
        document.getElementById('summary-subtotal').textContent = `${subtotal.toFixed(2)} ₺`;
        document.getElementById('summary-shipping').textContent = `${shipping.toFixed(2)} ₺`;
        document.getElementById('summary-total').textContent = `${total.toFixed(2)} ₺`;
    };
    const updateDeliveryDates = () => {
        const today = new Date();
        const formatDate = (date) => `${date.getDate()} ${date.toLocaleString('tr-TR', { month: 'long' })}`;
        const standartStart = new Date(today);
        standartStart.setDate(today.getDate() + 3);
        const standartEnd = new Date(today);
        standartEnd.setDate(today.getDate() + 5);
        const ekspresStart = new Date(today);
        ekspresStart.setDate(today.getDate() + 1);
        const standartEl = document.querySelector('.delivery-date-standart');
        const ekspresEl = document.querySelector('.delivery-date-ekspres');
        if (standartEl) standartEl.textContent = `${formatDate(standartStart)} - ${formatDate(standartEnd)}`;
        if (ekspresEl) ekspresEl.textContent = `${formatDate(ekspresStart)}`;
    };
    const populateConfirmationScreen = (order, earnedBC) => {
        const user = getActiveUser();
        document.getElementById('conf-order-number').textContent = `#${order.id}`;
        document.getElementById('conf-delivery-date').textContent = order.delivery.estimatedDate;
        document.getElementById('conf-shipping-co').textContent = order.delivery.company;
        document.getElementById('conf-total-price').textContent = `${order.total.toFixed(2)} ₺`;
        document.getElementById('conf-bc-earned').textContent = `${earnedBC} BC Puanı`;
        document.getElementById('conf-bc-total').textContent = `${user.bc} BC`;

        const itemsList = document.getElementById('conf-items-list');
        itemsList.innerHTML = order.items.map(item => {
             const product = productsDB.find(p => p.id === item.productId);
             return `
                <div class="conf-item">
                    <img src="${product.img}" alt="${product.name}" class="conf-item-img">
                    <div>
                        <strong>${product.name}</strong>
                        <div style="font-size:0.9em; color:#666;">Adet: ${item.quantity}</div>
                    </div>
                </div>`;
         }).join('');
    };

    // --- HAZİNE AVI FONKSİYONLARI ---
    function setupTreasureHunt() {
        const today = new Date().toDateString();
        const lastVisitDate = localStorage.getItem('lastTreasureVisit');

        if (lastVisitDate !== today) {
            const randomProductIndex = Math.floor(Math.random() * productsDB.length);
            treasureProductId = productsDB[randomProductIndex].id;
            localStorage.setItem('treasureProductId', treasureProductId);
            localStorage.setItem('lastTreasureVisit', today);
        } else {
            treasureProductId = parseInt(localStorage.getItem('treasureProductId'));
        }

        const treasureProduct = productsDB.find(p => p.id === treasureProductId);
        if (treasureProduct) {
            const clueElement = document.getElementById('treasure-clue');
            if(clueElement) {
                const categoryMap = { 'teknoloji': 'Teknoloji', 'kozmetik': 'Kozmetik', 'moda': 'Moda', 'ev-yasam': 'Ev & Yaşam' };
                clueElement.textContent = `"${categoryMap[treasureProduct.category]}"`;
            }
            const bannerElement = document.getElementById('treasure-hunt-banner');
            if(bannerElement) bannerElement.style.display = 'block';
        }
    }
    function claimTreasure() {
        const user = getActiveUser();
        const today = new Date().toDateString();

        if (!user) {
            showNotification('Ödülü almak için giriş yapmalısınız!', 'error');
            openModal(loginModal);
            return;
        }

        if (user.lastTreasureClaimDate === today) {
            showNotification('Bugünkü hazineyi zaten buldun!', 'error');
            return;
        }

        showNotification('Tebrikler! 50 BC kazandınız!', 'success');
        user.bc = (user.bc || 0) + 50;
        user.lastTreasureClaimDate = today;
        updateActiveUser(user);
        document.querySelectorAll('.treasure-chest').forEach(chest => {
            chest.style.display = 'none';
        });
        updateUI(); 
    }

    // ========================================================================================= //
    // --- UI & KULLANICI YÖNETİMİ ---
    // ========================================================================================= //
    const updateUI = () => {
        const user = getActiveUser();
        if (user) {
            loggedOutMenu.style.display = 'none';
            loggedInMenu.style.display = 'block';
            // Yeni eklenen alanları doldurur
            document.getElementById('menu-username').textContent = `${user.name} ${user.surname}`;
            document.getElementById('menu-user-email').textContent = user.email;
            document.getElementById('menu-user-bc').textContent = user.bc || 0;

            const userInitials = (user.name ? user.name[0] : '') + (user.surname ? user.surname[0] : '');
            document.getElementById('user-initials').textContent = userInitials.toUpperCase();

        } else {
            loggedOutMenu.style.display = 'block';
            loggedInMenu.style.display = 'none';
        }
        updateFavoriteIcons();
    };
    // ========================================================================================= //
    // --- YORUM YÖNETİMİ FONKSİYONLARI ---
    // ========================================================================================= //
    const getReviewsDatabase = () => JSON.parse(localStorage.getItem('productReviews')) || {};
    const saveReviewsDatabase = (db) => localStorage.setItem('productReviews', JSON.stringify(db));

    const addReview = (productId, reviewText, rating, imageSrc) => {
        const db = getReviewsDatabase();
        if (!db[productId]) {
            db[productId] = [];
        }
        const user = getActiveUser();
        const newReview = {
            id: Date.now(),
            author: user ? user.name : 'Anonim',
            userId: user ? user.email : null,
            text: reviewText,
            rating: rating,
            image: imageSrc,
            hasPurchased: user ? (user.orders && user.orders.some(order => order.items.some(item => item.productId === productId))) : false
        };
        db[productId].unshift(newReview);
        saveReviewsDatabase(db);
    };
    const deleteReview = (productId, reviewId) => {
        const db = getReviewsDatabase();
        if (db[productId]) {
            db[productId] = db[productId].filter(review => review.id !== reviewId);
            saveReviewsDatabase(db);
        }
    };

    const renderReviews = (productId) => {
        const db = getReviewsDatabase();
        const reviews = db[productId] || [];
        const reviewsListContainer = document.getElementById('reviewsListDetail');
        const currentUser = getActiveUser();
        if (reviews.length === 0) {
            reviewsListContainer.innerHTML = "<p style='color:#888;'>Henüz yorum yapılmamış.</p>";
            return;
        }

        reviewsListContainer.innerHTML = reviews.map(review => {
            const imageHTML = review.image ? `<img src="${review.image}" class="review-item-image" alt="review image">` : '';

            let verifiedBadgeHTML = '';
            if (review.hasPurchased) {
                verifiedBadgeHTML = `
                <span class="verified-purchase-badge">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                        Onaylı Satın Alım
                    </span>`;
            }

            const deleteButtonHTML = (currentUser && currentUser.email === review.userId) 
                ? `<button class="delete-review-btn" data-review-id="${review.id}" title="Yorumu Sil">🗑️</button>` 
                : '';

            return `
            <div class="review-item">
                <div class="review-item-header">
                    <div class="review-author-wrapper">
                        <span class="review-item-author">${review.author.replace(/</g, "&lt;")}</span>
                        ${verifiedBadgeHTML}
                    </div>
                    <div class="review-item-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                </div>
                <p class="review-item-text">${review.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                ${imageHTML}
                ${deleteButtonHTML}
            </div>`;
        }).join('');
    };
    // ========================================================================================= //
    // --- ÜRÜN DETAY MODALI FONKSİYONLARI ---
    // ========================================================================================= //
    function openProductDetail(product) {
        currentDetailProductId = product.id;
        detailName.textContent = product.name;

        if (product.onSale) {
            detailPrice.textContent = `${product.discountPrice.toFixed(2)} ₺`;
            detailDiscount.textContent = `${product.price.toFixed(2)} ₺`;
            detailDiscount.style.display = 'inline';
        } else {
            detailPrice.textContent = `${product.price.toFixed(2)} ₺`;
            detailDiscount.style.display = 'none';
        }

        detailAttributes.textContent = product.attributes || '';
        detailImage.src = product.img;
        addToCartDetailBtn.dataset.productId = product.id;

        const vtoDetailContainer = document.getElementById('detail_vto_trigger_container');
        if (product.category === 'kozmetik' && product.colors) {
             vtoDetailContainer.innerHTML = `<button class="vto-trigger-btn" data-product-id="${product.id}" style="width: 100%;">✨ Bu Ürünü Canlı Dene</button>`;
        } else {
            vtoDetailContainer.innerHTML = '';
        }

        renderReviews(currentDetailProductId);
        resetReviewForm();

        openModal(productDetailModal);
    }
    function resetReviewForm() {
        detailRating = 0;
        reviewTextDetail.value = '';
        reviewImageDetail.value = '';
        starRatingDetail.forEach(s => s.classList.remove('selected'));
    }

    // ========================================================================================= //
    // --- VTO (SANAL DENEME) FONKSİYONLARI ---
    // ========================================================================================= //
    async function loadVTOModel() {
        try {
             faceMeshModel = await faceLandmarksDetection.load(
                faceLandmarksDetection.SupportedPackages.medipeFacemesh,
                { maxFaces: 1 }
            );
            console.log("Yüz tanıma modeli başarıyla yüklendi.");
        } catch (error) {
            console.error("Yüz tanıma modeli yüklenemedi:", error);
            showNotification("Sanal deneme özelliği yüklenemedi.", "error");
        }
    }
    async function startVTO(product) {
        if (!faceMeshModel) {
            showNotification("Sanal deneme özelliği henüz hazır değil, lütfen bekleyin.", "error");
            return;
        }

        try {
            videoStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480 },
                audio: false
            });
            vtoVideo.srcObject = videoStream;
            await vtoVideo.play();

            vtoOverlay.style.display = 'flex';
            vtoIsRunning = true;
            currentVTOProduct = product;
            currentVTOColor = product.colors[0].hex;

            vtoProductName.textContent = product.name;
            vtoProductColors.innerHTML = product.colors.map((color, index) =>
                `<div class="vto-color-swatch ${index === 0 ? 'selected' : ''}" style="background-color: ${color.hex};" data-color="${color.hex}" title="${color.name}"></div>`
            ).join('');
            vtoAddToCartBtn.dataset.productId = product.id;
            vtoAnimationId = requestAnimationFrame(renderMakeupEffect);
        } catch (err) {
            console.error("Kamera erişim hatası:", err);
            showNotification("Kamera erişimi reddedildi veya bir hata oluştu.", "error");
        }
    }
    function stopVTO() {
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
        }
        vtoIsRunning = false;
        if(vtoAnimationId) cancelAnimationFrame(vtoAnimationId);
        vtoOverlay.style.display = 'none';
        const ctx = vtoCanvas.getContext('2d');
        ctx.clearRect(0, 0, vtoCanvas.width, vtoCanvas.height);
    }
    const LIP_KEYPOINTS = [ 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308 ];
    async function renderMakeupEffect() {
        if (!vtoIsRunning) return;
        const ctx = vtoCanvas.getContext('2d');
        vtoCanvas.width = vtoVideo.videoWidth;
        vtoCanvas.height = vtoVideo.videoHeight;

        const predictions = await faceMeshModel.estimateFaces({ input: vtoVideo });
        ctx.clearRect(0, 0, vtoCanvas.width, vtoCanvas.height);
        if (predictions.length > 0) {
            const keypoints = predictions[0].scaledMesh;
            ctx.beginPath();
            LIP_KEYPOINTS.forEach((pointIndex, i) => {
                const [x, y] = keypoints[pointIndex];
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.closePath();

            ctx.globalAlpha = 0.6;
            ctx.fillStyle = currentVTOColor;
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }

        vtoAnimationId = requestAnimationFrame(renderMakeupEffect);
    }

    // ========================================================================================= //
    // --- EVENT LISTENERS (OLAY DİNLEYİCİLERİ) ---
    // ========================================================================================= //

    sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sortPanel.classList.toggle('open');
    });
    sortPanel.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('sort-option')) {
            currentSort = e.target.dataset.sort;
            document.getElementById('current-sort-display').textContent = e.target.textContent;
            applyAllFilters();
            sortPanel.classList.remove('open');
        }
    });
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const users = getUserDatabase();
        const newUser = {
            name: document.getElementById('reg-name').value.trim(),
            surname: document.getElementById('reg-surname').value.trim(),
            phone: document.getElementById('reg-phone').value.trim(),
            email: document.getElementById('reg-email').value.trim().toLowerCase(),
            username: document.getElementById('reg-username').value.trim(),
            password: document.getElementById('reg-password').value,
            bc: 0, orders: [], favorites: []
        };
        if (!validateUsername(newUser.username) || !validateEmail(newUser.email) || !validatePassword(newUser.password)) { showNotification('Lütfen tüm alanları kurallara uygun doldurun.', 'error'); return; }
        if (users.some(user => user.username.toLowerCase() === newUser.username.toLowerCase())) { showNotification('Bu kullanıcı adı zaten alınmış.', 'error'); return; }
        if (users.some(user => user.email === newUser.email)) { showNotification('Bu e-posta adresi zaten kullanılıyor.', 'error'); return; }
        users.push(newUser);
        saveUserDatabase(users);
        showNotification('Kayıt olundu! Şimdi giriş yapabilirsiniz.', 'success');
        e.target.reset();
        openModal(loginModal);
    });
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const identifier = document.getElementById('login-username').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;
        const users = getUserDatabase();
        const foundUser = users.find(user => (user.username.toLowerCase() === identifier || user.email === identifier) && user.password === password);
        if (foundUser) { setActiveUser(foundUser); closeModal(); updateUI(); showNotification(`Hoş geldin, ${foundUser.name}!`, 'success'); } else { showNotification('Kullanıcı adı/e-posta veya şifre yanlış.', 'error'); }
    });
    // Profil güncelleme formu için event listener'ı modal'a bağlayalım
    profileModal.addEventListener('submit', e => {
        if(e.target.id === 'profile-edit-form'){
            e.preventDefault();
            const currentUser = getActiveUser(); if(!currentUser) return;

            const updatedUser = {
                ...currentUser,
                 name: document.getElementById('edit-name').value.trim(),
                surname: document.getElementById('edit-surname').value.trim(),
                username: document.getElementById('edit-username').value.trim(),
                email: document.getElementById('edit-email').value.trim().toLowerCase(),
                phone: document.getElementById('edit-phone').value.trim()
            };
            const updatedPassword = document.getElementById('edit-password').value;
             if (updatedPassword) {
                updatedUser.password = updatedPassword;
            }

            updateActiveUser(updatedUser);
            showNotification('Profil bilgileri başarıyla güncellendi.', 'success');
            closeModal();
            updateUI();
        }
    });
    const handleSocialLogin = (provider) => {
        const users = getUserDatabase();
        const email = `user@${provider.toLowerCase()}.com`;
        let user = users.find(u => u.email === email);
        if (!user) { user = { name: `${provider} Kullanıcısı`, surname: '', phone: '', email: email, username: `${provider.toLowerCase()}_user`, password: 'sociallogin', bc: 0, orders: [], favorites: [] }; users.push(user); saveUserDatabase(users); }
        setActiveUser(user); closeModal(); updateUI();
        showNotification(`Hoş geldin, ${user.name}!`, 'success');
    };
    document.getElementById('google-login-btn').addEventListener('click', () => handleSocialLogin('Google'));

    profileIconWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle('open');
    });
    categoriesIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        categoriesDropdown.style.display = categoriesDropdown.style.display === 'block' ? 'none' : 'block';
    });
    document.body.addEventListener('click', (e) => {
        if (!searchBanner.contains(e.target)) {
            document.getElementById('search-results-panel').style.display = 'none';
        }
        if (profileMenu.classList.contains('open') && !profileIconWrapper.contains(e.target)) {
            profileMenu.classList.remove('open');
        }
        if (categoriesDropdown.style.display === 'block' && !categoriesIcon.contains(e.target)) {
            categoriesDropdown.style.display = 'none';
        }
        if (sortPanel.classList.contains('open') && !sortBtn.contains(e.target)) {
            sortPanel.classList.remove('open');
        }
        if (filterPanel.classList.contains('open') && e.target === cartOverlay) {
             filterPanel.classList.remove('open');
             cartOverlay.style.display = 'none';
        }
        if (modalOverlay.style.display === 'flex' && e.target === modalOverlay) {
            closeModal();
        }
    });
    // === GÜNCELLENMİŞ PROFİL MENÜSÜ EVENT LISTENER ===
    profileMenu.addEventListener('click', (e) => {
        const target = e.target.closest('a, button');
        if (!target) return;

        e.preventDefault();
        const action = target.id;

        const actions = {
            'menu-login-btn': () => openModal(loginModal),
            'menu-register-btn': () => openModal(registerModal),
            'menu-profile-link': () => { renderProfileModal(); openModal(profileModal); },
            'menu-orders-link': () => { renderOrders(); openModal(ordersModal); },
            'menu-favorites-link': () => { renderFavorites(); openModal(favoritesModal); },
            'menu-coupons-link': () => { renderCoupons(); openModal(couponsModal); },
            'menu-settings-link': () => openModal(settingsModal),
            'menu-help-link': () => openModal(helpModal),
            'menu-logout-btn': () => { logoutUser(); updateUI(); showNotification('Başarıyla çıkış yapıldı.', 'success'); },
        };
        if (actions[action]) {
            actions[action]();
            profileMenu.classList.remove('open');
        }
    });

    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        openModal(registerModal);
    });
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        openModal(loginModal);
    });
    cartOpenBtn.addEventListener('click', openCart);
    document.getElementById('cart-close-btn').addEventListener('click', closeCart);
    document.getElementById('continue-shopping-btn').addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', (e) => {
        if(e.target === cartOverlay && !filterPanel.classList.contains('open')){
            closeCart();
        }
    });
    cartBody.addEventListener('click', e => {
        const itemElement = e.target.closest('.cart-item');
        if (!itemElement) return;
        const itemId = itemElement.dataset.itemId;
        let item = cart.find(i => i.id === itemId);
        if (!item) return;

        if (e.target.matches('.increase-qty')) updateQuantity(itemId, item.quantity + 1);
        if (e.target.matches('.decrease-qty')) updateQuantity(itemId, item.quantity - 1);
        if (e.target.matches('.remove-item-btn')) removeFromCart(itemId);
    });
    document.getElementById('apply-coupon-btn').addEventListener('click', applyCoupon);
    document.getElementById('checkout-btn').addEventListener('click', initCheckout);
    document.getElementById('back-to-store-link').addEventListener('click', (e) => { e.preventDefault(); closeCheckout(); });
    document.querySelectorAll('.next-btn, .back-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetStep = btn.dataset.next || btn.dataset.back; if (!targetStep) return;
            const currentStepEl = btn.closest('.checkout-step');
            if (btn.dataset.next) {
                 if (currentStepEl.id === 'step-1') {
                    const form = document.getElementById('address-form');
                    if (!form.checkValidity()) { form.reportValidity(); return; }
                    checkoutState.address = { name: form.fname.value, surname: form.lname.value, address: form.address.value, city: form.city.value, zip: form.zip.value, phone: form.phone.value };
                }
                if (currentStepEl.id === 'step-3') {
                    document.getElementById('review-address').textContent = `${checkoutState.address.address}, ${checkoutState.address.zip} ${checkoutState.address.city}`;
                    document.getElementById('review-delivery').textContent = document.querySelector(`input[name="delivery"]:checked`).parentElement.querySelector('.option-header span').textContent;
                    document.getElementById('review-payment').textContent = document.querySelector(`input[name="payment"]:checked`).parentElement.textContent.trim();
                }
            }
            goToStep(targetStep);
        });
    });

    document.querySelectorAll('#delivery-options .option-box').forEach(box => { box.addEventListener('click', () => { document.querySelectorAll('#delivery-options .option-box').forEach(b => b.classList.remove('selected')); box.classList.add('selected'); const radio = box.querySelector('input'); checkoutState.delivery = { type: radio.value, price: parseFloat(radio.dataset.price) }; updateCheckoutTotals(); }); });
    document.getElementById('gift-wrap-check').addEventListener('change', (e) => { checkoutState.giftWrap = e.target.checked; updateCheckoutTotals(); });
    document.getElementById('back-to-home-final').addEventListener('click', closeCheckout);
    document.getElementById('proceed-to-payment-btn').addEventListener('click', () => { document.getElementById('checkout-pre-summary').style.display = 'none'; document.getElementById('checkout-main-content').style.display = 'grid'; goToStep('step-1'); });
    document.getElementById('continue-shopping-from-summary-btn').addEventListener('click', closeCheckout);
    document.getElementById('back-to-cart-link-pre-summary').addEventListener('click', (e) => { e.preventDefault(); closeCheckout(); openCart(); });
    document.getElementById('back-to-summary-link').addEventListener('click', (e) => { e.preventDefault(); document.getElementById('checkout-main-content').style.display = 'none'; document.getElementById('checkout-pre-summary').style.display = 'flex'; });
    document.getElementById('confirm-order-btn').addEventListener('click', () => {
        const currentUser = getActiveUser(); if (!currentUser) { showNotification('Siparişi tamamlamak için giriş yapmalısınız!', 'error'); openModal(loginModal); return; }
        const now = new Date(); const deliveryDate = new Date(); deliveryDate.setDate(now.getDate() + (checkoutState.delivery.type === 'ekspres' ? 2 : 5));
        const subtotal = cart.reduce((total, item) => { const product = productsDB.find(p => p.id === item.productId); return total + ((product.onSale ? product.discountPrice : product.price) * item.quantity); }, 0);
        const total = subtotal + checkoutState.delivery.price + (checkoutState.giftWrap ? 19.99 : 0) - (coupon ? subtotal * coupon.discount : 0);
        const earnedBC = Math.floor(total / 100);
        const newOrder = { id: Date.now(), date: now.getTime(), items: [...cart], total: total, status: 'Hazırlanıyor', delivery: { type: checkoutState.delivery.type, price: checkoutState.delivery.price, company: checkoutState.delivery.type === 'ekspres' ? 'Hızlı Kargo A.Ş.' : 'Standart Kargo', estimatedDate: deliveryDate.toLocaleDateString('tr-TR') }, address: checkoutState.address };
        currentUser.bc = (currentUser.bc || 0) + earnedBC;
        currentUser.orders = [...(currentUser.orders || []), newOrder];
        updateActiveUser(currentUser);
        populateConfirmationScreen(newOrder, earnedBC);
        cart = []; sessionStorage.removeItem('cart'); coupon = null;
        renderCart();
        goToStep('order-confirmation');
    });
    document.getElementById('home-link').addEventListener('click', (e) => { e.preventDefault(); currentFilters.category = 'all'; document.querySelectorAll('.categories-dropdown a').forEach(a => a.classList.remove('selected')); document.querySelector('.categories-dropdown a[data-category="all"]').classList.add('selected'); applyAllFilters(); });
    categoriesDropdown.addEventListener('click', (e) => { e.preventDefault(); if (e.target.tagName === 'A') { currentFilters.category = e.target.dataset.category; document.querySelectorAll('.categories-dropdown a').forEach(a => a.classList.remove('selected')); e.target.classList.add('selected'); applyAllFilters(); categoriesDropdown.style.display = 'none';} });
    filterBtn.addEventListener('click', () => {
        filterPanel.classList.toggle('open');
        if (window.innerWidth <= 768 && filterPanel.classList.contains('open')) {
            cartOverlay.style.display = 'block';
        } else {
            cartOverlay.style.display = 'none';
        }
    });
    const closeFilterPanelBtn = document.querySelector('.close-filter-panel');
    if (closeFilterPanelBtn) {
        closeFilterPanelBtn.addEventListener('click', () => {
            filterPanel.classList.remove('open');
            cartOverlay.style.display = 'none';
        });
    }

    document.getElementById('min-price').addEventListener('input', (e) => { currentFilters.minPrice = e.target.value; applyAllFilters(); });
    document.getElementById('max-price').addEventListener('input', (e) => { currentFilters.maxPrice = e.target.value; applyAllFilters(); });
    document.getElementById('on-sale-checkbox').addEventListener('change', (e) => { currentFilters.onSale = e.target.checked; applyAllFilters(); });
    document.getElementById('size-selector').addEventListener('click', (e) => { if (e.target.tagName === 'BUTTON') { const size = e.target.dataset.size; e.target.classList.toggle('selected'); if (currentFilters.sizes.includes(size)) { currentFilters.sizes = currentFilters.sizes.filter(s => s !== size); } else { currentFilters.sizes.push(size); } applyAllFilters(); } });
    document.getElementById('search-icon-btn').addEventListener('click', () => { searchBanner.classList.add('search-active'); searchInput.focus(); });
    document.getElementById('search-close-btn').addEventListener('click', () => { searchInput.value = ''; applyAllFilters(); searchBanner.classList.remove('search-active'); document.getElementById('search-results-panel').style.display = 'none'; });
    searchInput.addEventListener('input', () => {
        applyAllFilters();
        showLiveSearchResults();
    });
    document.getElementById('search-results-panel').addEventListener('click', (e) => {
        const item = e.target.closest('.search-result-item');
        if (item) {
            const productId = parseInt(item.dataset.productId);
            const product = productsDB.find(p => p.id === productId);
            if (product) {
                openProductDetail(product);
                document.getElementById('search-results-panel').style.display = 'none';
                searchBanner.classList.remove('search-active');
                searchInput.value = '';
                applyAllFilters();
            }
        }
    });
    starRatingDetail.forEach(star => { star.addEventListener('click', () => { detailRating = parseInt(star.dataset.value); starRatingDetail.forEach((s, index) => s.classList.toggle('selected', index < detailRating)); }); });
    submitReviewDetail.addEventListener('click', () => {
        const user = getActiveUser();
        if (!user) {
            showNotification('Yorum yapmak için giriş yapmalısınız.', 'error');
            openModal(loginModal);
            return;
        }
        const reviewText = reviewTextDetail.value.trim();
        if (!detailRating || !reviewText) {
            showNotification('Lütfen puan verin ve bir yorum yazın.', 'error');
            return;
        }

        if (reviewImageDetail.files.length > 0) {
            const reader = new FileReader();
            reader.onloadend = function() {
                const imageBase64 = reader.result;
                 addReview(currentDetailProductId, reviewText, detailRating, imageBase64);
                renderReviews(currentDetailProductId);
                resetReviewForm();
            };
            reader.readAsDataURL(reviewImageDetail.files[0]);
        } else {
            addReview(currentDetailProductId, reviewText, detailRating, null);
            renderReviews(currentDetailProductId);
            resetReviewForm();
        }

        showNotification('Yorumunuz için teşekkür ederiz!', 'success');
    });

    reviewsListDetail.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-review-btn');
        if (deleteBtn) {
            const reviewId = parseInt(deleteBtn.dataset.reviewId);
            if (confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
                deleteReview(currentDetailProductId, reviewId);
                renderReviews(currentDetailProductId);
                showNotification('Yorum silindi.', 'success');
            }
        }
    });
    vtoCloseBtn.addEventListener('click', stopVTO);
    vtoProductColors.addEventListener('click', (e) => {
        if (e.target.matches('.vto-color-swatch')) {
            currentVTOColor = e.target.dataset.color;
            document.querySelectorAll('.vto-color-swatch').forEach(el => el.classList.remove('selected'));
            e.target.classList.add('selected');
        }
    });
    vtoAddToCartBtn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.productId);
        addToCart(productId, true);
        showNotification('Seçilen renk sepete eklendi!', 'success');
    });
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.closest('#virtual-try-on-overlay')) {
                stopVTO();
            } else {
                closeModal();
            }
        });
    });
    if (shareModal) {
        document.getElementById('copy-share-link-btn').addEventListener('click', (e) => {
            const linkInput = document.getElementById('share-product-link');
            navigator.clipboard.writeText(linkInput.value).then(() => {
                showNotification('Link panoya kopyalandı!', 'success');
            }, () => {
                showNotification('Link kopyalanamadı.', 'error');
            });
        });
        shareModal.querySelector('.share-social-icons').addEventListener('click', (e) => {
            const socialLink = e.target.closest('.social-icon');
            if (socialLink) {
                e.preventDefault();
                claimShareReward();
                closeModal();
            }
        });
    }

    productGrid.addEventListener('click', (e) => {
        const target = e.target;
        const button = target.closest('button');
        const productCard = target.closest('.product-card');
        if (!productCard) return;

        const productId = parseInt(productCard.dataset.productId);
        const product = productsDB.find(p => p.id === productId);
        if (!product) return;

        if (button && button.matches('.add-to-cart-btn')) {
            addToCart(productId);
        } else if (button && button.matches('.favorite-btn')) {
            toggleFavorite(productId);
        } else if (button && button.matches('.share-btn')) {
            openShareModal(product);
        } else if (button && button.matches('.vto-trigger-btn')) {
            startVTO(product);
        } else if (target.matches('.product-image-for-detail')) {
            openProductDetail(product);
        } else if (target.matches('.treasure-chest')) {
            claimTreasure();
        }
    });
    document.getElementById('cart-panel').addEventListener('click', e => {
        if (e.target.matches('.suggestion-product button')) {
            const productId = parseInt(e.target.dataset.productId);
            addToCart(productId);
        }
    });
    // YENİ EVENT LISTENER'LAR
    ordersModal.addEventListener('change', e => {
        if (e.target.id === 'order-status-filter') {
            renderOrders(e.target.value);
        }
    });
    document.getElementById('orders-list-container').addEventListener('click', e => {
        if (e.target.matches('.track-cargo-btn')) {
            const orderId = parseInt(e.target.dataset.orderId);
            const user = getActiveUser();
            const order = user.orders.find(o => o.id === orderId);
            if (order) {
                renderTrackingInfo(order);
                openModal(trackingModal);
            }
        }
    });
    document.getElementById('favorites-list-container').addEventListener('click', e => {
        if (e.target.matches('.add-to-cart-btn')) {
            const productId = parseInt(e.target.dataset.productId);
            addToCart(productId);
            openCart();
        }
    });
    document.getElementById('productDetailModal').addEventListener('click', e => {
        if (e.target.matches('.vto-trigger-btn')) {
             const productId = parseInt(e.target.dataset.productId);
             const product = productsDB.find(p => p.id === productId);
             if (product) {
                 closeModal();
                 setTimeout(() => startVTO(product), 300);
             }
        }
        if (e.target.id === 'addToCartDetail') {
            const productId = parseInt(e.target.dataset.productId);
            addToCart(productId);
            openCart();
        }
    });
    // --- YENİ MODAL İÇİ ETKİLEŞİMLERİ ---
    if(profileModal) {
        profileModal.addEventListener('click', (e) => {
            if (e.target.matches('.profile-tab-link')) {
                profileModal.querySelectorAll('.profile-tab-link').forEach(tab => tab.classList.remove('active'));
                profileModal.querySelectorAll('.profile-tab-content').forEach(content => content.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.tab).classList.add('active');
            }
        });
    }
     if(couponsModal) {
        couponsModal.addEventListener('click', (e) => {
            if (e.target.matches('.coupon-tab-link')) {
                couponsModal.querySelectorAll('.coupon-tab-link').forEach(tab => tab.classList.remove('active'));
                couponsModal.querySelectorAll('.coupon-tab-content').forEach(content => content.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.tab).classList.add('active');
            }
        });
    }
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target.matches('.settings-menu-item')) {
                e.preventDefault();
                settingsModal.querySelectorAll('.settings-menu-item').forEach(item => item.classList.remove('active'));
                settingsModal.querySelectorAll('.setting-pane').forEach(pane => pane.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.target).classList.add('active');
            }
        });
    }
     if(helpModal) {
        helpModal.addEventListener('click', (e) => {
            if (e.target.matches('.accordion-header')) {
                const item = e.target.parentElement;
                const content = item.querySelector('.accordion-content');
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                    e.target.classList.remove('active');
                    content.style.maxHeight = 0;
                    content.style.padding = "0 20px";
                } else {
                    item.classList.add('active');
                    e.target.classList.add('active');
                    content.style.padding = "20px";
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            }
        });
    }

// --- BAŞLANGIÇ FONKSİYONLARI ---
    setupTreasureHunt();
    applyAllFilters();
    updateUI();
    loadVTOModel();
    renderCart();
});
