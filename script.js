// Three.js Scene Setup
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;

// Initialize Three.js
function initThree() {
    const canvas = document.getElementById('three-canvas');
    
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Create floating particles
    createParticles();
    
    // Create floating flowers
    createFloatingFlowers();
    
    // Animation loop
    animate();
}

// Create particle system
function createParticles() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
        
        // Pink/Rose colors
        colors[i] = 0.9 + Math.random() * 0.1;     // R
        colors[i + 1] = 0.1 + Math.random() * 0.3; // G
        colors[i + 2] = 0.4 + Math.random() * 0.4; // B
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Create floating flower shapes
function createFloatingFlowers() {
    const flowerCount = 15;
    
    for (let i = 0; i < flowerCount; i++) {
        const flower = createFlower();
        flower.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 10
        );
        flower.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        scene.add(flower);
    }
}

// Create individual flower
function createFlower() {
    const group = new THREE.Group();
    
    // Flower petals
    const petalGeometry = new THREE.SphereGeometry(0.1, 8, 6);
    const petalMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.9 + Math.random() * 0.1, 0.7, 0.7),
        transparent: true,
        opacity: 0.7
    });
    
    for (let i = 0; i < 6; i++) {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        const angle = (i / 6) * Math.PI * 2;
        petal.position.set(Math.cos(angle) * 0.2, Math.sin(angle) * 0.2, 0);
        petal.scale.set(1, 2, 0.5);
        group.add(petal);
    }
    
    // Flower center
    const centerGeometry = new THREE.SphereGeometry(0.05, 8, 6);
    const centerMaterial = new THREE.MeshBasicMaterial({
        color: 0xffeb3b,
        transparent: true,
        opacity: 0.8
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    group.add(center);
    
    return group;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    if (particles) {
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;
    }
    
    // Animate flowers
    scene.children.forEach((child, index) => {
        if (child.type === 'Group') {
            child.rotation.x += 0.01;
            child.rotation.y += 0.01;
            child.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
        }
    });
    
    // Mouse interaction
    camera.position.x += (mouseX * 0.001 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.001 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Handle window resize
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mouse movement handler
function handleMouseMove(event) {
    mouseX = event.clientX - window.innerWidth / 2;
    mouseY = event.clientY - window.innerHeight / 2;
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add fade-in class to elements
    document.querySelectorAll('.flower-card, .feature, .contact-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Shopping cart functionality
function initCart() {
    let cartItems = [];
    const cartCount = document.querySelector('.cart-count');
    
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.flower-card');
            const title = card.querySelector('.card-title').textContent;
            const price = card.querySelector('.current-price').textContent;
            
            // Add item to cart
            cartItems.push({ title, price });
            
            // Update cart count
            cartCount.textContent = cartItems.length;
            
            // Add animation
            this.style.transform = 'scale(0.95)';
            this.textContent = 'Added!';
            this.style.background = '#4caf50';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.textContent = 'Add to Cart';
                this.style.background = '';
            }, 1000);
            
            // Show notification
            showNotification(`${title} added to cart!`);
        });
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #e91e63, #f06292);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(233, 30, 99, 0.3);
        z-index: 1001;
        transform: translateX(300px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Contact form handling
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            submitBtn.style.background = '#4caf50';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                form.reset();
            }, 2000);
            
            showNotification('Thank you! Your message has been sent.');
        }, 1500);
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Flower card hover effects
function initFlowerCardEffects() {
    document.querySelectorAll('.flower-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateY(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateY(0)';
        });
    });
}

// Loading screen
function initLoadingScreen() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loading);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loading.classList.add('hidden');
            setTimeout(() => {
                document.body.removeChild(loading);
            }, 500);
        }, 1000);
    });
}

// Parallax effect for hero section
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize Three.js scene
    initThree();
    
    // Initialize other features
    initSmoothScrolling();
    initScrollAnimations();
    initNavbarScroll();
    initCart();
    initContactForm();
    initMobileMenu();
    initFlowerCardEffects();
    initParallax();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Add some extra interactive elements
    addFloatingElements();
});

// Add floating decorative elements
function addFloatingElements() {
    const floatingElements = ['🌸', '🌺', '🌻', '🌷', '🌹'];
    
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.textContent = floatingElements[i];
        element.style.cssText = `
            position: fixed;
            font-size: 2rem;
            pointer-events: none;
            z-index: -1;
            opacity: 0.1;
            animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        
        document.body.appendChild(element);
    }
}

// Add CSS for mobile menu
const mobileMenuCSS = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            padding-top: 2rem;
            transition: left 0.3s ease;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Add the CSS to the document
const style = document.createElement('style');
style.textContent = mobileMenuCSS;
document.head.appendChild(style);