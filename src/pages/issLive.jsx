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
  Spinner
} from "@chakra-ui/react";

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
    fetchISS();
    const interval = setInterval(fetchISS, 5000);
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
        {loading || !issData ? (
          <Spinner size="xl" color="brand.primary" />
        ) : (
          <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={6}>
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
