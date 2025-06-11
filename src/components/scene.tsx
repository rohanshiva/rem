"use client"

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { background, accent } from "@/lib/colors";
import { Stars } from "@/components/stars";

const COLORS = [accent];

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createStar(viewport: { width: number; height: number }) {
  return {
    pos: new THREE.Vector3(
      -viewport.width - viewport.width * 0.5,
      random(-viewport.height, viewport.height),
      random(-10, -2)
    ),
    len: random(2, 6),
    speed: random(1, 8),
    color: new THREE.Color(COLORS[Math.floor(random(0, COLORS.length))])
      .convertSRGBToLinear()
      .multiplyScalar(1.3),
  };
}

function Warp() {
  const STARS_COUNT = 4;
  const { viewport } = useThree();
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const starMap = useLoader(THREE.TextureLoader, "star.png");

  const stars = useMemo(
    () => Array.from({ length: STARS_COUNT }, () => createStar(viewport)),
    [viewport.width, viewport.height]
  );

  const colorArray = useMemo(
    () => Float32Array.from(stars.flatMap((star) => star.color.toArray())),
    [stars]
  );

  useEffect(() => {
    if (!instancedMeshRef.current) return;

    const matrix = new THREE.Matrix4();
    const rotation = new THREE.Quaternion();

    stars.forEach((star, i) => {
      matrix.compose(star.pos, rotation, new THREE.Vector3(star.len, 1, 1));
      instancedMeshRef?.current?.setMatrixAt(i, matrix);
    });

    instancedMeshRef.current.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorArray, 3)
    );

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [stars, colorArray]);

  useFrame((_, delta) => {
    if (!instancedMeshRef.current) return;

    const matrix = new THREE.Matrix4();
    const rotation = new THREE.Quaternion();

    stars.forEach((star, i) => {
      star.pos.x += star.speed * delta;

      if (star.pos.x > viewport.width + viewport.width * 0.5) {
        const newStar = createStar(viewport);
        Object.assign(star, newStar);

        const colorAttribute =
          instancedMeshRef.current?.geometry.getAttribute("color");
        if (colorAttribute) {
          colorAttribute.setXYZ(i, star.color.r, star.color.g, star.color.b);
          colorAttribute.needsUpdate = true;
        }
      }

      matrix.compose(star.pos, rotation, new THREE.Vector3(star.len, 1, 1));
      instancedMeshRef.current?.setMatrixAt(i, matrix);
    });

    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[undefined, undefined, STARS_COUNT]}
    >
      <planeGeometry args={[1, 0.05]} />
      <meshBasicMaterial
        transparent
        side={THREE.DoubleSide}
        alphaMap={starMap}
        vertexColors
      />
    </instancedMesh>
  );
}

export function Scene() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], rotation: [0, 0, -0.3] }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
      >
        <color attach="background" args={[background]} />
        <Warp />
        <Stars 
          radius={50} 
          depth={200} 
          count={1000} 
          factor={6} 
          fade={true}
          speed={1}
          color={accent}
        />
      </Canvas>
    </div>
  );
}
