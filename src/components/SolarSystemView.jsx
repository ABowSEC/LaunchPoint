import { useEffect, useRef, useState, useCallback } from "react";
import { Box, Flex, Text, Button, HStack, VStack, IconButton, SimpleGrid, Divider } from "@chakra-ui/react";
import { ExternalLinkIcon, CloseIcon } from "@chakra-ui/icons";
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from "three";
import Planet from "./Planet";
import { createRingTexture, createOrbitEllipse } from '../utils/threeHelpers';
import { useAnimationFrame } from '../hooks/useAnimationFrame';
import { useFullscreen } from '../hooks/useFullscreen';
import { useSyncedRef } from '../hooks/useSyncedRef';
import { planetOrbitData, planetData } from '../utils/planetData';
import { createSolarSystemScene, setupResizeHandler } from '../utils/sceneSetup';

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
  const focusedPlanetRef = useSyncedRef(focusedPlanet);
  const desiredRadiusRef = useRef(80); // Default camera distance 
  const [simulationSpeed, setSimulationSpeed] = useState(1); // Earth days per second
  const speedRef = useSyncedRef(simulationSpeed);
  const [showOrbitLines, setShowOrbitLines] = useState(true); // New state for orbit lines visibility
  const orbitLinesRef = useRef([]); // Ref to store orbit line references
  
  // Animation state refs
  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  const sunMeshRef = useRef();
  const planetObjectsRef = useRef();
  const startTimeRef = useRef(Date.now());



  // Set desired camera radius based on focused planet
  useEffect(() => {
    if (focusedPlanet) {
      const orbit = planetOrbitData[focusedPlanet]?.a || 20;
      desiredRadiusRef.current = orbit + 5; // Increased buffer for better viewing
    } else {
      // Default zoomed-out view
      desiredRadiusRef.current = 80;
    }
  }, [focusedPlanet]);

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

  // Use the fullscreen hook
  const { isFullscreen, toggleFullscreen } = useFullscreen(mountRef);

  // Orbit lines toggle - much more efficient
  const toggleOrbitLines = () => {
    const newVisibility = !showOrbitLines;
    setShowOrbitLines(newVisibility);
    
    // Directly control visibility without re-rendering scene
    orbitLinesRef.current.forEach(line => {
      line.material.visible = newVisibility;
    });
  };



  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Create complete solar system scene using utility
    const { scene, camera, renderer, sun: sunMesh } = createSolarSystemScene(width, height, {
      starCount: 5000,
      starSpread: 2000,
      sunRadius: 4,
      sunTexture: "/textures/sun.jpg"
    });

    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    sunMeshRef.current = sunMesh;

    // Add renderer to DOM
    mountRef.current.appendChild(renderer.domElement);

    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controlsRef.current = controls;
     

    const solarSystem = new THREE.Group();
    const planetObjects = {};
    planetObjectsRef.current = planetObjects;
    const orbitLines = []; // Array to store orbit line references
    orbitLinesRef.current = orbitLines; // Store reference for external access

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
        if (data.ringType === 'uranus') {
          rings.rotation.x = 0; // No horizontal tilt
          rings.rotation.z = Math.PI * 98 / 180; // around 1.710 radians, vertical rings (Play around with this value)
        } else {
          rings.rotation.x = Math.PI / 2; // Rotate to be horizontal
        }
        rings.position.y = 0; // Ensure rings are centered on the planet
        rings.renderOrder = 1; // Ensure rings render after the planet
        group.add(rings);
        
        // Debug: Log that rings were created
        // console.log(`Created rings for ${planetName}:`, {
        //   type: data.ringType,
        //   innerRadius: data.radius * 1.4,
        //   outerRadius: data.radius * 2.0
        // });
      }
      
      // Create inclined orbit ellipse and store reference
      const orbitLine = createOrbitEllipse(data.a, data.b, data.inclination);
      orbitLines.push(orbitLine);
      scene.add(orbitLine); //  visibility controlled by material
      
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
        
        // Position asteroids in a belt between Mars and Jupiter 
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

    // Setup resize handler
    const cleanupResize = setupResizeHandler(camera, renderer, mountRef.current);

    return () => {
      if (renderer.domElement && mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      cleanupResize();
      renderer.dispose();
    };
  }, []); // Only run once on mount

  // Animation callback using the custom hook
  const animate = useCallback((deltaTime, time) => {
    if (!sunMeshRef.current || !planetObjectsRef.current || !controlsRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) {
      return;
    }

    const elapsedTime = (time - startTimeRef.current) * 0.001; // Convert to seconds
    
    sunMeshRef.current.rotation.y += 0.002;

    Object.keys(planetObjectsRef.current).forEach(name => {
      const planet = planetObjectsRef.current[name];
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
    if (focusedPlanetRef.current && planetObjectsRef.current[focusedPlanetRef.current]) {
      const target = planetObjectsRef.current[focusedPlanetRef.current].group; // Target the group instead of mesh
      controlsRef.current.target.lerp(target.position, 0.05);
      // Smoothly interpolate camera radius
      controlsRef.current.spherical.radius += (desiredRadiusRef.current - controlsRef.current.spherical.radius) * 0.08;
    } else {
      // Smoothly interpolate camera radius to default
      controlsRef.current.spherical.radius += (desiredRadiusRef.current - controlsRef.current.spherical.radius) * 0.08;
    }

    controlsRef.current.update();
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, []);

  // Use the animation frame hook
  useAnimationFrame(animate);

  return (
    <Box position="relative" w="100%" h="100vh" overflow="hidden" bg="black">

      {/* ── Three.js canvas ──────────────────────────────── */}
      <Box
        ref={mountRef}
        position="absolute"
        top={0} left={0} right={0} bottom={0}
      />

      {/* ── Top HUD bar ──────────────────────────────────── */}
      <Flex
        position="absolute"
        top={0} left={0} right={0}
        align="center"
        justify="space-between"
        px={4}
        h="44px"
        bg="rgba(6, 9, 26, 0.72)"
        backdropFilter="blur(14px)"
        borderBottom="1px solid rgba(255,255,255,0.06)"
        zIndex={10}
      >
        <Text
          fontSize="xs"
          fontWeight="700"
          letterSpacing="widest"
          textTransform="uppercase"
          color="brand.400"
        >
          ⊙ Solar System
        </Text>
        <HStack spacing={1}>
          <Button
            size="xs"
            variant="ghost"
            color={showOrbitLines ? "white" : "whiteAlpha.400"}
            onClick={toggleOrbitLines}
            fontSize="10px"
            fontWeight="600"
            letterSpacing="wider"
            _hover={{ bg: "whiteAlpha.100", color: "white" }}
          >
            ORBITS
          </Button>
          <IconButton
            aria-label="Toggle fullscreen"
            icon={isFullscreen ? <CloseIcon boxSize="10px" /> : <ExternalLinkIcon boxSize="10px" />}
            onClick={toggleFullscreen}
            size="xs"
            variant="ghost"
            color="whiteAlpha.600"
            _hover={{ color: "white", bg: "whiteAlpha.100" }}
          />
        </HStack>
      </Flex>

      {/* ── Planet info card (slide in when focused) ─────── */}
      <AnimatePresence>
        {focusedPlanet && planetData[focusedPlanet]?.facts && (
          <motion.div
            key={focusedPlanet}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "60px",
              left: "16px",
              zIndex: 10,
              width: "220px",
            }}
          >
            <Box
              bg="rgba(6, 9, 26, 0.88)"
              backdropFilter="blur(16px)"
              border="1px solid rgba(255,255,255,0.08)"
              borderRadius="lg"
              p={4}
              color="white"
            >
              <HStack mb={3} spacing={3}>
                <Box
                  w="36px" h="36px"
                  borderRadius="full"
                  backgroundImage={`url(${planetData[focusedPlanet].texture})`}
                  backgroundSize="cover"
                  backgroundPosition="center"
                  border="1px solid rgba(255,255,255,0.18)"
                  flexShrink={0}
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="700" fontSize="sm" lineHeight="1.3">{focusedPlanet}</Text>
                  <Text fontSize="lg" lineHeight="1" color="whiteAlpha.500">
                    {planetData[focusedPlanet].symbol}
                  </Text>
                </VStack>
              </HStack>

              <SimpleGrid columns={2} spacing={2} mb={3}>
                {[
                  ["Diameter",  planetData[focusedPlanet].facts.diameter],
                  ["Distance",  planetData[focusedPlanet].facts.distanceFromSun],
                  ["Orbit",     planetData[focusedPlanet].facts.orbitalPeriod],
                  ["Moons",     planetData[focusedPlanet].facts.moons],
                ].map(([label, value]) => (
                  <Box key={label}>
                    <Text
                      fontSize="9px"
                      textTransform="uppercase"
                      letterSpacing="wider"
                      color="whiteAlpha.400"
                      mb="2px"
                    >
                      {label}
                    </Text>
                    <Text fontSize="xs" fontWeight="600" color="whiteAlpha.900">{value}</Text>
                  </Box>
                ))}
              </SimpleGrid>

              <Divider borderColor="whiteAlpha.100" mb={2} />
              <Text fontSize="xs" color="whiteAlpha.550" lineHeight="1.5">
                {planetData[focusedPlanet].facts.description}
              </Text>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom HUD ───────────────────────────────────── */}
      <Box
        position="absolute"
        bottom={0} left={0} right={0}
        bg="rgba(6, 9, 26, 0.80)"
        backdropFilter="blur(14px)"
        borderTop="1px solid rgba(255,255,255,0.06)"
        zIndex={10}
      >
        {/* Planet strip */}
        <Flex
          overflowX="auto"
          gap={3}
          px={4}
          py={2}
          justify="center"
          sx={{ "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}
        >
          {Object.entries(planetData).map(([name, data]) => {
            const isActive = focusedPlanet === name;
            return (
              <Box
                key={name}
                onClick={() => setFocusedPlanet(name)}
                cursor="pointer"
                textAlign="center"
                flexShrink={0}
                opacity={focusedPlanet && !isActive ? 0.4 : 1}
                transition="all 0.2s"
                _hover={{ opacity: 1 }}
              >
                <Box
                  w="30px" h="30px"
                  borderRadius="full"
                  backgroundImage={`url(${data.texture})`}
                  backgroundSize="cover"
                  backgroundPosition="center"
                  border="2px solid"
                  borderColor={isActive ? "brand.400" : "transparent"}
                  boxShadow={isActive ? "0 0 10px rgba(59,130,246,0.55)" : "none"}
                  mx="auto"
                  mb="4px"
                  transition="all 0.2s"
                />
                <Text
                  fontSize="8px"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  color={isActive ? "white" : "whiteAlpha.500"}
                  fontWeight={isActive ? "700" : "400"}
                >
                  {name}
                </Text>
              </Box>
            );
          })}

          {/* All / reset */}
          <Box
            onClick={() => setFocusedPlanet(null)}
            cursor="pointer"
            textAlign="center"
            flexShrink={0}
            opacity={focusedPlanet ? 1 : 0.4}
            transition="all 0.2s"
            _hover={{ opacity: 1 }}
          >
            <Box
              w="30px" h="30px"
              borderRadius="full"
              bg="whiteAlpha.100"
              border="2px solid"
              borderColor={!focusedPlanet ? "brand.400" : "transparent"}
              boxShadow={!focusedPlanet ? "0 0 10px rgba(59,130,246,0.55)" : "none"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb="4px"
              transition="all 0.2s"
            >
              <Text fontSize="13px" lineHeight="1">⊙</Text>
            </Box>
            <Text
              fontSize="8px"
              letterSpacing="wider"
              textTransform="uppercase"
              color={!focusedPlanet ? "white" : "whiteAlpha.500"}
              fontWeight={!focusedPlanet ? "700" : "400"}
            >
              All
            </Text>
          </Box>
        </Flex>

        {/* Speed controls */}
        <Flex
          align="center"
          justify="center"
          gap={3}
          px={4}
          py={2}
          borderTop="1px solid rgba(255,255,255,0.04)"
          flexWrap="wrap"
        >
          <Text fontSize="9px" letterSpacing="widest" textTransform="uppercase" color="whiteAlpha.400" minW="40px" textAlign="right">
            Speed
          </Text>
          <HStack spacing={1}>
            {[0.1, 1, 5, 10, 50].map(s => (
              <Button
                key={s}
                size="xs"
                onClick={() => setSimulationSpeed(s)}
                variant={simulationSpeed === s ? "solid" : "ghost"}
                colorScheme={simulationSpeed === s ? "brand" : "gray"}
                color={simulationSpeed === s ? "white" : "whiteAlpha.500"}
                fontSize="10px"
                minW="34px"
                h="20px"
                _hover={{ color: "white" }}
              >
                {s}x
              </Button>
            ))}
          </HStack>
          <Box flex={1} maxW="160px">
            <input
              type="range"
              min="0.1"
              max="100"
              step="0.1"
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
              style={{
                width: '100%',
                height: '3px',
                borderRadius: '2px',
                outline: 'none',
                cursor: 'pointer',
                accentColor: '#3b82f6',
              }}
            />
          </Box>
          <Text fontSize="xs" color="brand.400" fontWeight="700" minW="38px">
            {simulationSpeed.toFixed(1)}x
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}