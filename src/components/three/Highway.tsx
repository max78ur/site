import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';

const lanePositions = [-2.35, 2.35];

export function Highway({ animate = true }: { animate?: boolean }) {
  const markingsRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!animate || !markingsRef.current) return;

    markingsRef.current.children.forEach((marking) => {
      marking.position.z += delta * 11;
      if (marking.position.z > 18) marking.position.z = -91;
    });
  });

  return (
    <group>
      <mesh position={[0, -0.15, -28]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[160, 150]} />
        <meshStandardMaterial color="#1b201d" roughness={1} />
      </mesh>
      <mesh position={[0, -0.035, -28]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 150]} />
        <meshStandardMaterial color="#242629" roughness={0.88} metalness={0.08} />
      </mesh>

      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 6.7, -0.012, -28]}>
            <boxGeometry args={[0.12, 0.025, 150]} />
            <meshStandardMaterial color="#ddd6c6" emissive="#6c6250" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[side * 7.7, 0.35, -28]}>
            <boxGeometry args={[0.18, 0.65, 150]} />
            <meshStandardMaterial color="#575b5d" metalness={0.72} roughness={0.38} />
          </mesh>
          {Array.from({ length: 16 }, (_, index) => (
            <mesh
              key={index}
              position={[side * 7.7, 0.16, -88 + index * 8]}
            >
              <boxGeometry args={[0.28, 0.38, 0.16]} />
              <meshStandardMaterial color="#9b9d9b" metalness={0.68} roughness={0.36} />
            </mesh>
          ))}
        </group>
      ))}

      <group ref={markingsRef}>
        {Array.from({ length: 14 }, (_, index) =>
          lanePositions.map((x) => (
            <mesh key={`${index}-${x}`} position={[x, -0.012, -88 + index * 8]}>
              <boxGeometry args={[0.13, 0.025, 3.2]} />
              <meshStandardMaterial
                color="#e7e2d6"
                emissive="#8b8068"
                emissiveIntensity={0.22}
                roughness={0.46}
              />
            </mesh>
          )),
        )}
      </group>
    </group>
  );
}
