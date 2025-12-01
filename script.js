// Page Navigation
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetPage = link.getAttribute('data-page');
        
        // Update active nav link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
        
        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));
        
        // Show target page
        document.getElementById(targetPage).classList.add('active');
        
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Typing Animation - FIXED (Only ONE title)
const typingText = document.querySelector('.typing-text');
const cursor = document.querySelector('.cursor');
const texts = [
    "Mariem Aithssine",
    "Computer Science Student",
    "Web Developer",
    "Problem Solver",
    "Tech Enthusiast"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const currentText = texts[textIndex];
    
    if (!isDeleting && charIndex < currentText.length) {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeWriter, 100);
    } else if (isDeleting && charIndex > 0) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeWriter, 50);
    } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
            textIndex = (textIndex + 1) % texts.length;
        }
        setTimeout(typeWriter, 1500);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Start typing animation
    setTimeout(typeWriter, 1000);
    
    // Animate skill bars
    const skillProgresses = document.querySelectorAll('.skill-progress');
    skillProgresses.forEach(progress => {
        const width = progress.getAttribute('data-width');
        setTimeout(() => {
            progress.style.width = width + '%';
        }, 500);
    });
    
    // Make contact buttons clickable
    document.querySelectorAll('a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            document.querySelector(`.nav-link[data-page="${targetPage}"]`).classList.add('active');
            
            // Hide all pages
            pages.forEach(page => page.classList.remove('active'));
            
            // Show target page
            document.getElementById(targetPage).classList.add('active');
            
            // Scroll to top of page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // Add copy functionality to contact items
    document.querySelectorAll('.contact-item[data-copy]').forEach(item => {
        item.addEventListener('click', function() {
            const text = this.getAttribute('data-copy');
            const type = this.getAttribute('data-type');
            copyToClipboard(text, type);
            
            // Add visual feedback
            this.style.transform = 'translateX(8px) scale(1.02)';
            this.style.boxShadow = 'var(--shadow-lg)';
            this.style.backgroundColor = 'var(--gradient-light)';
            
            setTimeout(() => {
                this.style.transform = '';
                this.style.boxShadow = '';
                this.style.backgroundColor = '';
            }, 300);
        });
    });
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Add fallback for image if not found
    setupImageFallback();
});

// Back to Top Button
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Copy to Clipboard Function
function copyToClipboard(text, type) {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    
    // Select and copy the text
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification(`${type} copied to clipboard!`);
        } else {
            showNotification('Failed to copy. Please try again.', true);
        }
    } catch (err) {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy. Please try again.', true);
    }
    
    // Clean up
    document.body.removeChild(textarea);
    
    // Try using modern Clipboard API as fallback
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Clipboard API failed: ', err);
        });
    }
}

// Show notification
function showNotification(message, isError = false) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.copy-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'copy-notification';
    
    if (isError) {
        notification.style.background = '#FF6B6B';
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Setup image fallback
function setupImageFallback() {
    const profileImg = document.querySelector('.profile-img');
    
    if (profileImg) {
        profileImg.addEventListener('error', function() {
            console.log('Image not found, using fallback');
            this.onerror = null; // Prevent infinite loop
            this.src = `https://ui-avatars.com/api/?name=Mariem+Aithssine&background=2E8B57&color=fff&size=300&bold=true&font-size=0.5`;
        });
        
        // Check if image loads
        const img = new Image();
        img.onload = function() {
            console.log('Image loaded successfully');
        };
        img.onerror = function() {
            console.log('Image failed to load');
            profileImg.src = `https://ui-avatars.com/api/?name=Mariem+Aithssine&background=2E8B57&color=fff&size=300&bold=true&font-size=0.5`;
        };
        img.src = profileImg.src;
    }
}

// Make functions available globally
window.copyToClipboard = copyToClipboard;

// Add keyboard shortcuts for accessibility
document.addEventListener('keydown', (e) => {
    // Ctrl+C or Cmd+C to copy the currently focused contact info
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const focused = document.activeElement;
        if (focused.classList.contains('contact-item')) {
            const text = focused.getAttribute('data-copy');
            const type = focused.getAttribute('data-type');
            if (text && type) {
                copyToClipboard(text, type);
            }
        }
    }
});