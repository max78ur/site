import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
export function Truck({ animate = true }) {
    const truckRef = useRef(null);
    const bobOffset = useMemo(() => Math.random() * Math.PI * 2, []);
    useFrame((state) => {
        if (!truckRef.current || !animate)
            return;
        const time = state.clock.getElapsedTime();
        truckRef.current.position.y = Math.sin(time * 2 + bobOffset) * 0.05;
        truckRef.current.rotation.z = Math.sin(time * 2 + bobOffset) * 0.005;
    });
    const red = 0xb91c1c;
    const black = 0x020202;
    const white = 0xffffff;
    const gray = 0x444444;
    const chrome = 0xaaaaaa;
    return (<group ref={truckRef} position={[0, 1.2, 0]} rotation={[0, -0.15, 0]}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 6]}/>
        <meshStandardMaterial color={0x000000} transparent opacity={0.25} depthWrite={false}/>
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[4.5, 0.5, 10]}/>
        <meshStandardMaterial color={black} roughness={0.9}/>
      </mesh>
      {[-1, 1].map((side) => (<mesh key={side} position={[side * 1.9, 0.45, -3]}>
          <cylinderGeometry args={[0.35, 0.35, 2, 12, 1, true]}/>
          <meshStandardMaterial color={chrome} roughness={0.2} metalness={0.8}/>
        </mesh>))}
      <mesh position={[-1.5, 1.4, 1]}>
        <boxGeometry args={[3.2, 1.4, 3.2]}/>
        <meshStandardMaterial color={red} roughness={0.4} metalness={0.1}/>
      </mesh>
      <mesh position={[-1.5, 2.25, 1]}>
        <boxGeometry args={[3.2, 0.9, 2.6]}/>
        <meshStandardMaterial color={black} roughness={0.7}/>
      </mesh>
      <mesh position={[-1.5, 1.9, 2.75]}>
        <planeGeometry args={[2.6, 1.6]}/>
        <meshStandardMaterial color={0x111111} transparent opacity={0.25} metalness={0.8} roughness={0.1} side={THREE.DoubleSide}/>
      </mesh>
      {[-1, 1].map((side) => (<mesh key={side} position={[side * 1.75, 1.9, 1]} rotation={[0, 0, (side * Math.PI) / 2]}>
          <planeGeometry args={[2.6, 1.2]}/>
          <meshStandardMaterial color={0x222222} transparent opacity={0.3} metalness={0.8} roughness={0.1}/>
        </mesh>))}
      <mesh position={[-1.5, 1.35, 3.15]}>
        <planeGeometry args={[2.2, 0.6]}/>
        <meshStandardMaterial color={black} roughness={0.9}/>
      </mesh>
      <mesh position={[-1.5, 0.95, 3.5]}>
        <boxGeometry args={[2.6, 0.25, 0.6]}/>
        <meshStandardMaterial color={chrome} roughness={0.2} metalness={0.9}/>
      </mesh>
      {[-0.4, 0.4].map((x) => (<mesh key={x} position={[x - 1.5, 2.0, 0.5]}>
          <cylinderGeometry args={[0.12, 0.12, 1.2, 10]}/>
          <meshStandardMaterial color={chrome} roughness={0.2} metalness={0.9}/>
        </mesh>))}
      {[-1, 1].map((side) => [
            (<mesh key={`rear-${side}-a`} position={[side * 2.1, 0.85, -4.2]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.75, 0.75, 0.9, 24]}/>
            <meshStandardMaterial color={black} roughness={0.9}/>
          </mesh>),
            (<mesh key={`rear-${side}-b`} position={[side * 2.1, 0.85, -5.2]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.75, 0.75, 0.9, 24]}/>
            <meshStandardMaterial color={black} roughness={0.9}/>
          </mesh>),
            (<mesh key={`hub-${side}-a`} position={[side * 2.1, 0.85, -4.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 1, 12]}/>
            <meshStandardMaterial color={chrome} roughness={0.2} metalness={0.9}/>
          </mesh>),
            (<mesh key={`hub-${side}-b`} position={[side * 2.1, 0.85, -5.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 1, 12]}/>
            <meshStandardMaterial color={chrome} roughness={0.2} metalness={0.9}/>
          </mesh>),
        ])}
      {[-1, 1].map((side) => (<>
          <mesh key={`front-${side}`} position={[side * 1.75, 0.85, 2.1]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.65, 0.65, 0.7, 24]}/>
            <meshStandardMaterial color={black} roughness={0.9}/>
          </mesh>
          <mesh key={`front-hub-${side}`} position={[side * 1.75, 0.85, 2.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.8, 12]}/>
            <meshStandardMaterial color={chrome} roughness={0.2} metalness={0.9}/>
          </mesh>
        </>))}
      <group position={[2.8, 0.6, -2]}>
        <mesh>
          <boxGeometry args={[8, 2.2, 18]}/>
          <meshStandardMaterial color={white} roughness={0.5}/>
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[8, 0.4, 18]}/>
          <meshStandardMaterial color={black} roughness={0.9}/>
        </mesh>
        <mesh position={[0, 1.6, 0]}>
          <boxGeometry args={[8.1, 0.15, 18.1]}/>
          <meshStandardMaterial color={red}/>
        </mesh>
        <mesh position={[4.1, 0.6, 0]}>
          <planeGeometry args={[2.2, 2.2]}/>
          <meshStandardMaterial color={white} roughness={0.5}/>
        </mesh>
        <mesh position={[4.15, 0.6, 0]}>
          <boxGeometry args={[2.3, 2.3, 0.1]}/>
          <meshStandardMaterial color={gray} roughness={0.8}/>
        </mesh>
        {[-1, 1].map((side) => (<mesh key={side} position={[side * 3.6, 0.1, -7]} rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[1.2, 1.6]}/>
            <meshStandardMaterial color={black} roughness={0.9}/>
          </mesh>))}
      </group>
      <mesh position={[0.1, 1.1, -2.5]} rotation={[0, 0, 0.05]}>
        <planeGeometry args={[5, 1.2]}/>
        <meshStandardMaterial color={red} emissive={red} emissiveIntensity={0.5}/>
      </mesh>
    </group>);
}
