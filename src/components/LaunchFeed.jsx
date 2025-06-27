import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

// LaunchFeed component fetches and displays upcoming space launches
function LaunchFeed() {
  const [launches, setLaunches] = useState([]); // Store upcoming launches

  // Fetch upcoming launches once on component mount
  useEffect(() => {
    fetch("https://ll.thespacedevs.com/2.2.0/launch/upcoming/")
      .then(res => res.json())
      .then(data => {
        setLaunches(data.results.slice(0, 5)); // Limit to first 5 launches
      });
  }, []);

  return (
    <Box>
      {launches.map((launch) => (
        <Box
          key={launch.id}
          p={4}
          borderWidth="1px"
          borderRadius="md"
          bg="gray.700"
          color="white"
        >
          {/* Launch name */}
          <Text fontWeight="bold">{launch.name}</Text>
          {/* Local date/time of launch window start */}
          <Text fontSize="sm">
            {new Date(launch.window_start).toLocaleString()}
          </Text>
        </Box>
      ))}
    </Box>
  );
}

export default LaunchFeed;
