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
  useColorModeValue
} from "@chakra-ui/react";

// Embeds YouTube ISS live stream in an iframe
function ISSVideoFeed() {
  return (
    <Box
      as="iframe"
      title="ISS Live Feed"
      src="https://www.youtube.com/embed/86YLFOog4GM?autoplay=1&mute=1"
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

// Main component for the ISS Live View page
export default function ISSLivePage() {
  const [issData, setIssData] = useState(null); // Holds real-time ISS telemetry data
  const [loading, setLoading] = useState(true); // Controls loading state

  // Fetches ISS position data from public API
  useEffect(() => {
    const fetchISS = async () => {
      try {
        const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
        const data = await res.json();
        setIssData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch ISS data", err);
      }
    };

    fetchISS(); // Initial fetch on page load
    const interval = setInterval(fetchISS, 5000); // Update data every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <Box px={8} py={10} maxW="6xl" mx="auto">
      {/* Page Title and Description */}
      <Heading size="xl" textAlign="center" mb={6}>
        International Space Station — Live Feed & Telemetry
      </Heading>
      <Text fontSize="md" color="gray.500" textAlign="center" mb={10}>
        Watch the ISS live and track real-time stats such as its altitude, speed, and coordinates.
      </Text>

      {/* Live Video Feed */}
      <ISSVideoFeed />

      {/* Real-Time Stats */}
      <Box mt={10}>
        <Heading size="md" mb={4}>
          Real-Time ISS Telemetry
        </Heading>

        {loading || !issData ? (
          <Spinner size="xl" color="teal.500" />
        ) : (
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
            gap={6}
          >
            {/* Each stat below shows a live value */}
            <GridItem>
              <Stat>
                <StatLabel>Latitude</StatLabel>
                <StatNumber>{issData.latitude.toFixed(2)}°</StatNumber>
              </Stat>
            </GridItem>
            <GridItem>
              <Stat>
                <StatLabel>Longitude</StatLabel>
                <StatNumber>{issData.longitude.toFixed(2)}°</StatNumber>
              </Stat>
            </GridItem>
            <GridItem>
              <Stat>
                <StatLabel>Altitude</StatLabel>
                <StatNumber>{issData.altitude.toFixed(2)} km</StatNumber>
              </Stat>
            </GridItem>
            <GridItem>
              <Stat>
                <StatLabel>Velocity</StatLabel>
                <StatNumber>{issData.velocity.toFixed(2)} km/h</StatNumber>
              </Stat>
            </GridItem>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
