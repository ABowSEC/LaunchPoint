import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Container,
  HStack,
  Icon,
  Badge,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FaRocket, FaMapMarkerAlt, FaSatellite } from "react-icons/fa";
import LaunchFeed from "../components/LaunchFeed";

const STATUS_COLORS = {
  "Go for Launch": "green",
  "To Be Confirmed": "yellow",
  "To Be Determined": "gray",
  "Launch Successful": "green",
  "Launch Failure": "red",
  "On Hold": "orange",
};

const pulseAnim = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`;

function useCountdown(launchTime) {
  const [t, setT] = useState(null);

  useEffect(() => {
    if (!launchTime) return;
    const tick = () => {
      const diff = new Date(launchTime) - Date.now();
      if (diff <= 0) { setT(null); return; }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [launchTime]);

  return t;
}

function CountdownBlock({ value, label }) {
  return (
    <VStack spacing={0} align="center">
      <Box
        bg="rgba(251,146,60,0.08)"
        border="1px solid"
        borderColor="orange.800"
        rounded="lg"
        px={{ base: 3, md: 4 }}
        py={{ base: 2, md: 3 }}
        minW={{ base: "56px", md: "72px" }}
        textAlign="center"
      >
        <Text
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="bold"
          fontFamily="mono"
          color="orange.300"
          lineHeight="1"
        >
          {String(value).padStart(2, "0")}
        </Text>
      </Box>
      <Text
        fontSize="9px"
        color="text.secondary"
        letterSpacing="widest"
        mt={1.5}
        fontWeight="semibold"
        textTransform="uppercase"
      >
        {label}
      </Text>
    </VStack>
  );
}

function CountdownSeparator() {
  return (
    <Text
      color="orange.700"
      fontSize={{ base: "xl", md: "3xl" }}
      fontFamily="mono"
      mb={4}
      userSelect="none"
    >
      :
    </Text>
  );
}

export default function LaunchPage() {
  const [nextLaunch, setNextLaunch] = useState(null);
  const [loading, setLoading] = useState(true);
  const countdown = useCountdown(nextLaunch?.window_start);

  useEffect(() => {
    const fetchLaunch = async () => {
      try {
        const res = await fetch("https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1");
        if (!res.ok) return;
        const data = await res.json();
        if (data.results?.[0]) setNextLaunch(data.results[0]);
      } catch (e) {
        console.warn("LaunchPage hero fetch failed", e);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunch();
    const id = setInterval(fetchLaunch, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const launchDate = nextLaunch?.window_start
    ? new Date(nextLaunch.window_start).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : null;

  const statusColor = STATUS_COLORS[nextLaunch?.status?.name] ?? "gray";

  return (
    <Container maxW="8xl" py={8}>
      <VStack spacing={8} align="stretch">

        {/* Hero — Next Launch */}
        <Box position="relative" rounded="2xl" overflow="hidden" minH="300px">

          {/* Blurred mission image background */}
          {nextLaunch?.image && (
            <Box
              position="absolute"
              inset={0}
              bgImage={`url(${nextLaunch.image})`}
              bgSize="cover"
              bgPos="center"
              filter="brightness(0.45) saturate(0.9)"
              transform="scale(1.06)"
            />
          )}

          {/* Dark gradient overlay — heavier on the left so text is legible */}
          <Box
            position="absolute"
            inset={0}
            bgGradient="linear(to-r, rgba(6,9,26,0.95) 25%, rgba(6,9,26,0.6) 55%, rgba(6,9,26,0.2))"
          />

          {/* Bottom vignette */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            h="80px"
            bgGradient="linear(to-t, rgba(6,9,26,0.9), transparent)"
          />

          {/* Hero content */}
          <Flex
            position="relative"
            p={{ base: 6, md: 10 }}
            minH="300px"
            align="center"
            justify="space-between"
            gap={{ base: 8, md: 12 }}
            direction={{ base: "column", lg: "row" }}
          >

            {/* Left — launch info */}
            <VStack
              align={{ base: "center", lg: "start" }}
              spacing={4}
              flex={1}
              maxW={{ lg: "540px" }}
            >
              {/* Label row */}
              <HStack spacing={2}>
                <Icon
                  as={FaRocket}
                  color="orange.400"
                  boxSize="10px"
                  animation={`${pulseAnim} 2s ease-in-out infinite`}
                />
                <Text
                  fontSize="10px"
                  color="orange.400"
                  fontWeight="bold"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                >
                  Next Launch
                </Text>
                {nextLaunch?.status?.name && (
                  <>
                    <Text color="whiteAlpha.300" fontSize="xs">·</Text>
                    <Badge
                      colorScheme={statusColor}
                      variant="subtle"
                      fontSize="10px"
                      px={2}
                      py={0.5}
                      rounded="full"
                    >
                      {nextLaunch.status.name}
                    </Badge>
                  </>
                )}
              </HStack>

              {/* Mission name */}
              <Heading
                as="h1"
                size={{ base: "xl", md: "2xl" }}
                color="text.primary"
                lineHeight="1.15"
                textAlign={{ base: "center", lg: "left" }}
              >
                {loading
                  ? "Loading…"
                  : (nextLaunch?.name ?? "No upcoming launches")}
              </Heading>

              {/* Details */}
              <VStack align={{ base: "center", lg: "start" }} spacing={1.5}>
                {nextLaunch?.launch_service_provider?.name && (
                  <HStack color="text.secondary" fontSize="sm" spacing={2}>
                    <Icon as={FaSatellite} boxSize={3} flexShrink={0} />
                    <Text>{nextLaunch.launch_service_provider.name}</Text>
                    {nextLaunch.rocket?.configuration?.name && (
                      <>
                        <Text color="whiteAlpha.300">·</Text>
                        <Text color="text.primary" fontWeight="medium">
                          {nextLaunch.rocket.configuration.name}
                        </Text>
                      </>
                    )}
                  </HStack>
                )}

                {nextLaunch?.pad?.location?.name && (
                  <HStack color="text.secondary" fontSize="sm" spacing={2}>
                    <Icon as={FaMapMarkerAlt} boxSize={3} flexShrink={0} />
                    <Text>{nextLaunch.pad.location.name}</Text>
                  </HStack>
                )}

                {launchDate && (
                  <Text
                    fontSize="xs"
                    color="text.secondary"
                    fontFamily="mono"
                    letterSpacing="wide"
                    mt={1}
                  >
                    {launchDate}
                  </Text>
                )}
              </VStack>
            </VStack>

            {/* Right — countdown */}
            <VStack spacing={3} align="center" flexShrink={0}>
              <Text
                fontSize="10px"
                color="text.secondary"
                letterSpacing="0.18em"
                textTransform="uppercase"
                fontWeight="semibold"
              >
                Time to Launch
              </Text>

              {loading ? (
                <Spinner color="orange.400" size="xl" thickness="3px" />
              ) : countdown ? (
                <HStack spacing={1} align="flex-start">
                  <CountdownBlock value={countdown.d} label="Days" />
                  <CountdownSeparator />
                  <CountdownBlock value={countdown.h} label="Hrs" />
                  <CountdownSeparator />
                  <CountdownBlock value={countdown.m} label="Min" />
                  <CountdownSeparator />
                  <CountdownBlock value={countdown.s} label="Sec" />
                </HStack>
              ) : (
                <Badge
                  colorScheme="green"
                  px={5}
                  py={2}
                  fontSize="sm"
                  rounded="full"
                  variant="subtle"
                >
                  Launched!
                </Badge>
              )}
            </VStack>

          </Flex>
        </Box>

        {/* Upcoming Launches feed */}
        <Box>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading
                as="h2"
                size="lg"
                color="text.primary"
                mb={2}
                textAlign={{ base: "center", md: "left" }}
              >
                Upcoming Launches
              </Heading>
              <Text
                color="text.secondary"
                fontSize="md"
                textAlign={{ base: "center", md: "left" }}
              >
                Latest information from global space agencies and launch providers
              </Text>
            </Box>

            <LaunchFeed />
          </VStack>
        </Box>

        {/* Footer note */}
        <Box
          bg="bg.card"
          p={4}
          borderRadius="md"
          border="1px solid"
          borderColor="border.default"
          textAlign="center"
        >
          <Text fontSize="sm" color="text.secondary">
            Launch times are subject to change due to weather, technical issues, or range conflicts ·
            All times in your local timezone · Updated automatically
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}
