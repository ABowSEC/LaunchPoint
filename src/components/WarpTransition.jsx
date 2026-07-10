import { useEffect, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

const streakAnim = keyframes`
  0%   { transform: scaleX(0); opacity: 0; }
  15%  { opacity: 1; }
  100% { transform: scaleX(1); opacity: 0; }
`;

const flashAnim = keyframes`
  0%   { opacity: 0; }
  60%  { opacity: 0.85; }
  100% { opacity: 0; }
`;

const STREAK_COUNT = 28;
const DURATION_MS = 750;

// Full-screen "jump to warp" flourish, played before navigating to the
// solar system easter egg. Self-dismisses via onFinished after DURATION_MS
// (or immediately if the user prefers reduced motion).
export default function WarpTransition({ onFinished }) {
  const streaks = useMemo(
    () =>
      Array.from({ length: STREAK_COUNT }, (_, i) => ({
        angle: (360 / STREAK_COUNT) * i + (Math.random() * 8 - 4),
        length: 60 + Math.random() * 35,
        delay: Math.random() * 0.12,
      })),
    []
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const timer = setTimeout(onFinished, prefersReducedMotion ? 0 : DURATION_MS);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <Box position="fixed" inset={0} zIndex={2000} pointerEvents="none" overflow="hidden">
      {streaks.map((s, i) => (
        <Box
          key={i}
          position="absolute"
          top="50%"
          left="50%"
          w={`${s.length}vmax`}
          h="2px"
          bgGradient="linear(to-r, transparent, brand.200, white)"
          transformOrigin="left center"
          transform={`rotate(${s.angle}deg)`}
          sx={{
            '@media (prefers-reduced-motion: no-preference)': {
              animation: `${streakAnim} ${DURATION_MS}ms ease-out ${s.delay}s both`,
            },
          }}
        />
      ))}
      <Box
        position="absolute"
        inset={0}
        bg="white"
        sx={{
          '@media (prefers-reduced-motion: no-preference)': {
            animation: `${flashAnim} ${DURATION_MS}ms ease-in both`,
          },
        }}
      />
    </Box>
  );
}
