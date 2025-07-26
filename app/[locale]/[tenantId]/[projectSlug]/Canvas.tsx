"use client";

import { useEffect, useRef, useState } from "react";
import { ITagItem } from "@/types/ITagItem";
import * as THREE from "three";
import TopFloatingBar from "@/layout/TopFloatingBar";
import BottomFloatingControls from "@/layout/BottomFloatingControls";
import BottomFloatingBar from "@/layout/BottomFloatingBar";

type CanvasConfig = {
  preloadFrameCount?: number;
  easeThreshold?: number;
  easeStart?: number;
  easeMultiplier?: number;
  easeMaxSpeed?: number;
  easeSpeedFactor?: number;
  geometrySize?: [number, number];
  cameraHeight?: number;
};

function safeMod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

export default function Canvas({
  workspaceItems = [],
  config = {},
}: {
  workspaceItems?: ITagItem[];
  config?: CanvasConfig;
}) {
  const {
    preloadFrameCount = 5,
    easeThreshold = 0.3,
    easeStart = 0.6,
    easeMultiplier = 1.2,
    easeMaxSpeed = 1.15,
    easeSpeedFactor = 0.15,
    geometrySize = [16, 9],
    cameraHeight = 9,
  } = config;

  const totalFrames = workspaceItems?.length || 0;
  const mainFrameAnchors = workspaceItems
    ?.map((item, index) => (item?.mainFrame ? index : -1))
    .filter((i) => i >= 0) || [0];

  const [isLoading, setIsLoading] = useState(true);
  const loadedFramesCountRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>(null);
  const textureLoader = useRef(new THREE.TextureLoader()).current;
  const textureCacheRef = useRef<Map<number, THREE.Texture>>(new Map());
  const meshRef = useRef<THREE.Mesh>(null);
  const cameraRef = useRef<THREE.OrthographicCamera>(null);
  const currentFrameRef = useRef(mainFrameAnchors?.[0]);
  const targetFrameRef = useRef(mainFrameAnchors?.[0]);
  const currentFrameFloatRef = useRef(mainFrameAnchors?.[0]);
  const lastDragDeltaRef = useRef(0);
  console.log("Total Frames:", currentFrameRef);
  const easeNormalToFast = (t: number): number => {
    return t < easeThreshold ? easeStart + t * easeMultiplier : easeMaxSpeed;
  };

  const preloadNearbyFrames = (centerIndex: number, radius: number = 2) => {
    const preloadSet = new Set<number>();
    for (let i = -radius; i <= radius; i++) {
      preloadSet.add(safeMod(centerIndex + i, totalFrames));
    }
    for (const anchor of mainFrameAnchors) preloadSet.add(anchor);

    for (const idx of preloadSet) {
      if (
        !textureCacheRef.current.has(idx) &&
        workspaceItems?.[idx]?.image?.url
      ) {
        const tex = textureLoader.load(workspaceItems?.[idx]?.image?.url);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        textureCacheRef.current.set(idx, tex);
      }
    }
  };

  const findNextAnchorStepByDirection = (
    current: number,
    direction: number
  ): number => {
    const normalized = safeMod(current, totalFrames || 1);
    const sortedAnchors = [...(mainFrameAnchors || [])].sort((a, b) => a - b);
    if (direction > 0) {
      for (const anchor of sortedAnchors)
        if (anchor > normalized) return anchor;
      return sortedAnchors[0];
    } else {
      for (let i = sortedAnchors.length - 1; i >= 0; i--)
        if (sortedAnchors[i] < normalized) return sortedAnchors[i];
      return sortedAnchors[sortedAnchors.length - 1];
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const aspect = container.clientWidth / container.clientHeight;
    const height = cameraHeight;
    const width = height * aspect;

    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0.1,
      100
    );
    camera.position.z = 10;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const preloadInitialFrames = () => {
      const preloadIndices = new Set<number>([
        ...mainFrameAnchors,
        ...Array.from({ length: preloadFrameCount }, (_, i) => i),
      ]);

      preloadIndices.forEach((idx) => {
        if (
          !textureCacheRef.current.has(idx) &&
          workspaceItems[idx]?.image?.url
        ) {
          const tex = textureLoader.load(workspaceItems[idx].image.url, () => {
            loadedFramesCountRef.current++;
            if (loadedFramesCountRef.current >= preloadIndices.size) {
              setIsLoading(false);
              setTimeout(() => {
                for (let j = 0; j < totalFrames; j++) {
                  if (
                    !textureCacheRef.current.has(j) &&
                    workspaceItems[j]?.image?.url
                  ) {
                    const tex = textureLoader.load(
                      workspaceItems?.[j]?.image?.url || ""
                    );
                    tex.colorSpace = THREE.SRGBColorSpace;
                    textureCacheRef.current.set(j, tex);
                  }
                }
              }, 100);
            }
          });
          tex.colorSpace = THREE.SRGBColorSpace;
          textureCacheRef.current.set(idx, tex);
        } else {
          loadedFramesCountRef.current++;
        }
      });
    };

    preloadInitialFrames();

    const [planeW, planeH] = geometrySize;
    const initialTexture = textureLoader.load(
      workspaceItems[currentFrameRef.current]?.image?.url || ""
    );
    initialTexture.colorSpace = THREE.SRGBColorSpace;
    textureCacheRef.current.set(currentFrameRef.current, initialTexture);

    const geometry = new THREE.PlaneGeometry(planeW, planeH);
    const material = new THREE.MeshBasicMaterial({ map: initialTexture });
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    const animate = () => {
      requestAnimationFrame(animate);
      let diff = targetFrameRef.current - currentFrameFloatRef.current;
      if (Math.abs(diff) > totalFrames / 2)
        diff = diff > 0 ? diff - totalFrames : diff + totalFrames;

      const distance = Math.abs(diff);
      if (distance < 0.3) {
        currentFrameFloatRef.current = targetFrameRef.current;
        preloadNearbyFrames(targetFrameRef.current, 5);
      } else {
        const t = Math.min(distance / 10, 1);
        const easedSpeed = easeNormalToFast(t) * easeSpeedFactor;
        const nextFloat =
          currentFrameFloatRef.current + Math.sign(diff) * easedSpeed;
        const nextFrame = safeMod(Math.round(nextFloat), totalFrames);
        const nextTexture = textureCacheRef.current.get(nextFrame);
        if (nextTexture?.image) currentFrameFloatRef.current = nextFloat;
        else preloadNearbyFrames(nextFrame, 5);
      }

      const displayFrame = safeMod(
        Math.round(currentFrameFloatRef.current),
        totalFrames
      );
      const currentTexture = textureCacheRef.current.get(displayFrame);
      if (currentTexture?.image && meshRef.current) {
        const mat = meshRef.current.material as THREE.MeshBasicMaterial;
        if (mat.map !== currentTexture) {
          mat.map = currentTexture;
          mat.needsUpdate = true;
        }
        currentFrameRef.current = displayFrame;
      }

      renderer.render(scene, camera);
    };

    animate();

    let isDragging = false;
    let lastX = 0;

    const updateFrameFromDelta = (delta: number) => {
      const frameChange = delta / 10;
      targetFrameRef.current += frameChange;
      lastDragDeltaRef.current = frameChange;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - lastX;
      lastX = e.clientX;
      updateFrameFromDelta(delta);
    };

    const handleMouseUp = () => {
      isDragging = false;
      const snap = findNextAnchorStepByDirection(
        currentFrameFloatRef.current,
        lastDragDeltaRef.current
      );
      targetFrameRef.current = snap;
      preloadNearbyFrames(snap, 5);
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDragging = true;
      lastX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const delta = e.touches[0].clientX - lastX;
      lastX = e.touches[0].clientX;
      updateFrameFromDelta(delta);
    };

    const handleTouchEnd = () => handleMouseUp();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current)
        return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const aspect = w / h;
      const width = cameraHeight * aspect;
      cameraRef.current.left = -width / 2;
      cameraRef.current.right = width / 2;
      cameraRef.current.top = cameraHeight / 2;
      cameraRef.current.bottom = -cameraHeight / 2;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const canvas = renderer.domElement;
    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [workspaceItems]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        background: "#000",
        cursor: "grab",
        position: "relative",
      }}
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            color: "white",
            fontSize: "1.2rem",
            fontWeight: 500,
          }}
        >
          Yükleniyor...
        </div>
      )}
      <TopFloatingBar />

      <BottomFloatingControls />

      <BottomFloatingBar />
    </div>
  );
}
