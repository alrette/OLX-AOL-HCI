// navbar.js

class ProfessionalNavbar {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.mobileToggle = document.querySelector('.mobile-menu-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.dropdown = document.querySelector('.categories-dropdown');
        
        if (!this.navbar) {
            console.error("Navbar element not found. Initialization failed.");
            return;
        }
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMegaMenu();
        this.setupMobileMenu();
        this.setupSearch();
    }

    setupSearch() {
        const allSearchInputs = document.querySelectorAll('.search-input');
        const allSearchButtons = document.querySelectorAll('.search-btn');

        const performSearch = () => {
            window.location.href = 'search.html';
        };

        allSearchInputs.forEach(input => {
            input.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    performSearch();
                }
            });
        });

        allSearchButtons.forEach(button => {
            button.addEventListener('click', performSearch);
        });
    }

    setupEventListeners() {
        if (this.mobileToggle && this.mobileMenu) {
            this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        document.addEventListener('click', (e) => {
            if (this.dropdown && !this.dropdown.contains(e.target)) {
                this.closeDropdown();
            }
            if (this.mobileMenu && this.mobileToggle && this.mobileMenu.classList.contains('active') && !this.mobileMenu.contains(e.target) && !this.mobileToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        const dropdownToggle = this.dropdown ? this.dropdown.querySelector('.dropdown-toggle') : null;
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.dropdown.classList.toggle('active');
            });
        }
    }

    setupMegaMenu() {
        if (!this.dropdown) return;

        const mainCategoryItems = this.dropdown.querySelectorAll('.main-category-item');
        const subcategoryContents = this.dropdown.querySelectorAll('.subcategory-content');

        mainCategoryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                mainCategoryItems.forEach(i => i.classList.remove('active'));
                subcategoryContents.forEach(p => p.classList.remove('active'));
                item.classList.add('active');
                const categoryId = item.dataset.category;
                const targetPanel = this.dropdown.querySelector(`.subcategory-content#${categoryId}`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });

        if (mainCategoryItems.length > 0) {
            mainCategoryItems[0].dispatchEvent(new Event('mouseenter'));
        }
    }

    setupMobileMenu() {
        const mobileCategoryToggle = document.querySelector('.mobile-nav-item.has-submenu');
        const mobileSubmenu = document.querySelector('.mobile-submenu');
        const megaMenuContainer = document.querySelector('.mega-menu-container');

        if (!mobileCategoryToggle || !mobileSubmenu || !megaMenuContainer) return;
        
        mobileSubmenu.innerHTML = megaMenuContainer.innerHTML;
        const mainItems = mobileSubmenu.querySelectorAll('.main-category-item');
        const subPanelContainer = mobileSubmenu.querySelector('.subcategories-panel');
        
        mainItems.forEach(item => {
            const categoryId = item.dataset.category;
            const subPanel = subPanelContainer.querySelector(`.subcategory-content#${categoryId}`);
            if (subPanel) {
                item.after(subPanel);
            }
        });
        
        if(subPanelContainer) subPanelContainer.remove();

        mobileCategoryToggle.addEventListener('click', (e) => {
            e.preventDefault();
            mobileCategoryToggle.classList.toggle('active');
            mobileSubmenu.classList.toggle('active');
        });
        
        const mobileMainCategories = mobileSubmenu.querySelectorAll('.main-category-item');
        mobileMainCategories.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const subPanel = item.nextElementSibling;
                const wasActive = item.classList.contains('active');
                
                mobileMainCategories.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    if (otherItem.nextElementSibling && otherItem.nextElementSibling.classList.contains('subcategory-content')) {
                        otherItem.nextElementSibling.classList.remove('active');
                    }
                });

                if (!wasActive) {
                    item.classList.add('active');
                    if (subPanel && subPanel.classList.contains('subcategory-content')) {
                        subPanel.classList.add('active');
                    }
                }
            });
        });
    }

    toggleMobileMenu() {
        this.mobileToggle.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        document.body.style.overflow = this.mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.mobileToggle.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeDropdown() {
        if (this.dropdown) {
            this.dropdown.classList.remove('active');
        }
    }
}