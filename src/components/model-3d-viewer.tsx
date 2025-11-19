"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Stage } from "@react-three/drei";

interface Model3DProps {
  modelPath: string;
}

function Model({ modelPath }: Model3DProps) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
}

export function Model3DViewer({ modelPath }: Model3DProps) {
  return (
    <div className="w-full h-[400px] md:h-[600px] rounded-lg overflow-hidden bg-muted">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        shadows
      >
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <Model modelPath={modelPath} />
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
