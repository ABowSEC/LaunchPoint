import { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Image,
  Icon,
  Button,
  Collapse,
  Divider,
  Flex,
  Link,
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { FaYoutube, FaRegCalendarPlus, FaGoogle, FaStar } from 'react-icons/fa';
import { motion, useReducedMotion } from 'framer-motion';
import { useUpcomingLaunches } from '../hooks/useUpcomingLaunches';
import { useFavorites } from '../hooks/useFavorites';
import { downloadIcs, googleCalendarUrl } from '../utils/calendar';
import TrackButton from './TrackButton';
import ErrorState from './ErrorState';

const MotionBox = motion(Box);
const MotionImage = motion(Image);

/**
 * Countdown Timer Component
 * Displays real-time countdown to launch
 */
function CountdownTimer({ launchTime }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isLaunched, setIsLaunched] = useState(false);

  useEffect(() => {
    // Returns false once launched so the caller can stop ticking
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const launchDate = new Date(launchTime).getTime();
      const difference = launchDate - now;

      if (difference <= 0) {
        setIsLaunched(true);
        return false;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      return true;
    };

    if (!calculateTimeLeft()) return;

    const timer = setInterval(() => {
      if (!calculateTimeLeft()) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [launchTime]);

  if (isLaunched) {
    return (
      <Badge colorScheme="green" px={3} py={1} borderRadius="full">
        Launched!
      </Badge>
    );
  }

  const units = [
    ...(timeLeft.days > 0 ? [{ value: timeLeft.days, label: "Days" }] : []),
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  // Glowing digit tiles — pad to two figures so the row doesn't jitter.
  return (
    <HStack spacing={2} justify="center" wrap="wrap">
      {units.map(({ value, label }) => (
        <VStack
          key={label}
          spacing={0}
          minW="58px"
          py={2}
          borderRadius="lg"
          bg="bg.elevated"
          border="1px solid"
          borderColor="border.default"
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            lineHeight="1.1"
            fontFamily="mono"
            color="orange.300"
            textShadow="0 0 12px var(--chakra-colors-orange-400)"
          >
            {String(value).padStart(2, "0")}
          </Text>
          <Text fontSize="10px" letterSpacing="wider" textTransform="uppercase" color="text.secondary">
            {label}
          </Text>
        </VStack>
      ))}
    </HStack>
  );
}

/**
 * Launch Status Badge Component
 * Shows the current status of a launch
 */
function LaunchStatusBadge({ status }) {
  const getStatusConfig = (status) => {
    const statusMap = {
      'TBD': { color: 'gray', text: 'To Be Determined' },
      'TBC': { color: 'gray', text: 'To Be Confirmed' },
      'GO': { color: 'green', text: 'Go for Launch' },
      'NO-GO': { color: 'red', text: 'No Go' },
      'SUCCESS': { color: 'green', text: 'Success' },
      'FAILURE': { color: 'red', text: 'Failure' },
      'PARTIAL_FAILURE': { color: 'orange', text: 'Partial Failure' },
      'HOLD': { color: 'yellow', text: 'Hold' },
      'IN_FLIGHT': { color: 'blue', text: 'In Flight' },
      'EXPENDED': { color: 'purple', text: 'Expended' }
    };
    
    return statusMap[status] || { color: 'gray', text: status };
  };

  const config = getStatusConfig(status);
  
  return (
    <Badge colorScheme={config.color} px={3} py={1} borderRadius="full">
      {config.text}
    </Badge>
  );
}

/**
 * Individual Launch Card Component
 */
function LaunchCard({ launch, index = 0, reduceMotion = false }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };
  const getAgencyLogo = (agency) => {
    if (!agency) return "/logos/defaultAgency.jpg";
    const logos = {
      'NASA': "/logos/nasa.jpg",
      'SpaceX': "/logos/spacex.jpeg",
      'ULA': "/logos/ula.jpg",
      'ESA': "/logos/esa.jpg",
      'JAXA': "/logos/jaxa.jpg",
      'Russian Federal Space Agency (ROSCOSMOS)': "/logos/Roscosmos.jpg",
      'China Aerospace Science and Technology Corporation': "/logos/casc.jpg",
      'Blue Origin': "/logos/blueorigin.jpg",
    };
    return logos[agency] || "/logos/defaultAgency.jpg";
  };

  return (
    <MotionBox
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: (index % 2) * 0.08 }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      bg="bg.card"
      border="1px solid"
      borderColor="border.default"
      borderRadius="xl"
      overflow="hidden"
      shadow="md"
      position="relative"
      role="group"
      _hover={{
        shadow: "0 12px 32px -12px var(--chakra-colors-blue-500)",
        borderColor: "blue.400",
      }}
    >
      {/* Gradient accent rail across the top */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="3px"
        bgGradient="linear(to-r, teal.400, blue.400, purple.400)"
        zIndex={3}
      />

      {/* Hero: full-bleed mission image with the identity overlaid on a scrim.
          Falls back to a brand gradient when the API gives us no image. */}
      <Box position="relative" h={{ base: "210px", md: "230px" }} overflow="hidden">
        {launch.image ? (
          <MotionImage
            src={launch.image}
            alt={launch.name}
            w="100%"
            h="100%"
            objectFit="cover"
            fallback={<Box h="100%" bgGradient="linear(to-br, blue.900, purple.900)" />}
            transition="transform 0.7s ease"
            _groupHover={reduceMotion ? undefined : { transform: "scale(1.06)" }}
          />
        ) : (
          <Box h="100%" w="100%" bgGradient="linear(to-br, blue.900, purple.900)" />
        )}

        {/* Scrim so overlaid text stays legible over any image */}
        <Box
          position="absolute"
          inset={0}
          bg="linear-gradient(to bottom, rgba(11,17,32,0.15) 0%, rgba(11,17,32,0.15) 45%, rgba(11,17,32,0.92) 100%)"
        />

        {/* Track + status, top-right */}
        <HStack position="absolute" top={3} right={3} spacing={2} zIndex={2}>
          <TrackButton launch={launch} />
          <LaunchStatusBadge status={launch.status?.name} />
        </HStack>

        {/* Identity, bottom-left */}
        <HStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={4}
          spacing={3}
          align="flex-end"
          zIndex={2}
        >
          <Box
            bg="whiteAlpha.900"
            borderRadius="lg"
            p={1.5}
            boxShadow="0 2px 8px rgba(0,0,0,0.4)"
            flexShrink={0}
          >
            <Image
              src={getAgencyLogo(launch.launch_service_provider?.name)}
              alt={`${launch.launch_service_provider?.name ?? 'Agency'} logo`}
              boxSize="44px"
              objectFit="contain"
              fallbackSrc="/logos/defaultAgency.jpg"
            />
          </Box>
          <VStack align="start" spacing={0.5} flex={1} minW={0}>
            <Text
              fontSize="lg"
              fontWeight="bold"
              color="white"
              lineHeight="1.2"
              noOfLines={2}
              textShadow="0 1px 6px rgba(0,0,0,0.7)"
            >
              {launch.name}
            </Text>
            <Text fontSize="sm" color="whiteAlpha.800" noOfLines={1}>
              {launch.launch_service_provider?.name || 'Unknown Agency'}
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Body */}
      <VStack spacing={4} align="stretch" p={6}>
        {/* Countdown Timer */}
        <Box textAlign="center" py={4}>
          <Text fontSize="sm" color="text.secondary" mb={2}>
            Launch Window Opens
          </Text>
          <CountdownTimer launchTime={launch.window_start} />
        </Box>

        {/* Basic Info */}
        <SimpleGrid columns={[1, 2]} spacing={4}>
          <Box>
            <Text fontSize="sm" color="text.secondary">Launch Date</Text>
            <Text fontWeight="medium">{formatDate(launch.window_start)}</Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="text.secondary">Launch Site</Text>
            <Text fontWeight="medium">{launch.pad?.name || 'TBD'}</Text>
            {launch.pad?.location?.name && (
              <Text fontSize="xs" color="text.secondary" mt={0.5}>
                {launch.pad.location.name}
              </Text>
            )}
          </Box>
        </SimpleGrid>

        <Button
          size="sm"
          variant="ghost"
          alignSelf="center"
          onClick={() => setIsExpanded(!isExpanded)}
          rightIcon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        >
          {isExpanded ? 'Less detail' : 'More detail'}
        </Button>

        {/* Expanded Details */}
        <Collapse in={isExpanded}>
          <VStack spacing={4} align="stretch" pt={4}>
            <Divider />
            
            {launch.mission?.description && (
              <Box>
                <Text fontSize="sm" color="text.secondary" mb={2}>Mission Description</Text>
                <Text fontSize="md" lineHeight="1.6">
                  {launch.mission.description}
                </Text>
              </Box>
            )}

            <SimpleGrid columns={[1, 2]} spacing={4}>
              {launch.rocket?.configuration?.name && (
                <Box>
                  <Text fontSize="sm" color="text.secondary">Rocket</Text>
                  <Text fontWeight="medium">{launch.rocket.configuration.name}</Text>
                </Box>
              )}
              
              {launch.mission?.orbit?.name && (
                <Box>
                  <Text fontSize="sm" color="text.secondary">Target Orbit</Text>
                  <Text fontWeight="medium">{launch.mission.orbit.name}</Text>
                </Box>
              )}
            </SimpleGrid>

            {launch.mission?.type && (
              <Box>
                <Text fontSize="sm" color="text.secondary">Mission Type</Text>
                <Text fontWeight="medium">{launch.mission.type}</Text>
              </Box>
            )}

            <HStack spacing={3} wrap="wrap">
              {launch.pad?.map_url && (
                <Button
                  as={Link}
                  href={launch.pad.map_url}
                  isExternal
                  size="sm"
                  leftIcon={<ExternalLinkIcon />}
                  colorScheme="teal"
                  variant="outline"
                >
                  View on Map
                </Button>
              )}

              {launch.vid_urls?.length > 0 && (
                <Button
                  as={Link}
                  href={launch.vid_urls[0].url}
                  isExternal
                  size="sm"
                  leftIcon={<Icon as={FaYoutube} />}
                  colorScheme="red"
                  variant="outline"
                >
                  Watch Live
                </Button>
              )}

              <Button
                size="sm"
                leftIcon={<Icon as={FaRegCalendarPlus} />}
                colorScheme="orange"
                variant="outline"
                onClick={() => downloadIcs(launch)}
              >
                Add to Calendar
              </Button>

              <Button
                as={Link}
                href={googleCalendarUrl(launch)}
                isExternal
                size="sm"
                leftIcon={<Icon as={FaGoogle} />}
                colorScheme="blue"
                variant="outline"
              >
                Google Calendar
              </Button>
            </HStack>
          </VStack>
        </Collapse>
      </VStack>
    </MotionBox>
  );
}

/**
 * Main LaunchFeed Component
 */
function LaunchFeed() {
  const { launches: allLaunches, loading, error, refetch } = useUpcomingLaunches();
  const { favorites } = useFavorites();
  const [filter, setFilter] = useState('all');
  const reduceMotion = useReducedMotion();

  const tracked = allLaunches.filter((l) => favorites.includes(l.id));
  const launches = filter === 'tracked' ? tracked : allLaunches.slice(0, 10);

  if (loading) {
    return (
      <VStack spacing={6} py={10}>
        <Spinner size="xl" color="blue.400" thickness="4px" />
        <Text color="text.secondary">Loading upcoming launches...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Error loading launches!"
        message={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* All / Tracked filter */}
      <HStack spacing={2}>
        <Button
          size="sm"
          variant={filter === 'all' ? 'solid' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          size="sm"
          variant={filter === 'tracked' ? 'solid' : 'outline'}
          colorScheme="orange"
          leftIcon={<Icon as={FaStar} boxSize={3} />}
          onClick={() => setFilter('tracked')}
        >
          Tracked{tracked.length > 0 ? ` (${tracked.length})` : ''}
        </Button>
      </HStack>

      {launches.length === 0 ? (
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          <AlertTitle>
            {filter === 'tracked' ? 'No tracked launches' : 'No upcoming launches found'}
          </AlertTitle>
          <AlertDescription>
            {filter === 'tracked'
              ? 'Star a launch to follow it here and get countdown alerts.'
              : 'Check back later for new launch schedules.'}
          </AlertDescription>
        </Alert>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {launches.map((launch, index) => (
            <LaunchCard
              key={launch.id}
              launch={launch}
              index={index}
              reduceMotion={reduceMotion}
            />
          ))}
        </SimpleGrid>
      )}

      <Box textAlign="center" pt={4}>
        <Text fontSize="sm" color="text.secondary">
          Showing {launches.length} {filter === 'tracked' ? 'tracked' : 'upcoming'} launches · Data from The Space Devs API
        </Text>
      </Box>
    </VStack>
  );
}

export default LaunchFeed;
