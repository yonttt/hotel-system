/**
 * Fast Loading System with Percentage Display
 * Optimized for performance across all pages
 */

class FastLoader {
    constructor(options = {}) {
        // Merge with global config if available
        const globalConfig = window.FastLoaderConfig || {};
        
        this.options = {
            duration: options.duration || globalConfig.duration || 600,
            minDisplay: options.minDisplay || globalConfig.minDisplay || 100,
            updateInterval: options.updateInterval || globalConfig.updateInterval || 16,
            fadeOutDuration: options.fadeOutDuration || globalConfig.fadeOutDuration || 150,
            debug: options.debug || globalConfig.debug || false,
            ...options
        };
        
        this.currentPercentage = 0;
        this.isActive = false;
        this.animationId = null;
        this.startTime = null;
        
        this.init();
    }
    
    updateConfig(newConfig) {
        this.options = { ...this.options, ...newConfig };
    }
    
    init() {
        this.createLoadingElement();
        this.bindEvents();
    }
    
    createLoadingElement() {
        // Check if loading element already exists
        if (document.getElementById('loading-screen')) {
            this.loadingScreen = document.getElementById('loading-screen');
            this.percentageElement = this.loadingScreen.querySelector('.loading-percentage');
            return;
        }
        
        // Create loading screen HTML
        const loadingHTML = `
            <div id="loading-screen" class="loading-overlay">
                <div class="loading-content">
                    <div class="spinner-container">
                        <div class="fast-spinner"></div>
                        <div class="loading-percentage">0%</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
        this.loadingScreen = document.getElementById('loading-screen');
        this.percentageElement = this.loadingScreen.querySelector('.loading-percentage');
    }
    
    show() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.currentPercentage = 0;
        this.startTime = performance.now();
        
        // Reset and show loading screen
        this.loadingScreen.classList.add('show');
        this.loadingScreen.classList.remove('fade-out');
        this.percentageElement.textContent = '0%';
        
        // Start animation using requestAnimationFrame for better performance
        this.animate();
    }
    
    animate() {
        if (!this.isActive) return;
        
        const currentTime = performance.now();
        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.options.duration, 1);
        
        // Use easing function for smooth animation
        const easedProgress = this.easeOutCubic(progress);
        this.currentPercentage = Math.floor(easedProgress * 100);
        
        this.percentageElement.textContent = this.currentPercentage + '%';
        
        if (progress < 1) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.complete();
        }
    }
    
    complete() {
        this.currentPercentage = 100;
        this.percentageElement.textContent = '100%';
        
        // Ensure minimum display time
        const totalElapsed = performance.now() - this.startTime;
        const remainingTime = Math.max(0, this.options.minDisplay - totalElapsed);
        
        setTimeout(() => this.hide(), remainingTime);
    }
    
    hide() {
        if (!this.isActive) return;
        
        this.isActive = false;
        this.loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            this.loadingScreen.classList.remove('show');
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
        }, this.options.fadeOutDuration);
    }
    
    // Easing function for smooth animation
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    bindEvents() {
        // Auto-start on page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.show();
            });
        } else {
            this.show();
        }
        
        // Handle form submissions
        document.addEventListener('submit', (e) => {
            this.show();
        });
        
        // Handle logout links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href*="logout"]') || 
                e.target.closest('a[href*="logout"]')) {
                this.show();
            }
        });
        
        // Handle navigation links (optional)
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && !link.href.startsWith('#') && 
                !link.href.startsWith('javascript:') &&
                !link.target === '_blank') {
                // Only show loader for internal navigation
                if (link.hostname === window.location.hostname) {
                    this.show();
                }
            }
        });
        
        // Page visibility API for better performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isActive) {
                this.hide();
            }
        });
    }
}

// Auto-initialize when script loads
let fastLoaderInstance;

function initializeFastLoader() {
    if (!fastLoaderInstance) {
        fastLoaderInstance = new FastLoader();
        window.fastLoader = fastLoaderInstance;
    }
    return fastLoaderInstance;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFastLoader);
} else {
    initializeFastLoader();
}

// Export for manual control if needed
window.FastLoader = FastLoader;

// Ensure global access
if (!window.fastLoader) {
    window.fastLoader = initializeFastLoader();
}
