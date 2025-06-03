import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { Box, Flex, Link, Spacer, Container } from '@chakra-ui/react';
import Home from './pages/Home';
import LaunchPage from './pages/LaunchPage';
import MarsPage from './pages/MarsPage';

function App() {
  return (
    <Router>
      {/* Navbar */}
      <Box bg="gray.800" px={4} py={3} shadow="md">
        <Flex as="nav" align="center" gap={6}>
          <Link as={RouterLink} to="/" fontWeight="bold" color="teal.300" _hover={{ textDecoration: 'underline' }}>
            Home
          </Link>
          <Link as={RouterLink} to="/launches" color="white" _hover={{ color: 'teal.200' }}>
            Launch Tracker
          </Link>
          <Link as={RouterLink} to="/mars" color="white" _hover={{ color: 'teal.200' }}>
            Mars Photos
          </Link>
          <Spacer />
        </Flex>
      </Box>

      {/* Page Content */}
      <Container maxW="6xl" py={10}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/launches" element={<LaunchPage />} />
          <Route path="/mars" element={<MarsPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
