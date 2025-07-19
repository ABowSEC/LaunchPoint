import { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Spinner,
  Button,
  Select,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Tooltip,
  Flex,
  Heading,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { ExternalLinkIcon, ViewIcon, DownloadIcon, InfoIcon, SearchIcon } from "@chakra-ui/icons";

/**
 * Camera information database for Curiosity rover cameras
 * 
 * This object contains detailed information about each camera aboard NASA's Curiosity rover,
 * including their purpose, specifications, and capabilities. This data helps users understand
 * what they're looking at when viewing Mars photos.
 * 
 * TODO: Move to external database/API for better maintainability
 * 
 * @type {Object.<string, Object>}
 */
const cameraInfo = {
  FHAZ: {
    name: "Front Hazard Avoidance Camera",
    fullName: "Front Hazard Avoidance Camera",
    description: "Located on the front of the rover, this camera helps identify potential hazards and obstacles in the rover's path.",
    purpose: "Navigation and hazard avoidance",
    location: "Front of rover",
    resolution: "1 megapixel",
    color: "Black and white",
    features: ["Hazard detection", "Navigation assistance", "Path planning"]
  },
  RHAZ: {
    name: "Rear Hazard Avoidance Camera", 
    fullName: "Rear Hazard Avoidance Camera",
    description: "Located on the back of the rover, this camera provides rearward visibility for backing up and maneuvering.",
    purpose: "Rear navigation and hazard avoidance",
    location: "Rear of rover",
    resolution: "1 megapixel",
    color: "Black and white",
    features: ["Rear hazard detection", "Backing up assistance", "Maneuvering support"]
  },
  MAST: {
    name: "Mast Camera",
    fullName: "Mast Camera",
    description: "The main science camera mounted on the rover's mast, providing high-resolution color images of the Martian landscape.",
    purpose: "Primary science imaging",
    location: "Rover mast",
    resolution: "2 megapixels",
    color: "Color",
    features: ["High-resolution imaging", "Panoramic views", "Scientific analysis"]
  },
  CHEMCAM: {
    name: "Chemistry and Camera",
    fullName: "Chemistry and Camera",
    description: "Combines a camera with a laser spectrometer to analyze the chemical composition of rocks and soil from a distance.",
    purpose: "Chemical analysis and imaging",
    location: "Rover mast",
    resolution: "1 megapixel",
    color: "Color",
    features: ["Laser spectroscopy", "Chemical analysis", "Remote sensing"]
  },
  MAHLI: {
    name: "Mars Hand Lens Imager",
    fullName: "Mars Hand Lens Imager",
    description: "A close-up camera that works like a geologist's hand lens, providing detailed images of rocks and soil at very close range.",
    purpose: "Microscopic imaging",
    location: "Rover arm",
    resolution: "2 megapixels",
    color: "Color",
    features: ["Close-up imaging", "Microscopic detail", "Geological analysis"]
  },
  MARDI: {
    name: "Mars Descent Imager",
    fullName: "Mars Descent Imager",
    description: "Captured images during the rover's descent to Mars, providing a unique perspective of the landing site.",
    purpose: "Descent documentation",
    location: "Rover body",
    resolution: "1.3 megapixels",
    color: "Color",
    features: ["Descent imaging", "Landing site documentation", "Terrain mapping"]
  },
  NAVCAM: {
    name: "Navigation Camera",
    fullName: "Navigation Camera",
    description: "Stereo cameras that provide 3D vision for navigation, helping the rover understand its surroundings and plan safe paths.",
    purpose: "Navigation and 3D mapping",
    location: "Rover mast",
    resolution: "1 megapixel",
    color: "Black and white",
    features: ["3D vision", "Navigation planning", "Stereo imaging"]
  }
};

/**
 * MarsFeed Component
 * 
 * Displays Mars rover photos from NASA's API with filtering, viewing, and educational features.
 * This component fetches photos for a specific Martian day (sol) and provides an interactive
 * interface for browsing, filtering by camera, and learning about the rover's camera systems.
 * 
 * @param {Object} props - Component props
 * @param {number} props.sol - Martian day (sol) to fetch photos for
 * @returns {JSX.Element} The MarsFeed component
 * 
 * @example
 * <MarsFeed sol={1000} />
 */
function MarsFeed({ sol }) {
  // State for managing photos data
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for UI interactions
  const [selectedCamera, setSelectedCamera] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Get unique cameras from photos for filter dropdown
  const cameras = ["all", ...new Set(photos.map(photo => photo.camera.name))];

  // Filter photos by selected camera
  const filteredPhotos = selectedCamera === "all" 
    ? photos 
    : photos.filter(photo => photo.camera.name === selectedCamera);

  /**
   * Fetch Mars photos for the specified sol
   * 
   * This effect runs whenever the sol prop changes. It fetches photos from NASA's
   * Mars Photos API for the Curiosity rover on the specified Martian day.
   * 
   * @param {number} sol - Martian day to fetch photos for
   */
  useEffect(() => {
    const fetchPhotos = async () => {
      if (!sol) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const apiKey = import.meta.env.VITE_NASA_API_KEY;
        const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${sol}&api_key=${apiKey}`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.photos && data.photos.length > 0) {
          setPhotos(data.photos);
        } else {
          setError("No photos found for this sol. Try selecting a different Martian day.");//should be filtered already this is a extra procaution
        }
      } catch (error) {
        console.error("Failed to fetch Mars Photos:", error);
        setError("Failed to load photos. Please check your internet connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [sol]);

  /**
   * Handle photo click to open modal
   * 
   * @param {Object} photo - Photo object from NASA API
   */
  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    onOpen();
  };

  /**
   * Download photo to user's device
   * 
   * Creates a temporary link element to trigger download of the photo
   * with a descriptive filename including photo ID and date.
   * 
   * @param {Object} photo - Photo object from NASA API
   */
  const handleDownload = (photo) => {
    const link = document.createElement('a');
    link.href = photo.img_src;
    link.download = `mars_photo_${photo.id}_${photo.earth_date}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <VStack spacing={6} py={10}>
        <Spinner size="xl" color="red.400" />
        <Text color="text.secondary">Loading Mars photos...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        <Box>
          <AlertTitle>Error loading photos!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Box>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} w="100%">
      {/* Header with stats */}
              <Box w="100%" textAlign="center" p={4} bg="gray.800" borderRadius="lg">
          <Heading size="md" mb={2} bgGradient="linear(to-r, red.400, orange.400)" bgClip="text">Sol {sol} - Mars Rover Photos</Heading>
          <HStack justify="center" spacing={4} flexWrap="wrap">
            <Badge colorScheme="green" variant="subtle">
              {photos.length} Total Photos
            </Badge>
            <Badge colorScheme="blue" variant="subtle">
              {filteredPhotos.length} Filtered
            </Badge>
            <Badge colorScheme="purple" variant="subtle">
              Curiosity Rover
            </Badge>
          </HStack>
        </Box>

      {/* Main Content Tabs */}
      <Tabs variant="enclosed" colorScheme="red" w="100%">
        <TabList>
          <Tab>
            <HStack spacing={2}>
              <ViewIcon />
              <Text>Photos</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <InfoIcon />
              <Text>Camera Info</Text>
            </HStack>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Photos Tab */}
          <TabPanel>
            <VStack spacing={6}>
              {/* Camera Filter */}
              <Box w="100%" maxW="400px">
                <Text fontSize="sm" color="text.secondary" mb={2}>Filter by Camera:</Text>
                <Select 
                  value={selectedCamera} 
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  bg="gray.700"
                  borderColor="gray.600"
                >
                  {cameras.map(camera => (
                    <option key={camera} value={camera}>
                      {camera === "all" ? "All Cameras" : camera.toUpperCase()}
                    </option>
                  ))}
                </Select>
              </Box>

              <Divider />

              {/* Photo Grid */}
              {filteredPhotos.length === 0 ? (
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <AlertDescription>
                    No photos found for the selected camera. Try a different filter.
                  </AlertDescription>
                </Alert>
              ) : (
                <SimpleGrid columns={[1, 2, 3, 4]} spacing={6} w="100%">
                  {filteredPhotos.map((photo) => (
                    <Box 
                      key={photo.id} 
                      borderWidth="1px" 
                      borderRadius="lg" 
                      overflow="hidden"
                      bg="gray.800"
                      transition="all 0.3s ease"
                      _hover={{
                        transform: "translateY(-4px)",
                        boxShadow: "xl",
                        borderColor: "red.400"
                      }}
                      cursor="pointer"
                      onClick={() => handlePhotoClick(photo)}
                    >
                      <Box position="relative">
                        <Image 
                          src={photo.img_src} 
                          alt={`Mars photo ${photo.id}`} 
                          width="100%" 
                          height="200px"
                          objectFit="cover"
                                            fallbackSrc="/hal9000.png"
                        />
                        
                        {/* Action buttons overlay */}
                        <Box 
                          position="absolute" 
                          top={2} 
                          right={2} 
                          opacity={0}
                          transition="opacity 0.3s ease"
                          _groupHover={{ opacity: 1 }}
                        >
                          <HStack spacing={1}>
                            <Tooltip label="Download">
                              <IconButton
                                size="sm"
                                icon={<DownloadIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(photo);
                                }}
                                colorScheme="blue"
                                variant="solid"
                              />
                            </Tooltip>
                            <Tooltip label="View Full Size">
                              <IconButton
                                size="sm"
                                icon={<ExternalLinkIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(photo.img_src, '_blank');
                                }}
                                colorScheme="green"
                                variant="solid"
                              />
                            </Tooltip>
                          </HStack>
                        </Box>
                      </Box>
                      
                      <Box p={4}>
                        <VStack align="start" spacing={2}>
                          <Badge colorScheme="red" variant="subtle" fontSize="xs">
                            {photo.camera.name.toUpperCase()}
                          </Badge>
                          <Text fontSize="sm" color="text.secondary">
                            Earth Date: {photo.earth_date}
                          </Text>
                          <Text fontSize="xs" color="text.secondary">
                            Photo ID: {photo.id}
                          </Text>
                        </VStack>
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </VStack>
          </TabPanel>

          {/* Camera Info Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Box textAlign="center" p={4} bg="gray.800" borderRadius="lg">
                <Heading size="md" mb={2} bgGradient="linear(to-r, red.400, orange.400)" bgClip="text">Curiosity Rover Cameras</Heading>
                <Text color="text.secondary">
                  Learn about the different cameras aboard NASA's Curiosity rover and their scientific purposes.
                </Text>
              </Box>

              <Accordion allowMultiple>
                {Object.entries(cameraInfo).map(([cameraCode, info]) => (
                  <AccordionItem key={cameraCode} border="1px solid" borderColor="gray.600" borderRadius="lg" mb={2}>
                    <AccordionButton 
                      py={4} 
                      _expanded={{ bg: 'red.500', color: 'white' }}
                      _hover={{ bg: 'gray.700' }}
                    >
                      <Box flex="1" textAlign="left">
                        <HStack spacing={3}>
                          <Badge colorScheme="red" variant="solid" fontSize="xs">
                            {cameraCode}
                          </Badge>
                          <Text fontWeight="bold">{info.name}</Text>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} bg="gray.700">
                      <VStack spacing={4} align="stretch">
                        <Text fontSize="md" color="text.primary">
                          {info.description}
                        </Text>
                        
                        <SimpleGrid columns={[1, 2]} spacing={4}>
                          <Box>
                            <Text fontSize="sm" color="text.secondary" fontWeight="bold">Purpose</Text>
                            <Text fontSize="sm">{info.purpose}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="text.secondary" fontWeight="bold">Location</Text>
                            <Text fontSize="sm">{info.location}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="text.secondary" fontWeight="bold">Resolution</Text>
                            <Text fontSize="sm">{info.resolution}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="text.secondary" fontWeight="bold">Color</Text>
                            <Text fontSize="sm">{info.color}</Text>
                          </Box>
                        </SimpleGrid>

                        <Box>
                          <Text fontSize="sm" color="text.secondary" fontWeight="bold" mb={2}>Key Features</Text>
                          <List spacing={1}>
                            {info.features.map((feature, index) => (
                              <ListItem key={index} fontSize="sm">
                                <ListIcon as={SearchIcon} color="red.400" />
                                {feature}
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>

              <Box p={4} bg="gray.800" borderRadius="lg" textAlign="center">
                <Text fontSize="sm" color="text.secondary">
                  <strong>Did you know?</strong> Curiosity has 17 cameras total, making it the most well-documented rover on Mars. 
                  Each camera serves a specific scientific or engineering purpose.
                </Text>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Photo Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>
            <HStack justify="space-between" align="center">
              <Text>Mars Photo Details</Text>
              <HStack spacing={2}>
                <Button
                  leftIcon={<DownloadIcon />}
                  size="sm"
                  onClick={() => selectedPhoto && handleDownload(selectedPhoto)}
                  colorScheme="blue"
                >
                  Download
                </Button>
                <Button
                  leftIcon={<ExternalLinkIcon />}
                  size="sm"
                  onClick={() => selectedPhoto && window.open(selectedPhoto.img_src, '_blank')}
                  colorScheme="green"
                >
                  Open Full Size
                </Button>
              </HStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedPhoto && (
              <VStack spacing={4}>
                <Image 
                  src={selectedPhoto.img_src} 
                  alt={`Mars photo ${selectedPhoto.id}`}
                  maxH="60vh"
                  objectFit="contain"
                  borderRadius="lg"
                />
                <VStack spacing={3} w="100%" textAlign="left">
                  <Box w="100%" p={4} bg="gray.700" borderRadius="lg">
                    <Heading size="sm" mb={3}>Photo Information</Heading>
                    <SimpleGrid columns={[1, 2]} spacing={4}>
                      <Box>
                        <Text fontSize="sm" color="text.secondary">Rover</Text>
                        <Text fontWeight="bold">{selectedPhoto.rover.name}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="text.secondary">Camera</Text>
                        <Text fontWeight="bold">{selectedPhoto.camera.full_name}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="text.secondary">Earth Date</Text>
                        <Text fontWeight="bold">{selectedPhoto.earth_date}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="text.secondary">Sol</Text>
                        <Text fontWeight="bold">{selectedPhoto.sol}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="text.secondary">Photo ID</Text>
                        <Text fontWeight="bold">{selectedPhoto.id}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="text.secondary">Launch Date</Text>
                        <Text fontWeight="bold">{selectedPhoto.rover.launch_date}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </VStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default MarsFeed;
