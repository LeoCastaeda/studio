"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { ThreeEvent } from "@react-three/fiber";

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
    if (objectName === "Glass_Windshield_Front") {
      onGlassClick("parabrisas");
    } else if (
      objectName === "Glass_window_Right" ||
      objectName === "Glass_Window_Left"
    ) {
      onGlassClick("laterales");
    } else if (objectName === "Glass_WindShield_rear") {
      onGlassClick("trasero");
    } else if (objectName === "Glass_Sunroof") {
      onGlassClick("techo");
    }
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "default";
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
  parabrisas: { position: [5, 1, 0], target: [0, 0.5, 0] },
  laterales: { position: [3, 1, 3], target: [0, 0.5, 0] },
  trasero: { position: [-3, 1, -3], target: [0, 0.5, 0] },
  techo: { position: [0, 5, 0], target: [0, 0, 0] },
  default: { position: [0, 0, 5], target: [0, 0, 0] },
};

// Placeholder que se muestra antes de que el usuario llegue al modelo
function Model3DSkeleton() {
  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-lg bg-muted flex flex-col items-center justify-center gap-3 animate-pulse">
      <svg
        className="w-16 h-16 text-muted-foreground/40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
        />
      </svg>
      <p className="text-sm text-muted-foreground">Cargando modelo 3D…</p>
    </div>
  );
}

export function Model3DViewerClickable({ modelPath, onGlassClick }: Model3DProps) {
  const [activeView, setActiveView] = useState<string>("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  // Intersection Observer: solo monta el Canvas cuando el div entra en viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Solo necesitamos dispararlo una vez
        }
      },
      { rootMargin: "200px" } // Empieza a cargar 200px antes de que sea visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (controlsRef.current) {
      const pos = cameraPositions[view];
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
      {/* Contenedor observado — el Canvas solo se monta cuando es visible */}
      <div
        ref={containerRef}
        className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden bg-muted"
      >
        {isVisible ? (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            shadows={false} // Desactivado para mayor rendimiento
            gl={{ antialias: true, powerPreference: "high-performance" }}
            dpr={[1, 1.5]} // Limita el pixel ratio para no sobrecargar GPU
            onCreated={() => setIsLoaded(true)}
          >
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6} shadows={false}>
                <ClickableModel
                  modelPath={modelPath}
                  onGlassClick={onGlassClick}
                />
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
        ) : (
          <Model3DSkeleton />
        )}
      </div>

      {/* Botones de navegación */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { key: "parabrisas", label: "🚗 Parabrisas" },
          { key: "laterales", label: "🪟 Laterales" },
          { key: "trasero", label: "🔙 Trasero" },
          { key: "techo", label: "☀️ Techo Solar" },
          { key: "default", label: "🔄 Vista General" },
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={activeView === key ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {isVisible && !isLoaded && (
        <p className="text-xs text-center text-muted-foreground">
          Inicializando modelo 3D…
        </p>
      )}
    </div>
  );
}
