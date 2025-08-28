import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

function ISSVideoFeed() {
  return (
    <Box
      as="iframe"
      title="ISS Live Feed"
      src="https://www.youtube.com/embed/H999s0P1Er0?autoplay=1&mute=1"
      width="100%"
      height="500px"
      border="0"
      allowFullScreen
      borderRadius="md"
      shadow="md"
      backgroundColor="black"
    />
  );
}

export default function ISSLivePage() {
  const [issData, setIssData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchISS = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const res = await fetch("http://api.open-notify.org/iss-now.json", {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        } else if (res.status >= 500) {
          throw new Error("ISS API service temporarily unavailable.");
        } else {
          throw new Error(`API Error: ${res.status}`);
        }
      }
      
      const data = await res.json();
      setIssData(data);
      setLoading(false);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error("Failed to fetch ISS data", err);
      
      let errorMessage = "Failed to fetch ISS data";
      if (err.name === 'AbortError') {
        errorMessage = "Request timed out. ISS API may be experiencing issues.";
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = "Network error. ISS API service may be down.";
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
      setRetryCount(prev => prev + 1);
      
      // Set fallback data if API fails
      if (!issData) {
        setIssData({
          latitude: 0,
          longitude: 0,
          altitude: 408,
          velocity: 27600,
          timestamp: Date.now()
        });
      }
    }
  };

  useEffect(() => {
    fetchISS();
    const interval = setInterval(fetchISS, 30000); // Increased to 30 seconds to reduce load and minimize API calls
    return () => clearInterval(interval);
  }, []);

  return (
    <Box bg="bg.body" px={8} py={10} maxW="6xl" mx="auto">
      <Heading size="xl" textAlign="center" mb={6} bgGradient="linear(to-r, cyan.400, blue.500)" bgClip="text">
        International Space Station Live Feed
      </Heading>
      <Text fontSize="md" color="text.secondary" textAlign="center" mb={10}>
        Watch the ISS live and track real-time stats such as its altitude, speed, and coordinates.
      </Text>

      <ISSVideoFeed />

      <Box mt={10}>
        <Heading size="md" mb={4}>
          Real-Time ISS Telemetry
        </Heading>
        
        {error && (
          <Alert status="warning" mb={4} borderRadius="md">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>API Service Issue</AlertTitle>
              <AlertDescription>
                {error} Showing last known data or estimated values.
                {retryCount > 0 && ` (Attempt ${retryCount})`}
              </AlertDescription>
            </Box>
            <Button
              leftIcon={<RepeatIcon />}
              size="sm"
              onClick={fetchISS}
              colorScheme="blue"
              variant="outline"
              isLoading={loading}
            >
              Retry
            </Button>
          </Alert>
        )}
        
        {loading ? (
          <Spinner size="xl" color="brand.primary" />
        ) : (
          <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={6}>
            <GridItem>
              <Stat>
                <StatLabel>Latitude</StatLabel>
                <StatNumber>{issData?.latitude?.toFixed(2) || "0.00"}°</StatNumber>
              </Stat>
            </GridItem>
            <GridItem>
              <Stat>
                <StatLabel>Longitude</StatLabel>
                <StatNumber>{issData?.longitude?.toFixed(2) || "0.00"}°</StatNumber>
              </Stat>
            </GridItem>
            <GridItem>
              <Stat>
                <StatLabel>Altitude</StatLabel>
                <StatNumber>{issData?.altitude?.toFixed(2) || "408.00"} km</StatNumber>
              </Stat>
            </GridItem>
            <GridItem>
              <Stat>
                <StatLabel>Velocity</StatLabel>
                <StatNumber>{issData?.velocity?.toFixed(2) || "27600.00"} km/h</StatNumber>
              </Stat>
            </GridItem>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
