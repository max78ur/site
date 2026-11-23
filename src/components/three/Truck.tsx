import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { MathUtils, type Group } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

function Wheel({ x, z }: { x: number; z: number }) {
  const outerSide = x > 0 ? Math.PI / 2 : -Math.PI / 2;

  return (
    <group
      position={[x, 0.53, z]}
      rotation={[0, 0, outerSide]}
    >
      <mesh>
        <cylinderGeometry args={[0.48, 0.48, 0.34, 24]} />
        <meshStandardMaterial color="#111214" roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.035, 20]} />
        <meshStandardMaterial color="#aeb2b4" metalness={0.88} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.205, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
        <meshStandardMaterial color="#d5d7d6" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function Truck({ animate = true }: { animate?: boolean }) {
  const truckRef = useRef<Group>(null);
  const hoodGeometry = useMemo(
    () => new RoundedBoxGeometry(2.42, 0.88, 1.35, 0.11, 3),
    [],
  );
  const cabGeometry = useMemo(
    () => new RoundedBoxGeometry(2.42, 1.54, 1.78, 0.12, 3),
    [],
  );
  const roofGeometry = useMemo(
    () => new RoundedBoxGeometry(2.5, 0.2, 1.95, 0.08, 3),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!truckRef.current || !animate) return;
    const time = clock.getElapsedTime();
    truckRef.current.position.y = 0.02 + Math.sin(time * 1.8) * 0.018;
    truckRef.current.position.z = Math.sin(time * 0.28) * 0.12;
    truckRef.current.rotation.y = -0.035 + Math.sin(time * 0.22) * 0.018;
    truckRef.current.rotation.z = MathUtils.damp(
      truckRef.current.rotation.z,
      Math.sin(time * 1.8) * 0.003,
      3,
      delta,
    );
  });

  return (
    <group ref={truckRef} position={[0, 0.02, 0]} scale={1.12}>
      <mesh position={[0, 0.015, -2.7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.8, 15]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.32} />
      </mesh>

      <mesh position={[0, 0.79, -2.5]}>
        <boxGeometry args={[1.65, 0.38, 7.3]} />
        <meshStandardMaterial color="#292b2d" metalness={0.55} roughness={0.62} />
      </mesh>

      <group position={[0, 0, -5.3]}>
        <mesh position={[0, 2.08, 0]}>
          <boxGeometry args={[2.75, 2.72, 7.9]} />
          <meshStandardMaterial color="#e7e7e4" metalness={0.34} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.79, 0]}>
          <boxGeometry args={[2.82, 0.16, 8]} />
          <meshStandardMaterial color="#252629" metalness={0.4} roughness={0.52} />
        </mesh>
        <mesh position={[1.39, 2.1, 0]}>
          <boxGeometry args={[0.025, 0.045, 7.28]} />
          <meshStandardMaterial color="#b69254" metalness={0.72} roughness={0.32} />
        </mesh>
        <mesh position={[1.405, 1.28, 0]}>
          <boxGeometry args={[0.035, 0.13, 7.4]} />
          <meshStandardMaterial color="#b71922" metalness={0.22} roughness={0.42} />
        </mesh>
        <mesh position={[0, 2.08, 3.98]}>
          <boxGeometry args={[2.76, 2.7, 0.08]} />
          <meshStandardMaterial color="#d8d9d7" metalness={0.28} roughness={0.44} />
        </mesh>
        <mesh position={[0, 2.05, 4.04]}>
          <boxGeometry args={[1.32, 2.15, 0.04]} />
          <meshStandardMaterial color="#282a2d" metalness={0.5} roughness={0.4} />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.83, 2.05, 4.075]}>
            <boxGeometry args={[0.035, 2.12, 0.035]} />
            <meshStandardMaterial color="#aa8a52" metalness={0.72} roughness={0.32} />
          </mesh>
        ))}
        {[0, 1, 2].map((index) => (
          <mesh key={index} position={[0, 1.05 + index * 0.34, 4.1]}>
            <boxGeometry args={[1.1, 0.035, 0.035]} />
            <meshStandardMaterial color="#aeb2b4" metalness={0.82} roughness={0.3} />
          </mesh>
        ))}
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 1.23, 0.23, 3.25]}>
              <boxGeometry args={[0.07, 0.27, 0.12]} />
              <meshStandardMaterial
                color="#a91a20"
                emissive="#a91a20"
                emissiveIntensity={0.38}
              />
            </mesh>
            <Wheel x={side * 1.24} z={3.1} />
          </group>
        ))}
        {[-1, 1].map((side) => (
          <Wheel key={side} x={side * 1.24} z={-2.95} />
        ))}
      </group>

      <mesh position={[0, 1.05, -0.85]}>
        <boxGeometry args={[1.52, 0.36, 4.2]} />
        <meshStandardMaterial color="#202225" metalness={0.56} roughness={0.55} />
      </mesh>

      <group>
        <mesh geometry={hoodGeometry} position={[0, 1.08, 1.55]}>
          <meshStandardMaterial color="#99131b" metalness={0.48} roughness={0.28} />
        </mesh>
        <mesh geometry={cabGeometry} position={[0, 2.03, 0.43]}>
          <meshStandardMaterial color="#c11c24" metalness={0.28} roughness={0.3} />
        </mesh>
        <mesh geometry={roofGeometry} position={[0, 2.84, 0.45]}>
          <meshStandardMaterial color="#a5141c" metalness={0.32} roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.35, 1.35]} rotation={[-0.18, 0, 0]}>
          <boxGeometry args={[2.05, 0.68, 0.055]} />
          <meshStandardMaterial
            color="#141b22"
            metalness={0.64}
            roughness={0.18}
            transparent
            opacity={0.92}
          />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 1.225, 2.16, 0.42]}>
              <boxGeometry args={[0.045, 0.76, 0.82]} />
              <meshStandardMaterial
                color="#12171d"
                metalness={0.6}
                roughness={0.2}
                transparent
                opacity={0.9}
              />
            </mesh>
            <mesh position={[side * 1.235, 1.26, 0.38]}>
              <boxGeometry args={[0.04, 0.055, 0.88]} />
              <meshStandardMaterial color="#d3b473" metalness={0.72} roughness={0.28} />
            </mesh>
            <mesh position={[side * 1.48, 2.2, 1.13]}>
              <boxGeometry args={[0.42, 0.08, 0.1]} />
              <meshStandardMaterial color="#b5b8b8" metalness={0.86} roughness={0.22} />
            </mesh>
            <mesh position={[side * 1.65, 2.18, 1.27]}>
              <boxGeometry args={[0.08, 0.42, 0.08]} />
              <meshStandardMaterial color="#45494b" metalness={0.68} roughness={0.4} />
            </mesh>
            <mesh position={[side * 1.2, 2.06, -0.7]}>
              <cylinderGeometry args={[0.075, 0.075, 1.22, 10]} />
              <meshStandardMaterial color="#afb3b4" metalness={0.82} roughness={0.24} />
            </mesh>
            <mesh position={[side * 1.2, 0.98, 1.38]}>
              <boxGeometry args={[0.06, 0.24, 0.09]} />
              <meshStandardMaterial color="#bd2028" metalness={0.4} roughness={0.3} />
            </mesh>
            <Wheel x={side * 1.24} z={1.35} />
            <mesh position={[side * 0.91, 1.22, 2.25]}>
              <boxGeometry args={[0.4, 0.3, 0.08]} />
              <meshStandardMaterial
                color="#f4d18c"
                emissive="#ffb63d"
                emissiveIntensity={1.15}
                metalness={0.18}
                roughness={0.22}
              />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 1.01, 2.27]}>
          <boxGeometry args={[1.18, 0.56, 0.08]} />
          <meshStandardMaterial color="#25282a" metalness={0.75} roughness={0.3} />
        </mesh>
        {[0, 1, 2, 3].map((index) => (
          <mesh key={index} position={[0, 0.84 + index * 0.12, 2.32]}>
            <boxGeometry args={[1.02, 0.025, 0.04]} />
            <meshStandardMaterial color="#a9adae" metalness={0.84} roughness={0.26} />
          </mesh>
        ))}
        <mesh position={[0, 0.56, 2.31]}>
          <boxGeometry args={[2.58, 0.2, 0.28]} />
          <meshStandardMaterial color="#aeb2b3" metalness={0.86} roughness={0.25} />
        </mesh>
      </group>
    </group>
  );
}
