// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Three.js 3D Scene for Hero Section
let scene, camera, renderer, particles, particleSystem;

function initHeroScene() {
    const canvas = document.getElementById('crypto-canvas');
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    canvas.appendChild(renderer.domElement);
    
    // Create particles
    const particleCount = 1000;
    particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        // Positions
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
        
        // Colors
        colors[i] = Math.random() * 0.5 + 0.5; // R
        colors[i + 1] = Math.random() * 0.5 + 0.5; // G
        colors[i + 2] = Math.random() * 0.5 + 0.5; // B
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Add a central glowing sphere
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.3
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00ff88, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        particleSystem.rotation.x += 0.001;
        particleSystem.rotation.y += 0.002;
        
        sphere.rotation.x += 0.005;
        sphere.rotation.y += 0.005;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
}

// Three.js 3D Scene for Investment Section
let investmentScene, investmentCamera, investmentRenderer, cubes = [];

function initInvestmentScene() {
    const canvas = document.getElementById('investment-canvas');
    
    // Scene setup
    investmentScene = new THREE.Scene();
    investmentCamera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    investmentCamera.position.z = 10;
    
    investmentRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    investmentRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    canvas.appendChild(investmentRenderer.domElement);
    
    // Create floating cubes
    const cubeCount = 8;
    const colors = [0x00ff88, 0x0066ff, 0xff00cc, 0xffff00, 0xff6600, 0x9900ff, 0x00ffff, 0xff0066];
    
    for (let i = 0; i < cubeCount; i++) {
        const size = Math.random() * 0.5 + 0.5;
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshStandardMaterial({
            color: colors[i],
            metalness: 0.7,
            roughness: 0.2,
            transparent: true,
            opacity: 0.8
        });
        
        const cube = new THREE.Mesh(geometry, material);
        
        // Position cubes in a circular pattern
        const angle = (i / cubeCount) * Math.PI * 2;
        const radius = 4;
        cube.position.x = Math.cos(angle) * radius;
        cube.position.y = Math.sin(angle) * radius;
        cube.position.z = (Math.random() - 0.5) * 2;
        
        cubes.push({
            mesh: cube,
            angle: angle,
            radius: radius,
            speed: Math.random() * 0.02 + 0.01
        });
        
        investmentScene.add(cube);
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    investmentScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    investmentScene.add(directionalLight);
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        cubes.forEach(cube => {
            cube.angle += cube.speed;
            cube.mesh.position.x = Math.cos(cube.angle) * cube.radius;
            cube.mesh.position.y = Math.sin(cube.angle) * cube.radius;
            cube.mesh.rotation.x += 0.01;
            cube.mesh.rotation.y += 0.01;
        });
        
        investmentRenderer.render(investmentScene, investmentCamera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        investmentCamera.aspect = canvas.clientWidth / canvas.clientHeight;
        investmentCamera.updateProjectionMatrix();
        investmentRenderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
}

// Initialize scenes when page loads
window.addEventListener('load', function() {
    initHeroScene();
    initInvestmentScene();
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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
