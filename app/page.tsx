"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Noise, LayerMaterial, Depth } from "lamina";
// import { PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import { useImmer } from "use-immer";
import * as THREE from "three";
import { getProject } from "@theatre/core";
import studio from "@theatre/studio";
import extension from "@theatre/r3f/dist/extension";
import { editable as e, SheetProvider } from "@theatre/r3f";
import { PerspectiveCamera } from "@theatre/r3f";

studio.initialize();
studio.extend(extension);

const demoSheet = getProject("Home").sheet("Main");

function Box() {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useImmer(false);
  const [active, setActive] = useImmer(false);
  useFrame((state, delta) => (mesh.current!.rotation.x += 0.01));
  return (
    <e.mesh
      theatreKey="cube"
      position={[0, 0, 0]}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </e.mesh>
  );
}

export default function Home() {
  return (
    <main className="w-screen h-screen">
      <Canvas gl={{ preserveDrawingBuffer: true }}>
        <SheetProvider sheet={demoSheet}>
          <PerspectiveCamera
            theatreKey="Camera"
            makeDefault
            position={[5, 5, -5]}
            fov={75}
          />

          <LayerMaterial side={THREE.BackSide}>
            <Depth
              colorB="red"
              colorA="skyblue"
              alpha={1}
              mode="normal"
              near={130}
              far={200}
              origin={[100, 100, -100]}
            />
            <Noise
              mapping="local"
              type="white"
              scale={1000}
              colorA="white"
              colorB="black"
              mode="subtract"
              alpha={0.2}
            />
          </LayerMaterial>
          {/* <PerspectiveCamera position={[0, 0, 15]} makeDefault fov={75} /> */}
          <mesh>
            <Box />
          </mesh>
        </SheetProvider>
      </Canvas>
    </main>
  );
}
