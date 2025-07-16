import { useEffect, useRef, useState } from "react";
import { Box, Flex, Text, Button, HStack, VStack, IconButton, Checkbox } from "@chakra-ui/react";
import { ExternalLinkIcon, CloseIcon } from "@chakra-ui/icons";
import * as THREE from "three";
import Planet from "./Planet";

class OrbitControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.target = new THREE.Vector3();
    this.enableDamping = true;
    this.enablePan = false;
    this.dampingFactor = 0.05;
    
    this.spherical = new THREE.Spherical();
    this.sphericalDelta = new THREE.Spherical();
    this.scale = 1;
    
    this.rotateStart = new THREE.Vector2();
    this.rotateEnd = new THREE.Vector2();
    this.rotateDelta = new THREE.Vector2();
    
    this.isMouseDown = false;
    
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onWheel = this.onWheel.bind(this);
    
    this.domElement.addEventListener('mousedown', this.onMouseDown);
    this.domElement.addEventListener('wheel', this.onWheel);
  }
  
  onMouseDown(event) {
    this.isMouseDown = true;
    this.rotateStart.set(event.clientX, event.clientY);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }
  
  onMouseMove(event) {
    if (!this.isMouseDown) return;
    
    this.rotateEnd.set(event.clientX, event.clientY);
    this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);
    
    this.sphericalDelta.theta -= 2 * Math.PI * this.rotateDelta.x / this.domElement.clientHeight;
    this.sphericalDelta.phi -= 2 * Math.PI * this.rotateDelta.y / this.domElement.clientHeight;
    
    this.rotateStart.copy(this.rotateEnd);
  }
  
  onMouseUp() {
    this.isMouseDown = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
  
  onWheel(event) {
    if (event.deltaY < 0) {
      this.scale *= 0.95;
    } else {
      this.scale *= 1.05;
    }
  }
  
  update() {
    const offset = new THREE.Vector3();
    offset.copy(this.camera.position).sub(this.target);
    
    this.spherical.setFromVector3(offset);
    this.spherical.theta += this.sphericalDelta.theta;
    this.spherical.phi += this.sphericalDelta.phi;
    this.spherical.radius *= this.scale;
    
    this.spherical.makeSafe();
    
    offset.setFromSpherical(this.spherical);
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
    
    if (this.enableDamping) {
      this.sphericalDelta.theta *= (1 - this.dampingFactor);
      this.sphericalDelta.phi *= (1 - this.dampingFactor);
      this.scale = 1 + (this.scale - 1) * (1 - this.dampingFactor);
    } else {
      this.sphericalDelta.set(0, 0, 0);
      this.scale = 1;
    }
  }
}
// FUTURE MIGRATION NOTE: For future enhancements Ive considered using react-three-fiber (https://docs.pmnd.rs/react-three-fiber Read More about later) to manage the 3D scene as a React component. 7/15/2025
// This would allow for more declarative scene construction, easier integration of UI state (e.g., solo planet views, moons, overlays), and better React lifecycle management.
// Current implementation uses imperative Three.js, but migration to react-three-fiber would make features like dynamic planet focus, adding moons, or interactive overlays more idiomatic and maintainable in React.

export default function SolarSystemView() {
  const mountRef = useRef(null);
  const [focusedPlanet, setFocusedPlanet] = useState(null);
  const focusedPlanetRef = useRef(focusedPlanet);
  const desiredRadiusRef = useRef(80); // Default camera distance 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // Earth days per second
  const speedRef = useRef(simulationSpeed);
  const [showOrbitLines, setShowOrbitLines] = useState(true); // New state for orbit lines visibility
  const orbitLinesRef = useRef([]); // Ref to store orbit line references

  // Enhanced orbit data with realistic parameters - increased distances
  const planetOrbitData = {
    Mercury: { 
      a: 8, b: 7.8, period: 88, inclination: 7, 
      radius: 0.7, texture: 'textures/mercury.jpg' 
    },
    Venus: { 
      a: 12, b: 11.9, period: 225, inclination: 3.4, 
      radius: 1, texture: 'textures/venus.jpg' 
    },
    Earth: { 
      a: 16, b: 15.98, period: 365, inclination: 0, 
      radius: 1.2, texture: 'textures/earth.jpg' 
    },
    Mars: { 
      a: 20, b: 19.8, period: 687, inclination: 1.85, 
      radius: 1, texture: 'textures/mars.jpg' 
    },
    Jupiter: { 
      a: 28, b: 27.9, period: 4333, inclination: 1.3, 
      radius: 2, texture: 'textures/jupiter.jpg' 
    },
    Saturn: { 
      a: 38, b: 37.8, period: 10759, inclination: 2.5, 
      radius: 1.8, texture: 'textures/saturn.jpg', hasRings: true, ringType: 'saturn'
    },
    Uranus: { 
      a: 48, b: 47.8, period: 30687, inclination: 0.8, 
      radius: 1.4, texture: 'textures/uranus.jpg', hasRings: true, ringType: 'uranus'
    },
    Neptune: { 
      a: 58, b: 57.8, period: 60190, inclination: 1.8, 
      radius: 1.3, texture: 'textures/neptune.jpg', hasRings: true, ringType: 'neptune'
    },
    Pluto: { 
      a: 68, b: 67.5, period: 90520, inclination: 17.2, 
      radius: 0.5, texture: 'textures/pluto.jpg' 
    },
  };

  // Keep the refs in sync with the state
  useEffect(() => {
    focusedPlanetRef.current = focusedPlanet;
    speedRef.current = simulationSpeed;
    // Set desired camera radius based on focused planet
    if (focusedPlanet) {
      const orbit = planetOrbitData[focusedPlanet]?.a || 20;
      desiredRadiusRef.current = orbit + 5; // Increased buffer for better viewing
    } else {
      // Default zoomed-out view
      desiredRadiusRef.current = 80;
    }
  }, [focusedPlanet, simulationSpeed]);

  // Prevent page scrolling when interacting with 3D model Essential
  useEffect(() => {
    const handleWheel = (e) => {
      if (mountRef.current && mountRef.current.contains(e.target)) {
        e.preventDefault();
      }
    };

    const handleMouseDown = (e) => {
      if (mountRef.current && mountRef.current.contains(e.target)) {
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('mousedown', handleMouseDown, { passive: false });

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mountRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Orbit lines toggle - much more efficient
  const toggleOrbitLines = () => {
    const newVisibility = !showOrbitLines;
    setShowOrbitLines(newVisibility);
    
    // Directly control visibility without re-rendering scene
    orbitLinesRef.current.forEach(line => {
      line.material.visible = newVisibility;
    });
  };

  // Planet data for the selector
  const planetData = {
    Mercury: { texture: 'textures/mercury.jpg', symbol: '' },
    Venus: { texture: 'textures/venus.jpg', symbol: '' },
    Earth: { texture: 'textures/earth.jpg', symbol: '' },
    Mars: { texture: 'textures/mars.jpg', symbol: '' },
    Jupiter: { texture: 'textures/jupiter.jpg', symbol: '' },
    Saturn: { texture: 'textures/saturn.jpg', symbol: '' },
    Uranus: { texture: 'textures/uranus.jpg', symbol: '' },
    Neptune: { texture: 'textures/neptune.jpg', symbol: '' },
    Pluto: { texture: 'textures/pluto.jpg', symbol: '' },
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();

    // Create simple starfield background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 1 });
    
    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 10, 40);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000011);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;

    // Main sun light 
    const pointLight = new THREE.PointLight(0xffffff, 35, 1000);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;

    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    scene.add(pointLight);

    // Ambient light for overall illumination
    const ambient = new THREE.AmbientLight(0x404040, 1.2);
    scene.add(ambient);

    // Additional directional light for better planet visibility
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);

    const sunGeometry = new THREE.SphereGeometry(4, 64, 64);
    const sunTexture = new THREE.TextureLoader().load("/textures/sun.jpg");
    const sunMaterial = new THREE.MeshPhongMaterial({ map: sunTexture,
      emissive: new THREE.Color(0xffaa00),
      emissiveMap: sunTexture,
      emissiveIntensity: 2,
      shininess: 10
     });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.castShadow = false;
    sunMesh.receiveShadow = false;
    scene.add(sunMesh);
     

    const solarSystem = new THREE.Group();
    const planetObjects = {};
    const orbitLines = []; // Array to store orbit line references
    orbitLinesRef.current = orbitLines; // Store reference for external access

    // Enhanced ellipse creation with inclination
    const createOrbitEllipse = (a, b, inclination) => {
      const curve = new THREE.EllipseCurve(0, 0, a, b, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(100);
      const geometry = new THREE.BufferGeometry().setFromPoints(
        points.map(p => {
          const x = p.x;
          const z = p.y;
          const y = Math.sin(inclination * Math.PI / 180) * z;
          return new THREE.Vector3(x, y, z);
        })
      );
      const material = new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 });
      return new THREE.Line(geometry, material);
    };

    // Create procedural ring textures
    const createRingTexture = (type, innerRadius, outerRadius) => {
      const canvas = document.createElement('canvas');
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, size, size);
      
      const center = size / 2;
      const maxRadius = size / 2 - 10;
      
      // Scale radii to canvas
      const scale = maxRadius / outerRadius;
      const scaledInner = innerRadius * scale;
      const scaledOuter = outerRadius * scale;
      
      switch (type) {
        case 'saturn':
          // Saturn's rings with Cassini Division
          const gradient1 = ctx.createRadialGradient(center, center, scaledInner, center, center, scaledOuter);
          gradient1.addColorStop(0, 'rgba(212, 175, 55, 0.8)'); // Golden
          gradient1.addColorStop(0.3, 'rgba(212, 175, 55, 0.9)');
          gradient1.addColorStop(0.45, 'rgba(212, 175, 55, 0.3)'); // Cassini Division
          gradient1.addColorStop(0.55, 'rgba(212, 175, 55, 0.3)'); // Cassini Division
          gradient1.addColorStop(0.7, 'rgba(212, 175, 55, 0.9)');
          gradient1.addColorStop(1, 'rgba(212, 175, 55, 0.6)');
          
          ctx.fillStyle = gradient1;
          ctx.beginPath();
          ctx.arc(center, center, scaledOuter, 0, 2 * Math.PI);
          ctx.arc(center, center, scaledInner, 0, 2 * Math.PI, true);
          ctx.fill();
          
          // Add some noise/irregularities
          for (let i = 0; i < 50; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const radius = scaledInner + Math.random() * (scaledOuter - scaledInner);
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            const opacity = Math.random() * 0.3;
            
            ctx.fillStyle = `rgba(212, 175, 55, ${opacity})`;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 3 + 1, 0, 2 * Math.PI);
            ctx.fill();
          }
          break;
          
        case 'uranus':
          // Uranus's dark, subtle rings
          const gradient2 = ctx.createRadialGradient(center, center, scaledInner, center, center, scaledOuter);
          gradient2.addColorStop(0, 'rgba(74, 74, 74, 0.6)');
          gradient2.addColorStop(0.5, 'rgba(74, 74, 74, 0.4)');
          gradient2.addColorStop(1, 'rgba(74, 74, 74, 0.2)');
          
          ctx.fillStyle = gradient2;
          ctx.beginPath();
          ctx.arc(center, center, scaledOuter, 0, 2 * Math.PI);
          ctx.arc(center, center, scaledInner, 0, 2 * Math.PI, true);
          ctx.fill();
          
          // Add subtle variations
          for (let i = 0; i < 30; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const radius = scaledInner + Math.random() * (scaledOuter - scaledInner);
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            const opacity = Math.random() * 0.2;
            
            ctx.fillStyle = `rgba(74, 74, 74, ${opacity})`;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 2 + 1, 0, 2 * Math.PI);
            ctx.fill();
          }
          break;
          
        case 'neptune':
          // Neptune's faint, clumpy rings
          const gradient3 = ctx.createRadialGradient(center, center, scaledInner, center, center, scaledOuter);
          gradient3.addColorStop(0, 'rgba(102, 102, 102, 0.5)');
          gradient3.addColorStop(0.7, 'rgba(102, 102, 102, 0.3)');
          gradient3.addColorStop(1, 'rgba(102, 102, 102, 0.1)');
          
          ctx.fillStyle = gradient3;
          ctx.beginPath();
          ctx.arc(center, center, scaledOuter, 0, 2 * Math.PI);
          ctx.arc(center, center, scaledInner, 0, 2 * Math.PI, true);
          ctx.fill();
          
          // Add clumpy structures (arcs)
          for (let i = 0; i < 20; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const radius = scaledInner + Math.random() * (scaledOuter - scaledInner);
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            const opacity = Math.random() * 0.4 + 0.2;
            
            ctx.fillStyle = `rgba(102, 102, 102, ${opacity})`;
            ctx.beginPath();
            ctx.arc(x, y, Math.random() * 4 + 2, 0, 2 * Math.PI);
            ctx.fill();
          }
          break;
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    };

    const createPlanetSystem = (planetName) => {
      const data = planetOrbitData[planetName];
      const group = new THREE.Group();
      const mesh = new Planet(data.radius, 0, data.texture).getMesh();
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      
      // Add planet rings
      if (data.hasRings) {
        let ringGeometry, ringMaterial;
        
        switch (data.ringType) {
          case 'saturn':
            // Saturn's prominent golden rings with Cassini Division
            ringGeometry = new THREE.RingGeometry(data.radius * 1.8, data.radius * 3.0, 64);
            const saturnRingTexture = createRingTexture('saturn', data.radius * 1.8, data.radius * 3.0);
            ringMaterial = new THREE.MeshStandardMaterial({ 
              map: saturnRingTexture,
              transparent: true, 
              opacity: 0.9,
              side: THREE.DoubleSide,
              depthWrite: false
            });
            break;
            
          case 'uranus':
            //  dark, subtle rings
            ringGeometry = new THREE.RingGeometry(data.radius * 1.5, data.radius * 2.2, 32);
            const uranusRingTexture = createRingTexture('uranus', data.radius * 1.5, data.radius * 2.2);
            ringMaterial = new THREE.MeshStandardMaterial({ 
              map: uranusRingTexture,
              transparent: true, 
              opacity: 0.7,
              side: THREE.DoubleSide,
              depthWrite: false
            });
            break;
            
          case 'neptune':
            // Neptune's faint, clumpy rings
            ringGeometry = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.0, 24);
            const neptuneRingTexture = createRingTexture('neptune', data.radius * 1.4, data.radius * 2.0);
            ringMaterial = new THREE.MeshStandardMaterial({ 
              map: neptuneRingTexture,
              transparent: true, 
              opacity: 0.6,
              side: THREE.DoubleSide,
              depthWrite: false
            });
            break;
            
          default:
            // Default ring style
            ringGeometry = new THREE.RingGeometry(data.radius * 1.4, data.radius * 2.0, 48);
            ringMaterial = new THREE.MeshBasicMaterial({ 
              color: 0x666666, 
              transparent: true, 
              opacity: 0.4,
              side: THREE.DoubleSide,
              depthWrite: false
            });
        }
        
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2; // Rotate to be horizontal
        rings.position.y = 0; // Ensure rings are centered on the planet
        rings.renderOrder = 1; // Ensure rings render after the planet
        group.add(rings);
        
        // Debug: Log that rings were created
        console.log(`Created rings for ${planetName}:`, {
          type: data.ringType,
          innerRadius: data.radius * 1.4,
          outerRadius: data.radius * 2.0
        });
      }
      
      // Create inclined orbit ellipse and store reference
      const orbitLine = createOrbitEllipse(data.a, data.b, data.inclination);
      orbitLines.push(orbitLine);
      scene.add(orbitLine); // Always add to scene, visibility controlled by material
      
      planetObjects[planetName] = { 
        mesh, 
        group, 
        ...data,
        angle: 0,
        startTime: Math.random() * 2 * Math.PI // Random starting position
      };
      return { group, mesh };
    };

    // Create asteroid belt
    const createAsteroidBelt = () => {
      const asteroidGroup = new THREE.Group();
      const asteroidCount = 200;
      
      for (let i = 0; i < asteroidCount; i++) {
        const asteroidGeometry = new THREE.SphereGeometry(0.02 + Math.random() * 0.03, 8, 8);
        const asteroidMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x8B7355,
          transparent: true,
          opacity: 0.7
        });
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        
        // Position asteroids in a belt between Mars and Jupiter (updated distances)
        const angle = Math.random() * 2 * Math.PI;
        const radius = 24 + Math.random() * 2; // Between 24-26 units (between Mars at 20 and Jupiter at 28)
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 0.5; //  vertical variations
        
        asteroid.position.set(x, y, z);
        asteroidGroup.add(asteroid);
      }
      
      scene.add(asteroidGroup);
    };

    // Create planets using the enhanced data
    const planets = Object.keys(planetOrbitData).map(name => 
      createPlanetSystem(name)
    );

    planets.forEach(p => solarSystem.add(p.group));
    scene.add(solarSystem);
    
    // Add asteroid belt
    createAsteroidBelt();

    // Animation loop with enhanced orbital mechanics
    let startTime = Date.now();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = (Date.now() - startTime) * 0.001; // Convert to seconds
      
      sunMesh.rotation.y += 0.002;

      Object.keys(planetObjects).forEach(name => {
        const planet = planetObjects[name];
        // Calculate orbital position based on time, period, and speed
        const t = ((elapsedTime * speedRef.current) / (planet.period * 0.1)) + planet.startTime; // Scale period for visual speed
        const x = Math.cos(t) * planet.a;
        const z = Math.sin(t) * planet.b;
        const y = Math.sin(planet.inclination * Math.PI / 180) * z;
        
        // Move the entire group (planet + rings) to the orbital position
        planet.group.position.set(x, y, z);
        planet.mesh.rotation.y += 0.02;
      });

      // Use the ref for focus
      if (focusedPlanetRef.current && planetObjects[focusedPlanetRef.current]) {
        const target = planetObjects[focusedPlanetRef.current].group; // Target the group instead of mesh
        controls.target.lerp(target.position, 0.05);
        // Smoothly interpolate camera radius
        controls.spherical.radius += (desiredRadiusRef.current - controls.spherical.radius) * 0.08;
      } else {
        // Smoothly interpolate camera radius to default
        controls.spherical.radius += (desiredRadiusRef.current - controls.spherical.radius) * 0.08;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (renderer.domElement && mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []); // Only run once on mount

  return (
    <VStack spacing={6} w="100%" h="100vh" maxW="100vw" overflowX="hidden">
      {/* 3D Solar System Viewer */}
      <Box
        ref={mountRef}
        w="100%"
        h={{ base: "50vh", md: "70vh" }}
        minH="350px"
        bg="gray.900"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="2xl"
        border="1px solid"
        borderColor="whiteAlpha.200"
        position="relative"
      >
        <IconButton
          position="absolute"
          top={2}
          right={2}
          zIndex={10}
          aria-label="Toggle fullscreen"
          icon={isFullscreen ? <CloseIcon /> : <ExternalLinkIcon />}
          onClick={toggleFullscreen}
          colorScheme="blue"
          size="sm"
          variant="solid"
          opacity={0.8}
          _hover={{ opacity: 1 }}
        />
        
        {/* Orbit Lines Toggle Checkbox */}
        <Box
          position="absolute"
          top={2}
          left={2}
          zIndex={10}
          bg="rgba(0, 0, 0, 0.7)"
          borderRadius="md"
          p={2}
          backdropFilter="blur(5px)"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <Checkbox
            isChecked={showOrbitLines}
            onChange={toggleOrbitLines}
            colorScheme="green"
            size="sm"
          >
            <Text fontSize="xs" color="white" fontWeight="medium">
              Orbits
            </Text>
          </Checkbox>
        </Box>
      </Box>

      {/* Speed Controls */}
      <Box
        w="100%"
        maxW="600px"
        mx="auto"
        bg="linear-gradient(135deg, rgba(26, 32, 44, 0.95), rgba(45, 55, 72, 0.95))"
        backdropFilter="blur(10px)"
        borderRadius="xl"
        p={4}
        border="1px solid"
        borderColor="whiteAlpha.200"
        boxShadow="xl"
      >
        <VStack spacing={4}>
          <Text
            fontSize="lg"
            fontWeight="bold"
            textAlign="center"
            bgGradient="linear(45deg, blue.400, purple.400)"
            bgClip="text"
          >
            Simulation Speed: {simulationSpeed.toFixed(1)} Earth Days/Second
          </Text>
          
          <HStack spacing={4} justify="center" flexWrap="wrap">
            <Button
              size="sm"
              onClick={() => setSimulationSpeed(0.1)}
              colorScheme="blue"
              variant={simulationSpeed === 0.1 ? "solid" : "outline"}
            >
              0.1x
            </Button>
            <Button
              size="sm"
              onClick={() => setSimulationSpeed(0.5)}
              colorScheme="blue"
              variant={simulationSpeed === 0.5 ? "solid" : "outline"}
            >
              0.5x
            </Button>
            <Button
              size="sm"
              onClick={() => setSimulationSpeed(1)}
              colorScheme="blue"
              variant={simulationSpeed === 1 ? "solid" : "outline"}
            >
              1x
            </Button>
            <Button
              size="sm"
              onClick={() => setSimulationSpeed(5)}
              colorScheme="blue"
              variant={simulationSpeed === 5 ? "solid" : "outline"}
            >
              5x
            </Button>
            <Button
              size="sm"
              onClick={() => setSimulationSpeed(10)}
              colorScheme="blue"
              variant={simulationSpeed === 10 ? "solid" : "outline"}
            >
              10x
            </Button>
            <Button
              size="sm"
              onClick={() => setSimulationSpeed(50)}
              colorScheme="red"
              variant={simulationSpeed === 50 ? "solid" : "outline"}
            >
              50x
            </Button>
          </HStack>
          
          <Text fontSize="sm" color="text.secondary" textAlign="center">
            Use preset speeds or adjust the slider below
          </Text>
          
          <HStack w="100%" spacing={4} align="center">
            <Text fontSize="sm" color="text.secondary" minW="60px">
              0.1x
            </Text>
            <Box flex={1}>
              <input
                type="range"
                min="0.1"
                max="100"
                step="0.1"
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: 'linear-gradient(90deg, #3182ce 0%, #805ad5 100%)',
                  outline: 'none',
                  opacity: 0.8,
                  cursor: 'pointer'
                }}
              />
            </Box>
            <Text fontSize="sm" color="text.secondary" minW="60px">
              100x
            </Text>
          </HStack>
        </VStack>
      </Box>



      {/* Planet Selector Section */}
      <Box
        w="100%"
        maxW="900px"
        mx="auto"
        bg="linear-gradient(135deg, rgba(26, 32, 44, 0.95), rgba(45, 55, 72, 0.95))"
        backdropFilter="blur(10px)"
        borderRadius="xl"
        p={{ base: 3, md: 6 }}
        border="1px solid"
        borderColor="whiteAlpha.200"
        boxShadow="xl"
      >
        <Text
          fontSize={{ base: "lg", md: "2xl" }}
          fontWeight="bold"
          textAlign="center"
          mb={6}
          bgGradient="linear(45deg, blue.400, purple.400)"
          bgClip="text"
        >
          Select Planet to Focus
        </Text>
        
        <Flex
          justify="center"
          gap={4}
          flexWrap="wrap"
          maxW="800px"
          mx="auto"
          mb={6}
        >
          {Object.entries(planetData).map(([name, data]) => (
            <Box
              key={name}
              onClick={() => setFocusedPlanet(name)}
              bg={focusedPlanet === name 
                ? "whiteAlpha.200" 
                : "whiteAlpha.50"}
              border="2px solid"
              borderColor={focusedPlanet === name 
                ? "blue.400" 
                : "whiteAlpha.100"}
              borderRadius="xl"
              p={4}
              cursor="pointer"
              transition="all 0.3s ease"
              transform={focusedPlanet === name ? "scale(1.05)" : "scale(1)"}
              backdropFilter="blur(5px)"
              minW="100px"
              textAlign="center"
              _hover={{
                bg: focusedPlanet !== name ? "whiteAlpha.100" : undefined,
                transform: focusedPlanet !== name ? "scale(1.02)" : "scale(1.05)",
              }}
            >
              {/* Planet visual */}
              <Box
                w="40px"
                h="40px"
                borderRadius="50%"
                backgroundImage={`url(${data.texture})`}
                backgroundSize="cover"
                backgroundPosition = "center"
                boxShadow="0 4px 10px rgba(0, 0, 0, 0.4)"
                border="2px solid"
                borderColor="whiteAlpha.300"
                filter = "brightness(1.1) contrast(1.2)"
                mx = "auto"
                mb={3}
              />
              
              {/* Planet name */}
              <Text
                color="white"
                fontSize="sm"
                fontWeight="600"
                mb={2}
              >
                {name}
              </Text>
              
              {/* Planet symbol */}
              <Text fontSize="lg" mb={2} color="whiteAlpha.800">
                {data.symbol}
              </Text>
              
              {/* Focus indicator */}
              {focusedPlanet === name && (
                <Text
                  fontSize="xs"
                  color="blue.400"
                  fontWeight="bold"
                >
                   FOCUSED
                </Text>
              )}
            </Box>
          ))}
        </Flex>
        
        {/* Reset button */}
        <Flex justify="center">
          <Button
            onClick={() => setFocusedPlanet(null)}
            bgGradient="linear(45deg, red.400, orange.400)"
            color="white"
            fontWeight="bold"
            borderRadius="full"
            px={6}
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "0 5px 15px rgba(255,107,107,0.4)",
            }}
            transition="all 0.3s ease"
          >
             View All Planets
          </Button>
        </Flex>
      </Box>
    </VStack>
  );
}