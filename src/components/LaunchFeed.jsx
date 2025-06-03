import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

function LaunchFeed() {
  const [launches, setLaunches] = useState([]);

  useEffect(() => {
    fetch("https://ll.thespacedevs.com/2.2.0/launch/upcoming/")
      .then(res => res.json())
      .then(data => {
        setLaunches(data.results.slice(0, 5));
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
          <Text fontWeight="bold">{launch.name}</Text>
          <Text fontSize="sm">{new Date(launch.window_start).toLocaleString()}</Text>
        </Box>
      ))}
    </Box>
  );
}

export default LaunchFeed;
