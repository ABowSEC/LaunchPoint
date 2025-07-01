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
  useColorModeValue,
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
import RotatingText from "../components/RotatingText";
import Zoom from 'react-medium-image-zoom'



// Main Home page component
export default function Home() {
  // APOD = Astronomy Picture of the Day
  const [apod, setApod] = useState(null);                 // Holds NASA APOD data
  const [loading, setLoading] = useState(true);          // Controls loading spinner
  const [error, setError] = useState(null);              // Holds fetch errors
  const [showFullDescription, setShowFullDescription] = useState(false); // Toggle for APOD text
  const [viewCount, setViewCount] = useState(0);         // Fake view count for APOD

  const { colorMode, toggleColorMode } = useColorMode(); // Dark/light mode toggle
  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.300");

  // Static stats for the lower cards
  const [stats] = useState({
    totalImages: "Over 10,000",
    dailyVisitors: "DNE",
    spaceEvents: "DNE",
  });

  // Fetch NASA APOD data on page load
  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiKey = import.meta.env.VITE_NASA_API_KEY;
        const res = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        );

        if (!res.ok) throw new Error(`Failed to fetch APOD: ${res.status}`);

        const data = await res.json();
        setApod(data);
        setViewCount(Math.floor(Math.random() * 5000) + 1000); // Simulated views
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAPOD();
  }, []);

  // Expand/collapse description toggle
  const toggleDescription = () =>
    setShowFullDescription((prev) => !prev);

  // Render the APOD card content based on state
  const renderAPODContent = () => {
    if (loading) {
      return (
        <VStack spacing={4} py={10}>
          <Spinner size="xl" color="teal.500" thickness="4px" />
          <Text color="gray.500">Loading today's cosmic wonder...</Text>
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
    const displayDescription = showFullDescription || !shouldTruncate
      ? description
      : `${description.slice(0, 200)}...`;

    return (
      <VStack spacing={8}>
        <Box bg={cardBg} p={6} rounded="xl" shadow="lg" height="auto" overflow="hidden">
          {isVideo ? (
            <AspectRatio ratio={16 / 9}>
              <Box as="iframe" src={apod.url} title={apod.title} allowFullScreen rounded="md" />
            </AspectRatio>
          ) : (
            <Zoom>
              <Image
                src={apod.url}
                alt={apod.title}
                rounded="md"
                maxH="500px"
                objectFit="cover"
                cursor="zoom-in"
                //fallbackSrc=""
            />
            </Zoom>
          )}
        </Box>

        {/* Text + metadata section */}
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

          <Text fontSize="md" maxW="3xl" color={textColor}>
            {displayDescription}
          </Text>

          {shouldTruncate && (
            <Button
              variant="link"
              colorScheme="teal"
              size="sm"
              onClick={toggleDescription}
              rightIcon={<ExternalLinkIcon />}
            >
              {showFullDescription ? "Show Less" : "Read More"}
            </Button>
          )}

          {apod.copyright && (
            <Text fontSize="sm" color="gray.500" fontStyle="italic">
              © {apod.copyright}
            </Text>
          )}
        </VStack>
      </VStack>
    );
  };

  return (
    <Box bg={bg} minH="100vh" py={16} px={6}>
      <Container maxW="7xl">
        {/* Theme toggle button */}
        <HStack justify="space-between" mb={6}>
          <Box />
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </HStack>

        {/* Welcome Section */}
        <VStack spacing={6} textAlign="center">
          <Heading size="2xl" bgGradient="linear(to-r, teal.400, blue.500)" bgClip="text">
            Welcome to LaunchPoint
          </Heading>
          <HStack spacing={2} align="baseline" mb={2}>
          <Text fontSize="2xl" color={textColor} maxW="600px">
            Explore  
          </Text>
          <Box
            as={Badge}
            bg="cyan.300"
            color="black"
            px={7}
            py={2}
            borderRadius={"lg"}
            overflow={"hidden"}
            >
            <RotatingText
              texts={["Planets", "The Stars", "Launches", "Our Universe"]}
              splitBy="words"         //swaps whole words nor chars
              staggerFrom={"first"}  //last first
              staggerDuration={.35} //400 ms per word entry

              initial={{ y:"100%"}}
              animate={{ y:0 }}
              exit={{ y:"-120%" }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              rotationInterval={2500}
            />
          </Box>
          </HStack>
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

        {/* APOD Feature Section */}
        <Box>{renderAPODContent()}</Box>

        <Divider my={12} />

        {/* Stats Section */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <Box bg={cardBg} p={6} rounded="xl" shadow="md" textAlign="center">
            <Text fontSize="lg" mb={2} color={textColor}>Total Images</Text>
            <Heading size="xl" color="teal.500">{stats.totalImages.toLocaleString()}</Heading>
            <Text fontSize="sm" color="gray.500">From NASA's archives</Text>
          </Box>
          <Box bg={cardBg} p={6} rounded="xl" shadow="md" textAlign="center">
            <Text fontSize="lg" mb={2} color={textColor}>Daily Visitors</Text>
            <Heading size="xl" color="teal.500">{stats.dailyVisitors.toLocaleString()}</Heading>
            <Text fontSize="sm" color="gray.500">Space enthusiasts worldwide</Text>
          </Box>
          <Box bg={cardBg} p={6} rounded="xl" shadow="md" textAlign="center">
            <Text fontSize="lg" mb={2} color={textColor}>Space Events</Text>
            <Heading size="xl" color="teal.500">{stats.spaceEvents}</Heading>
            <Text fontSize="sm" color="gray.500">This month</Text>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
