import { useEffect, useState } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
  Spinner,
  Skeleton,
  Image,
  IconButton,
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
  useDisclosure,
  usePrefersReducedMotion
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  ExternalLinkIcon,
  CalendarIcon,
  ArrowForwardIcon,
  DownloadIcon
} from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

// Content-arrival reveal: APOD data lands a beat after the page; a short
// fade-and-rise acknowledges it without page-load choreography.
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export default function Home() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [apod?.url]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Reveal only when motion is allowed; otherwise content is simply present.
  const revealAnim = prefersReducedMotion
    ? undefined
    : `${fadeUp} 0.45s cubic-bezier(0.16, 1, 0.3, 1) both`;

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        setLoading(true);
        setError(null);

        // Local calendar date (en-CA gives YYYY-MM-DD). APOD publishes on US
        // Eastern time, so using UTC here can roll the date forward a day early
        // and cache yesterday's image under today's key.
        const today = new Date().toLocaleDateString('en-CA');
        const cacheKey = `apod_${today}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          // Only trust the cache if it actually holds today's image. NASA can
          // lag (it publishes at midnight ET), so an entry written early may
          // hold yesterday's image under today's key; refetch in that case.
          if (parsed?.date === today) {
            setApod(parsed);
            return;
          }
          localStorage.removeItem(cacheKey);
        }

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
        // Key by the image's real date so a lagging day can't poison the slot.
        const storeKey = `apod_${data.date ?? today}`;
        // Evict any stale APOD entries before writing the new one
        Object.keys(localStorage)
          .filter(k => k.startsWith('apod_') && k !== storeKey)
          .forEach(k => localStorage.removeItem(k));
        localStorage.setItem(storeKey, JSON.stringify(data));
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
        <Box maxW="lg" mx="auto" p={6} borderRadius="lg" bg="bg.card" border="1px solid" borderColor="red.800">
          <Heading as="h2" size="md" color="red.400" mb={2}>Error</Heading>
          <Text color="text.secondary">{error}</Text>
          <Button mt={4} onClick={() => window.location.reload()} colorScheme="brand" leftIcon={<ArrowForwardIcon />}>
            Try Again
          </Button>
        </Box>
      );
    }
  
    if (!apod) return <Text>No content available</Text>;
  
    const isVideo = apod.media_type === "video";//NASA API occasionally labels video as image; check media_type first.
    const isImage = apod.media_type === "image" || /\.(gif|jpe?g|png)$/i.test(apod.url);//Falls through to the non-image branch when neither matches (e.g. interactive embeds).

    const description = apod.explanation || "";
    const shouldTruncate = description.length > 200;
    const displayDescription = showFullDescription || !shouldTruncate ? description : `${description.slice(0, 200)}...`;
  
    return (
      <VStack spacing={8} animation={revealAnim}>
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
                  colorScheme="brand"
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
              {!imgLoaded && !imgError && (
                <Skeleton rounded="md" height="500px" />
              )}
              {imgError ? (
                <Image
                  src="/hal9000.png"
                  alt="Image unavailable"
                  rounded="md"
                  maxH="500px"
                  objectFit="contain"
                />
              ) : (
                <Image
                  src={apod.url}
                  alt={apod.title}
                  rounded="md"
                  maxH="500px"
                  objectFit="cover"
                  cursor="pointer"
                  display={imgLoaded ? "block" : "none"}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                  onClick={onOpen}
                  transition="transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), filter 0.3s ease"
                  _hover={
                    prefersReducedMotion
                      ? { filter: "brightness(1.08)" }
                      : { transform: "scale(1.02)" }
                  }
                />
              )}
              <IconButton
                position="absolute"
                top="8"
                right="8"
                aria-label="View fullscreen"
                icon={<ExternalLinkIcon />}
                onClick={onOpen}
                colorScheme="brand"
                variant="solid"
                opacity={0.8}
                _hover={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, transform: "scale(1.1)" }
                }
                transition="opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
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
                colorScheme="brand"
              >
                View on NASA APOD
              </Button>
            </VStack>
          )}
        </Box>
  
        <VStack spacing={4} textAlign="center">
          <Heading as="h2" size="lg" fontWeight="700">{apod.title}</Heading>
  
          <HStack justify="center" wrap="wrap" spacing={3}>
            {apod.date && (
              <Badge bg="bg.elevated" color="text.primary" px={3} py={1} borderRadius="full" textTransform="none">
                <CalendarIcon mr={2} />
                {/* apod.date is a plain calendar date; format in UTC so it
                    isn't shifted back a day in timezones behind UTC. */}
                {new Date(apod.date).toLocaleDateString("en-US", { timeZone: "UTC" })}
              </Badge>
            )}
            {apod.copyright && apod.copyright.trim() !== "" ? (
              <Badge bg="bg.elevated" color="text.primary" px={3} py={1} borderRadius="full" textTransform="none">
                Photography by {apod.copyright}
              </Badge>
            ) : (
              <Badge bg="bg.elevated" color="text.secondary" px={3} py={1} borderRadius="full" textTransform="none">
                NASA Image
              </Badge>
            )}
          </HStack>

          <Text fontSize="md" maxW="65ch" color="text.primary" sx={{ textWrap: 'pretty' }}>
            {displayDescription}
          </Text>

          {shouldTruncate && (
            <Button variant="link" colorScheme="brand" size="sm" onClick={toggleDescription} rightIcon={<ExternalLinkIcon />}>
              {showFullDescription ? "Show Less" : "Read More"}
            </Button>
          )}

          <Text fontSize="sm" color="text.secondary" fontStyle="italic">
            {apod.copyright && apod.copyright.trim() !== ""
              ? `Photography by ${apod.copyright}`
              : "Courtesy of NASA"}
          </Text>

        </VStack>
      </VStack>
    );
  };
  

  return (
    <Box py={16} px={6}>
      <Container maxW="7xl">
        <VStack spacing={10} textAlign="center">
          <Heading
            as="h1"
            fontSize="clamp(2.25rem, 5vw, 3rem)"
            fontWeight="700"
            letterSpacing="-0.02em"
            lineHeight="1.1"
            color="text.primary"
            sx={{ textWrap: 'balance' }}
          >
            Welcome to LaunchPoint
          </Heading>
          <Text fontSize="xl" color="text.secondary" maxW="46ch">
            Live imagery, telemetry, and launch schedules, straight from NASA.
          </Text>
          <HStack spacing={4}>
            <Button
              as={RouterLink}
              to="/explore"
              size="lg"
              colorScheme="brand"
              _hover={
                prefersReducedMotion
                  ? { boxShadow: '0 8px 25px rgba(59,130,246,0.35)' }
                  : { transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(59,130,246,0.35)' }
              }
              _active={prefersReducedMotion ? undefined : { transform: 'translateY(0)' }}
              transition="transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease"
            >
              Start Exploring
            </Button>
            <Button
              as={RouterLink}
              to="/launches"
              size="lg"
              variant="outline"
              colorScheme="brand"
              _hover={
                prefersReducedMotion
                  ? { bg: 'whiteAlpha.50' }
                  : { transform: 'translateY(-2px)', bg: 'whiteAlpha.50' }
              }
              transition="transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease"
            >
              View Launches
            </Button>
          </HStack>
        </VStack>

        <Divider my={12} />

        <Box>{renderAPODContent()}</Box>
      </Container>

      {/* Fullscreen Image Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent bg="bg.card" color="text.primary" border="1px solid" borderColor="border.default">
          <ModalHeader>
            <HStack justify="space-between" align="center">
              <Text>{apod?.title}</Text>
              <HStack spacing={2}>
                <Button
                  leftIcon={<ExternalLinkIcon />}
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(apod?.url, '_blank')}
                  colorScheme="brand"
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
                  colorScheme="brand"
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
                  fallback={<Skeleton height="60vh" width="100%" borderRadius="lg" />}
                />
                <VStack spacing={3} w="100%" textAlign="left">
                  <Box w="100%" p={4} bg="bg.elevated" border="1px solid" borderColor="border.default" borderRadius="lg">
                    <Heading as="h3" size="sm" mb={3} color="text.primary">
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
                          <Text fontWeight="bold" color="text.primary">{apod.copyright}</Text>
                        </Box>
                      )}
                      <Box>
                        <Text fontSize="sm" color="text.secondary">Service Version</Text>
                        <Text fontWeight="bold">{apod.service_version}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  <Box w="100%" p={4} bg="bg.elevated" border="1px solid" borderColor="border.default" borderRadius="lg">
                    <Heading as="h3" size="sm" mb={3} color="text.primary">
                      Description
                    </Heading>
                    <Text fontSize="md" color="text.primary" lineHeight="1.625" sx={{ textWrap: 'pretty' }}>
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
