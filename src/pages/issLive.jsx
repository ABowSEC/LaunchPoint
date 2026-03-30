import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Divider,
  VStack,
  HStack,
  Badge
} from "@chakra-ui/react";
import { RepeatIcon, TimeIcon } from "@chakra-ui/icons";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

// ── ISS marker icon ───────────────────────────────────────────────────────────
const issIcon = L.divIcon({
  html: '<div style="font-size:30px;line-height:1;filter:drop-shadow(0 0 6px #63b3ed);">🛰️</div>',
  className: "",
  iconAnchor: [15, 15],
});

// ── Keeps map centred on the ISS as it moves ──────────────────────────────────
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true });
  }, [lat, lng, map]);
  return null;
}

// ── Live map component ────────────────────────────────────────────────────────
function ISSMap({ lat, lng, positions }) {
  if (lat === null || lng === null) return null;
  return (
    <Box
      borderRadius="xl"
      overflow="hidden"
      border="1px solid"
      borderColor="border.default"
      shadow="lg"
    >
      <MapContainer
        center={[lat, lng]}
        zoom={3}
        style={{ height: "420px", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CartoDB</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {positions.length > 1 && (
          <Polyline positions={positions} color="#63B3ED" weight={2} opacity={0.7} />
        )}
        <Marker position={[lat, lng]} icon={issIcon} />
        <RecenterMap lat={lat} lng={lng} />
      </MapContainer>
    </Box>
  );
}

// ── YouTube live feed ─────────────────────────────────────────────────────────
// NASA ISS HD Earth Viewing Experiment — live stream from cameras aboard the ISS
function ISSVideoFeed() {
  return (
    <Box
      as="iframe"
      title="ISS Live Feed"
      src="https://www.youtube.com/embed/P9C25Un7xaM?autoplay=1&mute=1"
      width="100%"
      height="500px"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      borderRadius="xl"
      shadow="md"
      backgroundColor="black"
    />
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ISSLivePage() {
  const [issData, setIssData] = useState(null);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchISS = async () => {
    try {
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544", {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 429) throw new Error("Rate limit exceeded. Please try again shortly.");
        else if (res.status >= 500) throw new Error("ISS API temporarily unavailable.");
        else throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();
      setIssData(data);
      setLastUpdated(new Date());
      setRetryCount(0);
      setLoading(false);

      // Append to ground track, cap at 90 positions (~7.5 min at 5s intervals)
      setPositions(prev => {
        const next = [...prev, [data.latitude, data.longitude]];
        return next.length > 90 ? next.slice(-90) : next;
      });
    } catch (err) {
      console.error("Failed to fetch ISS data", err);

      let msg = "Failed to fetch ISS data.";
      if (err.name === "AbortError") msg = "Request timed out. ISS API may be experiencing issues.";
      else if (err.message.includes("Failed to fetch")) msg = "Network error. Check your connection.";
      else msg = err.message;

      setError(msg);
      setLoading(false);
      setRetryCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    fetchISS();
    const interval = setInterval(fetchISS, 5000); // 5 s — ISS moves ~40 km per interval
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) =>
    date?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) ?? "—";

  return (
    <Container maxW="6xl" py={10}>
      <VStack spacing={8} align="stretch">

        {/* Header */}
        <Box textAlign="center">
          <Heading
            size="2xl"
            bgGradient="linear(to-r, cyan.400, blue.500)"
            bgClip="text"
            mb={3}
          >
            International Space Station
          </Heading>
          <Text fontSize="md" color="text.secondary" maxW="2xl" mx="auto">
            Live position tracking, real-time telemetry, and onboard video feed.
            The ISS orbits Earth every ~92 minutes at ~28,000 km/h.
          </Text>
        </Box>

        <Divider borderColor="border.default" />

        {/* Telemetry cards */}
        <Box
          bg="bg.card"
          border="1px solid"
          borderColor="border.default"
          borderRadius="xl"
          p={6}
        >
          <HStack justify="space-between" mb={4} align="center">
            <Heading size="sm" color="text.primary">Real-Time Telemetry</Heading>
            <HStack spacing={3}>
              {lastUpdated && (
                <HStack spacing={1}>
                  <TimeIcon color="text.secondary" boxSize={3} />
                  <Text fontSize="xs" color="text.secondary">
                    Updated {formatTime(lastUpdated)}
                  </Text>
                </HStack>
              )}
              <Badge colorScheme="green" variant="subtle" px={2} py={1} borderRadius="full">
                Live
              </Badge>
            </HStack>
          </HStack>

          {error && (
            <Alert status="warning" mb={4} borderRadius="md">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle>API Issue</AlertTitle>
                <AlertDescription>
                  {error}
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
                ml={3}
              >
                Retry
              </Button>
            </Alert>
          )}

          {loading && !issData ? (
            <HStack justify="center" py={6}>
              <Spinner size="xl" color="blue.400" thickness="4px" />
              <Text color="text.secondary">Acquiring ISS position…</Text>
            </HStack>
          ) : (
            <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={6}>
              <GridItem>
                <Stat>
                  <StatLabel color="text.secondary">Latitude</StatLabel>
                  <StatNumber color="cyan.400">{issData?.latitude?.toFixed(4) ?? "—"}°</StatNumber>
                  <StatHelpText>{issData?.latitude >= 0 ? "North" : "South"}</StatHelpText>
                </Stat>
              </GridItem>
              <GridItem>
                <Stat>
                  <StatLabel color="text.secondary">Longitude</StatLabel>
                  <StatNumber color="cyan.400">{issData?.longitude?.toFixed(4) ?? "—"}°</StatNumber>
                  <StatHelpText>{issData?.longitude >= 0 ? "East" : "West"}</StatHelpText>
                </Stat>
              </GridItem>
              <GridItem>
                <Stat>
                  <StatLabel color="text.secondary">Altitude</StatLabel>
                  <StatNumber color="orange.400">{issData?.altitude?.toFixed(1) ?? "—"}</StatNumber>
                  <StatHelpText>km above Earth</StatHelpText>
                </Stat>
              </GridItem>
              <GridItem>
                <Stat>
                  <StatLabel color="text.secondary">Velocity</StatLabel>
                  <StatNumber color="orange.400">{issData?.velocity?.toFixed(0) ?? "—"}</StatNumber>
                  <StatHelpText>km/h</StatHelpText>
                </Stat>
              </GridItem>
            </Grid>
          )}
        </Box>

        {/* Live map */}
        <Box>
          <Heading size="sm" color="text.primary" mb={3}>Live Ground Track</Heading>
          {issData ? (
            <ISSMap
              lat={issData.latitude}
              lng={issData.longitude}
              positions={positions}
            />
          ) : (
            <Box
              h="420px"
              bg="bg.card"
              borderRadius="xl"
              border="1px solid"
              borderColor="border.default"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Spinner size="xl" color="blue.400" thickness="4px" />
            </Box>
          )}
          <Text fontSize="xs" color="text.secondary" mt={2} textAlign="right">
            Blue trail = last 7.5 min of orbital path · Map auto-centres every 5 s
          </Text>
        </Box>

        {/* Video feed */}
        <Box>
          <Heading size="sm" color="text.primary" mb={3}>Live Video Feed</Heading>
          <ISSVideoFeed />
        </Box>

      </VStack>
    </Container>
  );
}
