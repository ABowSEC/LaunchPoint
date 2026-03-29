import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

// Three depth layers — gives a subtle parallax sense of depth
const LAYERS = [
  { count: 120, rMin: 0.2, rMax: 0.6,  speedMin: 0.015, speedMax: 0.04,  opacityMin: 0.15, opacityMax: 0.45 }, // distant
  { count: 60,  rMin: 0.6, rMax: 1.1,  speedMin: 0.04,  speedMax: 0.08,  opacityMin: 0.35, opacityMax: 0.65 }, // mid
  { count: 20,  rMin: 1.1, rMax: 1.8,  speedMin: 0.08,  speedMax: 0.14,  opacityMin: 0.55, opacityMax: 0.85 }, // close
];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function buildStars(w, h) {
  const stars = [];
  for (const layer of LAYERS) {
    for (let i = 0; i < layer.count; i++) {
      stars.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(layer.rMin, layer.rMax),
        speed: rand(layer.speedMin, layer.speedMax),
        baseOpacity: rand(layer.opacityMin, layer.opacityMax),
        twinkleSpeed: rand(0.004, 0.012),
        twinklePhase: rand(0, Math.PI * 2),
        // Occasional blue tint for variety
        hue: Math.random() < 0.15 ? `200, 220, 255` : `255, 255, 255`,
      });
    }
  }
  return stars;
}

export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let frame = 0;
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = buildStars(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      for (const star of stars) {
        const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinklePhase) * 0.18;
        const alpha = Math.max(0, Math.min(1, star.baseOpacity + twinkle));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.hue}, ${alpha})`;
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height + 2) {
          star.y = -2;
          star.x = rand(0, canvas.width);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <Box
      as="canvas"
      ref={canvasRef}
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      zIndex={0}
      pointerEvents="none"
    />
  );
}
