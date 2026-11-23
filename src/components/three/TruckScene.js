import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, SpotLight } from '@react-three/drei';
import { Highway } from './Highway';
import { Truck } from './Truck';
export function TruckScene({ className = '' }) {
    return (<div className={`relative w-full h-full ${className}`}>
      <Canvas shadows camera={{ position: [0, 6, 12], fov: 45 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <ambientLight intensity={0.6} color="#ffffff"/>
        <SpotLight position={[5, 10, 8]} angle={0.45} penumbra={0.6} intensity={2.5} color="#ffffff" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}/>
        <SpotLight position={[-5, 8, 8]} angle={0.45} penumbra={0.6} intensity={2} color="#b91c1c" castShadow/>
        <pointLight position={[0, 5, -5]} intensity={1.5} color="#ffffff"/>
        <PerspectiveCamera makeDefault position={[0, 5, 12]}/>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false}/>
        <Highway />
        <Truck animate/>
      </Canvas>
    </div>);
}
