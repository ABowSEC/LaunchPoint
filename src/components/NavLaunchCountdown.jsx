import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, HStack, Text, Icon } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FaRocket } from 'react-icons/fa';

const pulseGlow = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`;

function useCountdown(launchTime) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!launchTime) return;

    const tick = () => {
      const diff = new Date(launchTime).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft(null); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ d, h, m, s });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [launchTime]);

  return timeLeft;
}

function formatCountdown({ d, h, m, s }) {
  if (d > 0) return `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

export default function NavLaunchCountdown() {
  const [nextLaunch, setNextLaunch] = useState(null);
  const [loading, setLoading] = useState(true);
  const timeLeft = useCountdown(nextLaunch?.window_start);

  useEffect(() => {
    const fetchNext = async () => {
      try {
        const res = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1');
        if (!res.ok) {
          console.warn('NavLaunchCountdown: API returned', res.status);
          return;
        }
        const data = await res.json();
        if (data.results?.[0]) {
          setNextLaunch(data.results[0]);
        }
      } catch (err) {
        console.warn('NavLaunchCountdown: fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNext();
    const id = setInterval(fetchNext, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const name = nextLaunch?.name ?? null;

  const countdownText = timeLeft
    ? formatCountdown(timeLeft)
    : loading
    ? '...'
    : null;

  // Only hide if we've finished loading and got nothing back
  if (!loading && !nextLaunch) return null;

  return (
    <Box
      as={RouterLink}
      to="/launches"
      display="flex"
      alignItems="center"
      px={3}
      py={1}
      borderRadius="full"
      border="1px solid"
      borderColor="orange.700"
      bg="rgba(251,146,60,0.08)"
      _hover={{ bg: 'rgba(251,146,60,0.16)', borderColor: 'orange.500', textDecoration: 'none' }}
      transition="all 0.2s"
      cursor="pointer"
    >
      <HStack spacing={2}>
        <Icon
          as={FaRocket}
          color="orange.400"
          boxSize={3}
          animation={`${pulseGlow} 2s ease-in-out infinite`}
        />

        {name && (
          <Text
            fontSize="xs"
            color="orange.300"
            fontWeight="medium"
            display={{ base: 'none', lg: 'block' }}
            maxW="200px"
            isTruncated
          >
            {name}
          </Text>
        )}

        {countdownText && (
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="orange.400"
            fontFamily="mono"
            letterSpacing="wide"
          >
            {countdownText}
          </Text>
        )}
      </HStack>
    </Box>
  );
}
