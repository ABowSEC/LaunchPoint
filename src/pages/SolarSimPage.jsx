import { Box, Heading, VStack } from '@chakra-ui/react';
import SolarSystemView from '../components/SolarSystemView';

export default function SolarSimPage() {
  return (
    <VStack spacing={6} py={10}>
      <Heading as="h1" size="2xl" color="teal.600">
        3D Solar System Viewer
      </Heading>
      <Box width="100%">
        <SolarSystemView />
      </Box>
    </VStack>
  );
}
