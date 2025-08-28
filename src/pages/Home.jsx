import { useEffect, useState } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  Spinner,
  Image,
  IconButton,
  useColorMode,
  SimpleGrid,
  Divider,
  Link,
  Badge,
  AspectRatio,
  Container,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import {
  MoonIcon,
  SunIcon,
  ExternalLinkIcon,
  CalendarIcon,
  ArrowForwardIcon,
  DownloadIcon
} from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

export default function Home() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [stats] = useState({
    totalImages: 0,
    dailyVisitors: 0,
    spaceEvents: 0,
  });

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiKey = import.meta.env.VITE_NASA_API_KEY;
        
        if (!apiKey || apiKey === 'DEMO_KEY') {
          console.warn('Using DEMO_KEY - limited to 1000 requests per hour');
        }
        
        const res = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        );

        if (!res.ok) {
          if (res.status === 429) {
            throw new Error("NASA API rate limit exceeded. Please try again later.");
          } else if (res.status === 403) {
            throw new Error("Invalid API key. Please check your NASA API key configuration.");
          } else if (res.status >= 500) {
            throw new Error("NASA API service temporarily unavailable.");
          } else {
            throw new Error(`Failed to fetch APOD: ${res.status}`);
          }
        }

        const data = await res.json();
        console.log('APOD Data:', data); 
        setApod(data);
      } catch (err) {
        console.error('APOD fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAPOD();
  }, []);

  const toggleDescription = () => setShowFullDescription((prev) => !prev);

  const renderAPODContent = () => {
    if (loading) {
      return (
        <VStack spacing={4} py={10}>
          <Spinner size="xl" color="brand.primary" thickness="4px" />
          <Text color="text.secondary">Loading today's cosmic wonder...</Text>
        </VStack>
      );
    }
  
    if (error) {
      return (
        <Box maxW="lg" mx="auto" p={6} borderRadius="lg" bg="red.50" border="1px" borderColor="red.200">
          <Heading size="md" color="red.600" mb={2}>Error</Heading>
          <Text color="red.500">{error}</Text>
          <Button mt={4} onClick={() => window.location.reload()} colorScheme="red" leftIcon={<ArrowForwardIcon />}>
            Try Again
          </Button>
        </Box>
      );
    }
  
    if (!apod) return <Text>No content available</Text>;
  
    const isVideo = apod.media_type === "video";//Minor issue from NASA API where it returns video as image.
    const isImage = apod.media_type === "image" || /\.(gif|jpe?g|png)$/i.test(apod.url);//Allows even if labeled other if ends with /\(allowed)$/i
    const isOther = !isImage && !isVideo;//this is for the future to add other media types currently not supported from NASA API's like gifs. Need to ID the issue when APOD is not an image. 
  
    const description = apod.explanation || "";
    const shouldTruncate = description.length > 200;
    const displayDescription = showFullDescription || !shouldTruncate ? description : `${description.slice(0, 200)}...`;
  
    return (
      <VStack spacing={8}>
        <Box bg="bg.card" p={6} rounded="xl" shadow="lg" position="relative">
          {isVideo ? (
            apod.thumbnail_url ? (
              <Box position="relative" onClick={onOpen} cursor="pointer">
                <Image 
                  src={apod.thumbnail_url} 
                  alt="Video thumbnail" 
                  rounded="md" 
                  maxH="500px"
                  objectFit="cover"
                  fallbackSrc="/hal9000.png"
                />
                <IconButton
                  icon={<ArrowForwardIcon />}
                  aria-label="Play video"
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  colorScheme="red"
                  size="lg"
                  isRound
                  bg="whiteAlpha.800"
                />
              </Box>
            ) : (
              <AspectRatio ratio={16 / 9}>
                <Box as="iframe" src={apod.url} title={apod.title} allowFullScreen rounded="md" />
              </AspectRatio>
            )
          ) : isImage ? (
            <>
              <Image 
                src={apod.url} 
                alt={apod.title} 
                rounded="md" 
                maxH="500px" 
                objectFit="cover" 
                fallbackSrc="/hal9000.png"
                cursor="pointer"
                onClick={onOpen}
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.02)" }}
              />
              <IconButton
                position="absolute"
                top="8"
                right="8"
                aria-label="View fullscreen"
                icon={<ExternalLinkIcon />}
                onClick={onOpen}
                colorScheme="blue"
                variant="solid"
                opacity={0.8}
                _hover={{ opacity: 1, transform: "scale(1.1)" }}
                transition="all 0.3s ease"
              />
            </>
          ) : (
            <VStack spacing={4}>
              <Image 
                src="/hal9000.png" 
                alt="No media available" 
                rounded="md"
                maxH="400px"
                objectFit="contain"
              />
              <Text color="text.secondary" fontStyle="italic">
                No image or video available for this APOD.
              </Text>
              <Button
                as="a"
                href="https://apod.nasa.gov/apod/astropix.html"
                target="_blank"
                leftIcon={<ExternalLinkIcon />}
                colorScheme="teal"
              >
                View on NASA APOD
              </Button>
            </VStack>
          )}
        </Box>
  
        <VStack spacing={4} textAlign="center">
          <Heading size="lg">{apod.title}</Heading>
  
          <HStack justify="center" wrap="wrap" spacing={3}>
            {apod.date && (
              <Badge colorScheme="purple" px={3} py={1} borderRadius="full">
                <CalendarIcon mr={2} />
                {new Date(apod.date).toLocaleDateString("en-US")}
              </Badge>
            )}
            {apod.copyright && apod.copyright.trim() !== "" ? (
              <Badge colorScheme="teal" px={3} py={1} borderRadius="full">
                Photography by {apod.copyright}
              </Badge>
            ) : (
              <Badge colorScheme="gray" px={3} py={1} borderRadius="full">
                NASA Image
              </Badge>
            )}
          </HStack>
  
          <Text fontSize="md" maxW="3xl" color="text.primary">
            {displayDescription}
          </Text>
  
          {shouldTruncate && (
            <Button variant="link" colorScheme="teal" size="sm" onClick={toggleDescription} rightIcon={<ExternalLinkIcon />}>
              {showFullDescription ? "Show Less" : "Read More"}
            </Button>
          )}
  
          {apod.copyright && apod.copyright.trim() !== "" ? (
            <Text fontSize="sm" color="text.secondary" fontStyle="italic">
              Photography by {apod.copyright}
            </Text>
          ) : (
            <Text fontSize="sm" color="text.secondary" fontStyle="italic">
              Courtesy of NASA
            </Text>
          )}
        </VStack>
      </VStack>
    );
  };
  

  return (
    <Box bg="bg.body" minH="100vh" py={16} px={6}>
      <Container maxW="7xl">
        <HStack justify="space-between" mb={6}>
          <Box />  
        </HStack>

        <VStack spacing={10} textAlign="center">
          <Heading size="2xl" bgGradient="linear(to-r, teal.400, blue.500)" bgClip="text">
            Welcome to LaunchPoint
          </Heading>
          <Text fontSize="xl" color="text.primary" maxW="600px">
            Explore the universe *** powered by NASA data
          </Text>
          <HStack spacing={4}>
            <Button 
              as={RouterLink} 
              to="/explore" 
              size="lg"
              bgGradient="linear(to-r, teal.400, blue.500)"
              _hover={{
                bgGradient: "linear(to-r, teal.500, blue.600)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.3)"
              }}
              _active={{
                transform: "translateY(0px)"
              }}
              transition="all 0.3s"
            >
              Start Exploring
            </Button>
            <Button 
              variant="outline" 
              colorScheme="teal" 
              size="lg" 
              as={RouterLink} 
              to="/launches"
              _hover={{
                bgGradient: "linear(to-r, teal.400, blue.500)",
                color: "white",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.3)"
              }}
              transition="all 0.3s"
            >
              Learn More
            </Button>
          </HStack>
        </VStack>

        <Divider my={12} />

        <Box>{renderAPODContent()}</Box>

        <Divider my={12} />

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <Box 
            bg="bg.card" 
            p={6} 
            rounded="xl" 
            shadow="md" 
            textAlign="center"
            _hover={{
              transform: "translateY(-4px)",
              shadow: "xl",
              borderColor: "teal.400"
            }}
            border="1px solid"
            borderColor="transparent"
            transition="all 0.3s"
          >
            <Text fontSize="lg" mb={2} color="text.primary">Total Images</Text>
            <Heading size="xl" bgGradient="linear(to-r, teal.400, blue.500)" bgClip="text">{stats.totalImages.toLocaleString()}</Heading>
            <Text fontSize="sm" color="text.secondary">From NASA's archives</Text>
          </Box>
          <Box 
            bg="bg.card" 
            p={6} 
            rounded="xl" 
            shadow="md" 
            textAlign="center"
            _hover={{
              transform: "translateY(-4px)",
              shadow: "xl",
              borderColor: "purple.400"
            }}
            border="1px solid"
            borderColor="transparent"
            transition="all 0.3s"
          >
            <Text fontSize="lg" mb={2} color="text.primary">Daily Visitors</Text>
            <Heading size="xl" bgGradient="linear(to-r, purple.400, pink.500)" bgClip="text">{stats.dailyVisitors.toLocaleString()}</Heading>
            <Text fontSize="sm" color="text.secondary">Space enthusiasts worldwide</Text>
          </Box>
          <Box 
            bg="bg.card" 
            p={6} 
            rounded="xl" 
            shadow="md" 
            textAlign="center"
            _hover={{
              transform: "translateY(-4px)",
              shadow: "xl",
              borderColor: "orange.400"
            }}
            border="1px solid"
            borderColor="transparent"
            transition="all 0.3s"
          >
            <Text fontSize="lg" mb={2} color="text.primary">Space Events</Text>
            <Heading size="xl" bgGradient="linear(to-r, orange.400, red.500)" bgClip="text">{stats.spaceEvents}</Heading>
            <Text fontSize="sm" color="text.secondary">This month</Text>
          </Box>
        </SimpleGrid>
      </Container>

      {/* Fullscreen Image Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent bg="gray.900" color="white">
          <ModalHeader>
            <HStack justify="space-between" align="center">
              <Text>{apod?.title}</Text>
              <HStack spacing={2}>
                <Button
                  leftIcon={<ExternalLinkIcon />}
                  size="sm"
                  onClick={() => window.open(apod?.url, '_blank')}
                  colorScheme="blue"
                >
                  Open Original
                </Button>
                <Button
                  leftIcon={<DownloadIcon />}
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = apod?.url;
                    link.download = `apod_${apod?.date || 'today'}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  colorScheme="green"
                >
                  Download
                </Button>
              </HStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {apod && (
              <VStack spacing={4}>
                <Image 
                  src={apod.url} 
                  alt={apod.title}
                  maxH="70vh"
                  objectFit="contain"
                  borderRadius="lg"
                  fallbackSrc="/hal9000.png"
                />
                <VStack spacing={3} w="100%" textAlign="left">
                  <Box w="100%" p={4} bg="gray.800" borderRadius="lg">
                    <Heading size="sm" mb={3} bgGradient="linear(to-r, teal.400, blue.500)" bgClip="text">
                      Image Information
                    </Heading>
                    <SimpleGrid columns={[1, 2]} spacing={4}>
                      <Box>
                        <Text fontSize="sm" color="text.secondary">Date</Text>
                        <Text fontWeight="bold">{apod.date}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="text.secondary">Type</Text>
                        <Text fontWeight="bold">{apod.media_type}</Text>
                      </Box>
                      {apod.copyright && apod.copyright.trim() !== "" && (
                        <Box>
                          <Text fontSize="sm" color="text.secondary">Photographer</Text>
                          <Text fontWeight="bold" color="teal.300">{apod.copyright}</Text>
                        </Box>
                      )}
                      <Box>
                        <Text fontSize="sm" color="text.secondary">Service Version</Text>
                        <Text fontWeight="bold">{apod.service_version}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                  
                  <Box w="100%" p={4} bg="gray.800" borderRadius="lg">
                    <Heading size="sm" mb={3} bgGradient="linear(to-r, purple.400, pink.500)" bgClip="text">
                      Description
                    </Heading>
                    <Text fontSize="md" color="white.500" lineHeight="1.6">
                      {apod.explanation}
                    </Text>
                  </Box>
                </VStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
