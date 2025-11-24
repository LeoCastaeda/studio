"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Stage } from "@react-three/drei";
import { Button } from "@/components/ui/button";
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
    
    const objectName = event.object.name;
    
    console.log('Clicked object:', objectName); // Para debug
    
    // Mapear nombres exactos de objetos a tipos de cristal
    if (objectName === 'Glass_Windshield_Front') {
      onGlassClick('parabrisas');
    } else if (objectName === 'Glass_window_Right' || objectName === 'Glass_Window_Left') {
      onGlassClick('laterales');
    } else if (objectName === 'Glass_WindShield_rear') {
      onGlassClick('trasero');
    } else if (objectName === 'Glass_Sunroof') {
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

type CameraPosition = {
  position: [number, number, number];
  target: [number, number, number];
};

const cameraPositions: Record<string, CameraPosition> = {
  parabrisas: { position: [5, 1, 0], target: [0, 0.5, 0] },  // Vista frontal (lateral)
  laterales: { position: [3, 1, 3], target: [0, 0.5, 0] },   // Vista lateral (diagonal)
  trasero: { position: [-3, 1, -3], target: [0, 0.5, 0] },   // Vista trasera
  techo: { position: [0, 5, 0], target: [0, 0, 0] },         // Vista superior
  default: { position: [0, 0, 5], target: [0, 0, 0] },       // Vista general
};

export function Model3DViewerClickable({ modelPath, onGlassClick }: Model3DProps) {
  const [activeView, setActiveView] = useState<string>('default');
  const controlsRef = useRef<any>(null);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (controlsRef.current) {
      const pos = cameraPositions[view];
      // Animar la cámara a la nueva posición
      controlsRef.current.object.position.set(...pos.position);
      controlsRef.current.target.set(...pos.target);
      controlsRef.current.update();
    }
    if (onGlassClick) {
      onGlassClick(view);
    }
  };

  return (
    <div className="space-y-4">
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
              ref={controlsRef}
              enableZoom={false}
              enablePan={false}
              minDistance={2}
              maxDistance={10}
            />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Botones de navegación */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={activeView === 'parabrisas' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('parabrisas')}
        >
          🚗 Parabrisas
        </Button>
        <Button
          variant={activeView === 'laterales' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('laterales')}
        >
          🪟 Laterales
        </Button>
        <Button
          variant={activeView === 'trasero' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('trasero')}
        >
          🔙 Trasero
        </Button>
        <Button
          variant={activeView === 'techo' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('techo')}
        >
          ☀️ Techo Solar
        </Button>
        <Button
          variant={activeView === 'default' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewChange('default')}
        >
          🔄 Vista General
        </Button>
      </div>
    </div>
  );
}
