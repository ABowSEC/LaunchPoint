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
  Container
} from "@chakra-ui/react";
import {
  MoonIcon,
  SunIcon,
  ExternalLinkIcon,
  CalendarIcon,
  ViewIcon,
  ArrowForwardIcon
} from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

export default function Home() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  const { colorMode, toggleColorMode } = useColorMode();

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
        const res = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch APOD: ${res.status}`);
        }

        const data = await res.json();
        setApod(data);
        setViewCount(Math.floor(Math.random() * 5000) + 1000);
      } catch (err) {
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

    const isVideo = apod.media_type === "video";
    const description = apod.explanation || "";
    const shouldTruncate = description.length > 200;
    const displayDescription = showFullDescription || !shouldTruncate ? description : `${description.slice(0, 200)}...`;

    return (
      <VStack spacing={8}>
        <Box bg="bg.card" p={6} rounded="xl" shadow="lg">
          {isVideo ? (
            <AspectRatio ratio={16 / 9}>
              <Box as="iframe" src={apod.url} title={apod.title} allowFullScreen rounded="md" />
            </AspectRatio>
          ) : (
            <Image src={apod.url} alt={apod.title} rounded="md" maxH="500px" objectFit="cover" fallbackSrc="https://via.placeholder.com/800x600?text=Image+Unavailable" />
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
            <Badge colorScheme="teal" px={3} py={1} borderRadius="full">
              <ViewIcon mr={2} /> {viewCount.toLocaleString()} views
            </Badge>
          </HStack>

          <Text fontSize="md" maxW="3xl" color="text.primary">
            {displayDescription}
          </Text>

          {shouldTruncate && (
            <Button variant="link" colorScheme="teal" size="sm" onClick={toggleDescription} rightIcon={<ExternalLinkIcon />}>
              {showFullDescription ? "Show Less" : "Read More"}
            </Button>
          )}

          {apod.copyright && (
            <Text fontSize="sm" color="text.secondary" fontStyle="italic">
              © {apod.copyright}
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
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </HStack>

        <VStack spacing={10} textAlign="center">
          <Heading size="2xl" bgGradient="linear(to-r, teal.400, blue.500)" bgClip="text">
            Welcome to LaunchPoint
          </Heading>
          <Text fontSize="xl" color="text.primary" maxW="600px">
            Explore the universe *** powered by NASA data
          </Text>
          <HStack spacing={4}>
            <Button as={RouterLink} to="/explore" colorScheme="teal" size="lg">
              Start Exploring
            </Button>
            <Button variant="outline" colorScheme="teal" size="lg" as={RouterLink} to="/launches">
              Learn More
            </Button>
          </HStack>
        </VStack>

        <Divider my={12} />

        <Box>{renderAPODContent()}</Box>

        <Divider my={12} />

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <Box bg="bg.card" p={6} rounded="xl" shadow="md" textAlign="center">
            <Text fontSize="lg" mb={2} color="text.primary">Total Images</Text>
            <Heading size="xl" color="brand.primary">{stats.totalImages.toLocaleString()}</Heading>
            <Text fontSize="sm" color="text.secondary">From NASA's archives</Text>
          </Box>
          <Box bg="bg.card" p={6} rounded="xl" shadow="md" textAlign="center">
            <Text fontSize="lg" mb={2} color="text.primary">Daily Visitors</Text>
            <Heading size="xl" color="brand.primary">{stats.dailyVisitors.toLocaleString()}</Heading>
            <Text fontSize="sm" color="text.secondary">Space enthusiasts worldwide</Text>
          </Box>
          <Box bg="bg.card" p={6} rounded="xl" shadow="md" textAlign="center">
            <Text fontSize="lg" mb={2} color="text.primary">Space Events</Text>
            <Heading size="xl" color="brand.primary">{stats.spaceEvents}</Heading>
            <Text fontSize="sm" color="text.secondary">This month</Text>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
