import { Box, Heading, VStack } from '@chakra-ui/react';
import SolarSystemView from '../components/SolarSystemView';

export default function SolarSimPage() {
  return (
    <Box bg="bg.body">
      <VStack spacing={6} py={10}>
        <Heading as="h1" size="2xl" bgGradient="linear(to-r, purple.400, pink.500)" bgClip="text">
          3D Solar System Viewer
        </Heading>
        <Box width="100%">
          <SolarSystemView />
        </Box>
      </VStack>
    </Box>
  );
}
