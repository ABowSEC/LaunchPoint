import { useEffect, useState } from "react";
import { 
  Box, 
  Image, 
  Text, 
  Spinner, 
  Heading, 
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  VStack,
  AspectRatio
} from "@chakra-ui/react";

export default function Home() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiKey = import.meta.env.VITE_NASA_API_KEY;
        if (!apiKey) {
          throw new Error('NASA API key not found. Please check your environment variables.');
        }

        const res = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        );
        
        if (!res.ok) {
          throw new Error(`Failed to fetch APOD: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        
        // Handle NASA API error responses
        if (data.error) {
          throw new Error(data.error.message || 'NASA API returned an error');
        }
        
        setApod(data);
      } catch (err) {
        console.error('Error fetching APOD:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAPOD();
  }, []);

  const handleRetry = () => {
    setError(null);
    setApod(null);
    const fetchAPOD = async () => {
      try {
        setLoading(true);
        const apiKey = import.meta.env.VITE_NASA_API_KEY;
        const res = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        );
        
        if (!res.ok) {
          throw new Error(`Failed to fetch APOD: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error.message || 'NASA API returned an error');
        }
        
        setApod(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAPOD();
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <VStack spacing={4}>
          <Spinner size="xl" color="teal.500" thickness="4px" />
          <Text color="gray.600">Loading today's astronomy picture...</Text>
        </VStack>
      );
    }

    if (error) {
      return (
        <Alert status="error" borderRadius="md" maxW="600px" mx="auto">
          <AlertIcon />
          <Box>
            <AlertTitle>Unable to load content</AlertTitle>
            <AlertDescription display="block" mt={2}>
              {error}
            </AlertDescription>
            <Button 
              mt={4} 
              colorScheme="red" 
              variant="outline" 
              size="sm"
              onClick={handleRetry}
            >
              Try Again
            </Button>
          </Box>
        </Alert>
      );
    }

    if (!apod) {
      return (
        <Text color="gray.600">No content available</Text>
      );
    }

    const isVideo = apod.media_type === 'video';
    const description = apod.explanation || '';
    const shouldTruncate = description.length > 180;
    const displayDescription = showFullDescription || !shouldTruncate
      ? description
      : `${description.slice(0, 180)}...`;

    return (
      <VStack spacing={6} maxW="800px" mx="auto">
        {isVideo ? (
          <AspectRatio ratio={16/9} width="100%" maxW="600px">
            <Box
              as="iframe"
              src={apod.url}
              title={apod.title}
              borderRadius="md"
              allowFullScreen
            />
          </AspectRatio>
        ) : (
          <Image
            src={apod.url}
            alt={apod.title}
            maxH="500px"
            width="100%"
            objectFit="contain"
            borderRadius="md"
            shadow="lg"
            fallback={
              <Box 
                height="400px" 
                bg="gray.100" 
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="gray.500">Image failed to load</Text>
              </Box>
            }
          />
        )}
        
        <VStack spacing={4} textAlign="center">
          <Heading as="h2" size="lg" color="gray.800">
            {apod.title}
          </Heading>
          
          {apod.date && (
            <Text fontSize="sm" color="gray.500">
              {new Date(apod.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          )}
          
          <Box maxW="600px">
            <Text fontSize="md" lineHeight="1.6" color="gray.700">
              {displayDescription}
            </Text>
            
            {shouldTruncate && (
              <Button
                variant="link"
                colorScheme="teal"
                size="sm"
                mt={2}
                onClick={toggleDescription}
              >
                {showFullDescription ? 'Show Less' : 'Read More'}
              </Button>
            )}
          </Box>

          {apod.copyright && (
            <Text fontSize="xs" color="gray.500" fontStyle="italic">
              © {apod.copyright}
            </Text>
          )}
        </VStack>
      </VStack>
    );
  };

  return (
    <Box p={8} textAlign="center" minH="60vh">
      <VStack spacing={8}>
        <Box>
          <Heading as="h1" size="2xl" mb={4} color="gray.800">
            Welcome to LaunchPoint
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="500px" mx="auto">
            Explore the universe — powered by NASA data.
          </Text>
        </Box>

        <Box width="100%">
          <Heading as="h2" size="lg" mb={6} color="teal.600">
            Astronomy Picture of the Day
          </Heading>
          {renderContent()}
        </Box>
      </VStack>
    </Box>
  );
}