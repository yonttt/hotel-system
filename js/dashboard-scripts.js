// Eva Group Hotel Management System - Frontend Scripts
// Handles sidebar navigation, module routing, and state management

// ===== CORE FUNCTIONS =====

function toggleSubmenu(menuName) {
    const submenu = document.getElementById(menuName + '-submenu');
    const button = event.target.closest('.nav-group-header');
    const chevron = button.querySelector('.chevron-icon');
    if (!submenu || !button) return;
    submenu.classList.toggle('show');
    chevron.classList.toggle('rotated');
    button.classList.toggle('active');
    const isOpen = submenu.classList.contains('show');
    localStorage.setItem('submenu-' + menuName, isOpen);
}

function restoreSidebarState() {
    allSubmenus.forEach(submenuName => {
        const isOpen = localStorage.getItem('submenu-' + submenuName) === 'true';
        if (isOpen) {
            const submenu = document.getElementById(submenuName + '-submenu');
            const button = document.querySelector(`[onclick="toggleSubmenu('${submenuName}')"]`);
            const chevron = button?.querySelector('.chevron-icon');
            if (submenu && button) {
                submenu.classList.add('show');
                button.classList.add('active');
                if (chevron) {
                    chevron.classList.add('rotated');
                }
            }
        }
    });
}

function clearAllSubmenuStates() {
    allSubmenus.forEach(submenuName => {
        localStorage.removeItem('submenu-' + submenuName);
    });
    allSubmenus.forEach(submenuName => {
        const submenu = document.getElementById(submenuName + '-submenu');
        const button = document.querySelector(`[onclick="toggleSubmenu('${submenuName}')"]`);
        const chevron = button?.querySelector('.chevron-icon');
        if (submenu && button) {
            submenu.classList.remove('show');
            button.classList.remove('active');
            if (chevron) {
                chevron.classList.remove('rotated');
            }
        }
    });
}

function setActiveNavByModule() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    if (currentModule) {
        const activeLink = document.querySelector(`a[href*="module=${currentModule}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    } else {
        const homeButton = document.querySelector('a[href="home.php"]:not([href*="module="])');
        if (homeButton) {
            homeButton.classList.add('active');
        }
    }
}

function setActiveNavItem(clickedElement) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    if (clickedElement.classList.contains('nav-link')) {
        clickedElement.classList.add('active');
    }
}

function resetSidebarAndGoHome() {
    clearAllSubmenuStates();
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const homeButton = document.querySelector('a[href="home.php"]:not([href*="module="])');
    if (homeButton) {
        homeButton.classList.add('active');
    }
    window.location.href = 'home.php';
}

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.style.pointerEvents = 'auto';
        sidebar.style.zIndex = '100';
    }
    restoreSidebarState();
    setActiveNavByModule();
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href.includes('module=') || !this.href.includes('home.php') || this.href === 'home.php') {
                setActiveNavItem(this);
            }
        });
    });
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            clearAllSubmenuStates();
            console.log('All submenu states cleared');
        }
    });
});

function toggleDropdown() {
    const dropdown = document.getElementById('adminDropdown');
    const dropdownContainer = dropdown.parentElement;
    dropdown.classList.toggle('show');
    dropdownContainer.classList.toggle('active');
}

document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('adminDropdown');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    if (!dropdownBtn.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
        dropdown.parentElement.classList.remove('active');
    }
});

window.FastLoaderConfig = {
    duration: 300,
    minDisplay: 50,
    updateInterval: 8,
    fadeOutDuration: 100
};

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.fastLoader) {
                window.fastLoader.show();
            }
        });
    });
});
