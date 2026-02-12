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
  Tooltip,
  Button,
  useColorMode,
  Collapse,
  Divider,
  Link,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText
} from "@chakra-ui/react";
import {
  TimeIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
  InfoIcon
} from "@chakra-ui/icons";

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
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const launchDate = new Date(launchTime).getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setIsLaunched(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [launchTime]);

{/*Graphics could be added*/}
  if (isLaunched) {
    return (
      <Badge colorScheme="green" px={3} py={1} borderRadius="full">
         Launched!
      </Badge>
    );
  }
  {/*ADD FINAL COUNTDOWN EFFECTS FOR end of timer display*/}
  return (
    <HStack spacing={2} wrap="wrap">
      {timeLeft.days > 0 && (
        <Stat textAlign="center" minW="60px">
          <StatNumber fontSize="lg" color="orange.400">{timeLeft.days}</StatNumber>
          <StatLabel fontSize="xs">Days</StatLabel>
        </Stat>
      )}
      <Stat textAlign="center" minW="60px">
        <StatNumber fontSize="lg" color="orange.400">{timeLeft.hours}</StatNumber>
        <StatLabel fontSize="xs">Hours</StatLabel>
      </Stat>
      <Stat textAlign="center" minW="60px">
        <StatNumber fontSize="lg" color="orange.400">{timeLeft.minutes}</StatNumber>
        <StatLabel fontSize="xs">Min</StatLabel>
      </Stat>
      <Stat textAlign="center" minW="60px">
        <StatNumber fontSize="lg" color="orange.400">{timeLeft.seconds}</StatNumber>
        <StatLabel fontSize="xs">Sec</StatLabel>
      </Stat>
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
function LaunchCard({ launch }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { colorMode } = useColorMode();

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
//CHANGE IMAGES TO WEBP (more efficent than jpg)
  const getAgencyLogo = (agency) => {
    if (!agency) return "/logos/defaultAgency.jpg"
    const logos = {
      'NASA': "/logos/nasa.jpg",
      'SpaceX':"/logos/spacex.jpeg",
      'ULA': "/logos/ula.jpg",
      'ESA': "/logos/esa.jpg",
      'JAXA': "/logos/jaxa.jpg",
      'Russian Federal Space Agency (ROSCOSMOS)': "/logos/Roscosmos.jpg",
      'China Aerospace Science and Technology Corporation' : "/logos/casc.jpg",
      'Blue Origin' : "/logos/blueorigin.jpg"
    };
    return logos[agency] || "/logos/defaultAgency";
  };

  return (
    <Box
      bg="bg.card"
      border="1px solid"
      borderColor="border.default"
      borderRadius="xl"
      p={6}
      shadow="md"
      _hover={{
        shadow: "lg",
        transform: "translateY(-2px)",
        borderColor: "blue.300"
      }}
      transition="all 0.3s ease"
    >
      {/* Header */}
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={2} flex={1}>
            <HStack spacing={3}>

              
              <Image   
                src={getAgencyLogo(launch.launch_service_provider?.name)} 
                alt={'${launch.launch_service_provider?.name} logo'} 
                boxSize="60px" objectFit="contain" 
                fallbackSrc= "/logos/defaultAgency.jpg"
        
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/logos/defaultAgency.jpg"

                }}/> 
    
              <VStack align="start" spacing={1}>
                <Text fontSize="lg" fontWeight="bold" color="text.primary">
                  {launch.name}
                </Text>
                <Text fontSize="sm" color="text.secondary">
                  {launch.launch_service_provider?.name || 'Unknown Agency'}
                </Text>
              </VStack>
            </HStack>
          </VStack>
          
          <VStack align="end" spacing={2}>
            <LaunchStatusBadge status={launch.status?.name} />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              rightIcon={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </VStack>
        </HStack>

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
            <Text fontWeight="medium">
              {launch.pad?.name || 'TBD'}
            </Text>
          </Box>
        </SimpleGrid>

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

            {/* External Links */}
            <HStack spacing={3}>
              {launch.url && (
                <Button
                  size="sm"
                  leftIcon={<ExternalLinkIcon />}
                  onClick={() => window.open(launch.url, '_blank')}
                  colorScheme="blue"
                  variant="outline"
                >
                  Mission Details
                </Button>
              )}
              
              {launch.pad?.url && (
                <Button
                  size="sm"
                  leftIcon={<InfoIcon />}
                  onClick={() => window.open(launch.pad.url, '_blank')}
                  colorScheme="teal"
                  variant="outline"
                >
                  Launch Site
                </Button>
              )}
            </HStack>
          </VStack>
        </Collapse>
      </VStack>
    </Box>
  );
}

/**
 * Main LaunchFeed Component
 */
function LaunchFeed() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //GET LAUNCH DATA
  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("https://ll.thespacedevs.com/2.2.0/launch/upcoming/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setLaunches(data.results.slice(0, 10)); // Show more launches
      } catch (err) {
        console.error('Error fetching launches:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchLaunches, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <VStack spacing={6} py={10}>
        <Spinner size="xl" color="blue.400" thickness="4px" />
        <Text color="text.secondary">Loading upcoming launches...</Text>
      </VStack>
    );
  }
  {/*Error Catching/*/}
  if (error) {
    return (
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        <Box>
          <AlertTitle>Error loading launches!</AlertTitle>
          <AlertDescription>
            {error}. Please try refreshing the page.
          </AlertDescription>
        </Box>
      </Alert>
    );
  }

  if (launches.length === 0) {
    return (
      <Alert status="info" borderRadius="lg">
        <AlertIcon />
        <AlertTitle>No upcoming launches found</AlertTitle>
        <AlertDescription>
          Check back later for new launch schedules.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {launches.map((launch) => (
          <LaunchCard key={launch.id} launch={launch} />
        ))}
      </SimpleGrid>
      
      <Box textAlign="center" pt={4}>
        <Text fontSize="sm" color="text.secondary">
          Showing {launches.length} upcoming launches *** Data from The Space Devs API
        </Text>
      </Box>
    </VStack>
  );
}

export default LaunchFeed;
