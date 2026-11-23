import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import { Vector3 } from 'three';
import { Highway } from './Highway';
import { Truck } from './Truck';

function CameraMotion({ reducedMotion }: { reducedMotion: boolean }) {
  const target = useMemo(() => new Vector3(), []);

  useFrame(({ camera, clock, size }) => {
    const portrait = size.width < 700;
    const time = reducedMotion ? 0 : clock.getElapsedTime();
    const cameraX = (portrait ? 2.8 : 6.1) + Math.sin(time * 0.18) * 0.22;

    camera.position.lerp(
      target.set(cameraX, portrait ? 3.8 : 4.7, portrait ? 17.4 : 15.8),
      0.025,
    );
    camera.lookAt(0, portrait ? 1.15 : 1.35, -2.6);
  });

  return null;
}

export function TruckScene({ className = '' }: { className?: string }) {
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);

    mediaQuery.addEventListener('change', updateMotionPreference);
    return () => mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  return (
    <div className={`h-full w-full ${className}`}>
      <Canvas
        dpr={[1, 1.3]}
        frameloop={reducedMotion ? 'demand' : 'always'}
        camera={{ position: [6.1, 4.7, 15.8], fov: 36 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <fog attach="fog" args={['#111419', 22, 72]} />
        <ambientLight intensity={0.92} color="#dce3ed" />
        <directionalLight position={[5, 9, 10]} intensity={3} color="#f4e3c2" />
        <directionalLight position={[-6, 6, 5]} intensity={1.3} color="#dbe8ff" />
        <directionalLight position={[5, 6, -8]} intensity={1.4} color="#a82a32" />
        <pointLight position={[0.9, 1.55, 3.1]} intensity={1.4} distance={5} color="#ffd78d" />
        <CameraMotion reducedMotion={reducedMotion} />
        <Highway animate={!reducedMotion} />
        <Truck animate={!reducedMotion} />
      </Canvas>
    </div>
  );
}
