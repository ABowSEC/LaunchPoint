import { useEffect, useRef, useState } from "react";
import { Box, Flex, Text, Button, HStack, VStack } from "@chakra-ui/react";
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

export default function SolarSystemView() {
  const mountRef = useRef(null);
  const [focusedPlanet, setFocusedPlanet] = useState(null);

  // Planet data for the selector
  const planetData = {
    Mercury: { texture: 'textures/mercury.jpg', symbol: '' },
    Venus: { texture: 'textures/venus.jpg', symbol: '' },
    Earth: { texture: 'textures/earth.jpg', symbol: '' },
    Mars: { texture: 'textures/mars.jpg', symbol: '' },
    Jupiter: { texture: 'textures/jupiter.jpg', symbol: '' },
    Saturn: { texture: 'textures/saturn.jpg', symbol: '' }
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

    const pointLight = new THREE.PointLight(0xffffff,10, 1000);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;

    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.width = 1024;
    scene.add(pointLight);

    const ambient = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambient);

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
     
    //SUNGLOW VFX
    /*const glowGeometry = new THREE.SphereGeometry(6, 64, 64); // slightly larger than sun
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide, // render from inside
      depthWrite: false
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);*/

    const solarSystem = new THREE.Group();
    const planetObjects = {};

    const createOrbitEllipse = (radiusX, radiusZ) => {
      const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusZ, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(100);
      const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, 0, p.y)));
      const material = new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 });
      return new THREE.Line(geometry, material);
    };

    const createPlanetSystem = (planetData, orbitRadiusX, orbitRadiusZ, name) => {
      const group = new THREE.Group();
      const mesh = planetData.getMesh();
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      scene.add(createOrbitEllipse(orbitRadiusX, orbitRadiusZ));
      planetObjects[name] = { mesh, group, orbitRadiusX, orbitRadiusZ, angle: 0 };
      return { group, mesh };
    };

    const planets = [
      createPlanetSystem(new Planet(0.7, 0, "textures/mercury.jpg"), 6, 5, "Mercury"),
      createPlanetSystem(new Planet(1, 0, "textures/venus.jpg"), 9, 8, "Venus"),
      createPlanetSystem(new Planet(1.2, 0, "textures/earth.jpg"), 12, 10, "Earth"),
      createPlanetSystem(new Planet(1, 0, "textures/mars.jpg"), 15, 13, "Mars"),
      createPlanetSystem(new Planet(2, 0, "textures/jupiter.jpg"), 20, 18, "Jupiter"),
      createPlanetSystem(new Planet(1.8, 0, "textures/saturn.jpg"), 25, 23, "Saturn")
    ];

    planets.forEach(p => solarSystem.add(p.group));
    scene.add(solarSystem);

    const animate = () => {
      requestAnimationFrame(animate);
      sunMesh.rotation.y += 0.002;

      Object.keys(planetObjects).forEach(name => {
        const p = planetObjects[name];
        p.angle += 0.01 * (6 / p.orbitRadiusX);
        p.mesh.position.set(
          Math.cos(p.angle) * p.orbitRadiusX,
          0,
          Math.sin(p.angle) * p.orbitRadiusZ
        );
        p.mesh.rotation.y += 0.02;
      });

      if (focusedPlanet && planetObjects[focusedPlanet]) {
        const target = planetObjects[focusedPlanet].mesh;
        controls.target.lerp(target.position, 0.05);
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
  }, [focusedPlanet]);

  return (
    <VStack spacing={6} w="100%" h="100vh">
      {/* 3D Solar System Viewer */}
      <Box
        ref={mountRef}
        w="100%"
        h="70vh"
        bg="gray.900"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="2xl"
        border="1px solid"
        borderColor="whiteAlpha.200"
      />

      {/* Planet Selector Section */}
      <Box
        w="100%"
        bg="linear-gradient(135deg, rgba(26, 32, 44, 0.95), rgba(45, 55, 72, 0.95))"
        backdropFilter="blur(10px)"
        borderRadius="xl"
        p={6}
        border="1px solid"
        borderColor="whiteAlpha.200"
        boxShadow="xl"
      >
        <Text
          fontSize="2xl"
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