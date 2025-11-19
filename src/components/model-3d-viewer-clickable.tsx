"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Stage } from "@react-three/drei";
import * as THREE from "three";

interface Model3DProps {
  modelPath: string;
  onGlassClick?: (glassType: string) => void;
}

function ClickableModel({ modelPath, onGlassClick }: Model3DProps) {
  const { scene } = useGLTF(modelPath);
  
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    
    if (!onGlassClick) return;
    
    const objectName = event.object.name.toLowerCase();
    
    // Mapear nombres de objetos a tipos de cristal
    if (objectName.includes('windshield') || objectName.includes('parabrisas')) {
      onGlassClick('parabrisas');
    } else if (objectName.includes('side') || objectName.includes('lateral')) {
      onGlassClick('laterales');
    } else if (objectName.includes('rear') || objectName.includes('trasero')) {
      onGlassClick('trasero');
    } else if (objectName.includes('sunroof') || objectName.includes('techo')) {
      onGlassClick('techo');
    }
  };
  
  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
  };
  
  return (
    <primitive 
      object={scene} 
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
}

export function Model3DViewerClickable({ modelPath, onGlassClick }: Model3DProps) {
  return (
    <div className="w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden bg-muted">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <ClickableModel modelPath={modelPath} onGlassClick={onGlassClick} />
          </Stage>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minDistance={2}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
