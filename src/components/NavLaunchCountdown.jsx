import { Link as RouterLink } from 'react-router-dom';
import { Box, HStack, Text, Icon } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FaRocket } from 'react-icons/fa';
import { useUpcomingLaunches } from '../hooks/useUpcomingLaunches';
import { useCountdown } from '../hooks/useCountdown';

const pulseGlow = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`;

function formatCountdown({ d, h, m, s }) {
  if (d > 0) return `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

export default function NavLaunchCountdown() {
  // Errors are deliberately not rendered: the badge is decorative, so on
  // failure we keep showing the last good launch or hide entirely.
  const { launches, loading } = useUpcomingLaunches();
  const nextLaunch = launches[0] ?? null;
  const timeLeft = useCountdown(nextLaunch?.window_start);

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
      flexShrink={0}
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
            whiteSpace="nowrap"
          >
            {countdownText}
          </Text>
        )}
      </HStack>
    </Box>
  );
}
