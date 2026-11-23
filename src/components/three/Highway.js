import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMemo } from 'react';
export function Highway() {
    const roadGroup = useMemo(() => new THREE.Group(), []);
    useFrame((state) => {
        roadGroup.position.y += 0.05;
        if (roadGroup.position.y > 0.5)
            roadGroup.position.y = -1;
    });
    const dividerMeshes = [1, -1].map((side) => {
        return (<mesh key={side} position={[side * 0.6, 0.02, 0]}>
        <planeGeometry args={[0.3, 400]}/>
        <meshStandardMaterial color="#e5e5e5" emissive="#333333"/>
      </mesh>);
    });
    const dashMeshes = Array.from({ length: 40 }).map((_, i) => {
        return (<mesh key={i} position={[0, 0.025, -200 + i * 10]}>
        <planeGeometry args={[0.3, 6]}/>
        <meshStandardMaterial color="#ffffff" emissive="#555555"/>
      </mesh>);
    });
    const barrierMeshes = [-1, 1].map((side) => {
        return (<mesh key={side} position={[side * 10.5, 1, 0]}>
        <boxGeometry args={[0.5, 2, 400]}/>
        <meshStandardMaterial color="#2a2a2a" roughness={0.9}/>
      </mesh>);
    });
    return (<group ref={roadGroup} position={[0, 0.01, 0]}>
      <mesh>
        <planeGeometry args={[200, 400]}/>
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.1}/>
      </mesh>
      {dividerMeshes}
      {dashMeshes}
      {barrierMeshes}
    </group>);
}
