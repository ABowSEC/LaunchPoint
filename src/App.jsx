import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useLocation,
} from 'react-router-dom';
import {
  Box,
  Flex,
  Link,
  Spacer,
  Container,
  Text,
} from '@chakra-ui/react';
import { Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Home from './pages/Home';
import LaunchPage from './pages/LaunchPage';
import MarsPage from './pages/MarsPage';
import ExplorePage from './pages/ExplorePage';
import SolarSimPage from './pages/SolarSimPage';
import ISSLivePage from './pages/issLive';
import ChatBotDrawer from './components/ChatBotDrawer';
import StarField from './components/StarField';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  enter:   { opacity: 1, y: 0  },
  exit:    { opacity: 0, y: -8 },
};

const pageTransition = {
  enter: { duration: 0.22, ease: 'easeOut' },
  exit:  { duration: 0.15, ease: 'easeIn'  },
};

const navigationItems = [
  { path: '/',         label: 'Home' },
  { path: '/launches', label: 'Launches' },
  { path: '/mars',     label: 'Mars' },
  { path: '/explore',  label: 'Explore' },
  { path: '/solarsim', label: 'Solar System' },
  { path: '/iss',      label: 'ISS' },
];

function Navigation() {
  const location = useLocation();

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={100}
      borderBottom="1px solid"
      borderColor="border.default"
      backdropFilter="blur(16px)"
      bg="rgba(6, 9, 26, 0.80)"
    >
      <Container maxW="7xl">
        <Flex as="nav" align="center" h="56px" gap={1}>
          <Link
            as={RouterLink}
            to="/"
            fontWeight="700"
            fontSize="sm"
            letterSpacing="widest"
            textTransform="uppercase"
            color="brand.400"
            _hover={{ textDecoration: 'none', color: 'brand.300' }}
            mr={6}
          >
            LaunchPoint
          </Link>

          {navigationItems.map(({ path, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                as={RouterLink}
                to={path}
                px={3}
                py={1}
                borderRadius="md"
                fontSize="sm"
                fontWeight={isActive ? '600' : '400'}
                color={isActive ? 'white' : 'text.secondary'}
                bg={isActive ? 'whiteAlpha.100' : 'transparent'}
                _hover={{
                  textDecoration: 'none',
                  color: 'white',
                  bg: 'whiteAlpha.50',
                }}
                transition="all 0.15s"
              >
                {label}
              </Link>
            );
          })}

          <Spacer />
          <ChatBotDrawer />
        </Flex>
      </Container>
    </Box>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={pageTransition.enter}
      >
        <Suspense fallback={<Text color="text.secondary" p={10}>Loading...</Text>}>
          <Routes location={location}>
            <Route path="/"          element={<Home />} />
            <Route path="/explore"   element={<ExplorePage />} />
            <Route path="/launches"  element={<LaunchPage />} />
            <Route path="/mars"      element={<MarsPage />} />
            <Route path="/iss"       element={<ISSLivePage />} />
            <Route path="/solarsim"  element={<SolarSimPage />} />
            <Route
              path="*"
              element={
                <Box textAlign="center" py={20}>
                  <Text fontSize="2xl" mb={4} color="text.primary">Page Not Found</Text>
                  <Link as={RouterLink} to="/" color="brand.primary">
                    Return to Home
                  </Link>
                </Box>
              }
            />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Box minH="100vh" bg="bg.body">
        <StarField />
        <Box position="relative" zIndex={1}>
          <Navigation />
          <Box as="main">
            <AnimatedRoutes />
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
