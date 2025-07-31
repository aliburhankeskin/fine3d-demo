"use client";

import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@redux/hooks";
import { useMediaQuery } from "@mui/material";
import { ITagItem } from "@/types/ITagItem";
import * as THREE from "three";
import TopFloatingBar from "./TopFloatingBar";
import BottomFloatingControls from "./BottomFloatingControls";
import BottomFloatingBar from "./BottomFloatingBar";
import PolygonOverlay from "./PolygonOverlay";

type CanvasConfig = {
  preloadFrameCount?: number;
  geometrySize?: [number, number];
  cameraHeight?: number;
  startAngle?: number;
};

function safeMod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

const MIN_CANVAS_HEIGHT = 250;

export default function Canvas({
  workspaceItems = [],
  config = {},
  tabBarData,
  canvasHeight,
}: {
  workspaceItems?: ITagItem[];
  config?: CanvasConfig;
  tabBarData?: any;
  canvasHeight?: number;
}) {
  const drawerOpen = useAppSelector((state) => state.AppReducer.drawerOpen);
  const ContainerWidth = 1920 - (drawerOpen ? 400 : 0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const {
    preloadFrameCount = 5,
    geometrySize = [16, 9],
    cameraHeight = 9,
    startAngle = 180,
  } = config;

  const totalFrames = workspaceItems?.length || 0;
  const mainFrameAnchors = workspaceItems
    ?.map((item, index) => (item?.mainFrame ? index : -1))
    .filter((i) => i >= 0) || [0];

  const [angleDeg, setAngleDeg] = useState(startAngle);
  const [isLoading, setIsLoading] = useState(true);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [currentDisplayFrame, setCurrentDisplayFrame] = useState(
    mainFrameAnchors?.[0] || 0
  );
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
        tex.generateMipmaps = false;
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

  const getImageUrl = (idx: number): string =>
    workspaceItems?.[idx]?.image?.url ?? "";

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const aspect = ContainerWidth / 1080;
    const height = cameraHeight;
    const width = height * aspect;
    const textureCache = textureCacheRef.current;

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

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
      stencil: false,
      depth: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1.0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const preloadInitialFrames = () => {
      const preloadIndices = new Set<number>([
        ...mainFrameAnchors,
        ...Array.from({ length: preloadFrameCount }, (_, i) => i),
      ]);

      preloadIndices.forEach((idx) => {
        if (!textureCacheRef.current.has(idx) && getImageUrl(idx)) {
          const tex = textureLoader.load(getImageUrl(idx), () => {
            loadedFramesCountRef.current++;
            if (loadedFramesCountRef.current >= preloadIndices.size) {
              setIsLoading(false);
              setTimeout(() => {
                for (let j = 0; j < totalFrames; j++) {
                  if (!textureCacheRef.current.has(j) && getImageUrl(j)) {
                    const tex = textureLoader.load(getImageUrl(j));
                    tex.colorSpace = THREE.SRGBColorSpace;
                    tex.minFilter = THREE.LinearFilter;
                    tex.magFilter = THREE.LinearFilter;
                    tex.generateMipmaps = false;
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
      getImageUrl(currentFrameRef.current)
    );
    initialTexture.colorSpace = THREE.SRGBColorSpace;
    textureCacheRef.current.set(currentFrameRef.current, initialTexture);

    const geometry = new THREE.PlaneGeometry(planeW, planeH);
    const material = new THREE.MeshBasicMaterial({ map: initialTexture });
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    const clock = new THREE.Clock();
    const baseSpeed = isMobile ? 0.6 : 0.7;
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const deltaTime = Math.min(clock.getDelta(), 0.1);
      const frameMultiplier = Math.max(1, deltaTime * 60);

      let diff = targetFrameRef.current - currentFrameFloatRef.current;
      if (Math.abs(diff) > totalFrames / 2) {
        diff = diff > 0 ? diff - totalFrames : diff + totalFrames;
      }

      if (Math.abs(diff) >= 0.005) {
        const moveAmount = baseSpeed * frameMultiplier * Math.sign(diff);

        if (Math.abs(diff) <= Math.abs(moveAmount)) {
          currentFrameFloatRef.current = targetFrameRef.current;
        } else {
          currentFrameFloatRef.current += moveAmount;
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
          setCurrentDisplayFrame(displayFrame);
        }

        const angle =
          ((currentFrameFloatRef.current / totalFrames) * 360 + startAngle) %
          360;
        setAngleDeg(angle);
      }

      renderer.render(scene, camera);
    };

    const preloadAllFrames = async () => {
      const promises: Promise<void>[] = [];

      for (let i = 0; i < totalFrames; i++) {
        const url = getImageUrl(i);
        if (!textureCacheRef.current.has(i) && url) {
          const p = new Promise<void>((resolve) => {
            const tex = textureLoader.load(url, () => {
              tex.colorSpace = THREE.SRGBColorSpace;
              tex.minFilter = THREE.LinearFilter;
              tex.magFilter = THREE.LinearFilter;
              tex.generateMipmaps = false;
              tex.wrapS = THREE.ClampToEdgeWrapping;
              tex.wrapT = THREE.ClampToEdgeWrapping;
              textureCacheRef.current.set(i, tex);
              resolve();
            });
          });
          promises.push(p);
        }
      }

      await Promise.all(promises);
      setIsLoading(false);
      animate(); // ⬅️ preload sonrası animasyon başlasın
    };
    preloadAllFrames();

    let isDragging = false;
    let dragStarted = false;
    let lastX = 0;
    const dragThreshold = 20;

    const updateFrameFromDelta = (delta: number) => {
      const frameChange = delta / (isMobile ? 12 : 15); // Daha yumuşak drag
      targetFrameRef.current += frameChange;
      lastDragDeltaRef.current = frameChange;
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragStarted = false;
      lastX = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const delta = e.clientX - lastX;

      if (!dragStarted && Math.abs(delta) >= dragThreshold) {
        dragStarted = true;
      }

      if (dragStarted) {
        lastX = e.clientX;
        updateFrameFromDelta(delta);
      }
    };

    const handleMouseUp = () => {
      if (isDragging && dragStarted) {
        const snap = findNextAnchorStepByDirection(
          currentFrameFloatRef.current,
          lastDragDeltaRef.current
        );
        targetFrameRef.current = snap;
        preloadNearbyFrames(snap, 5);
      }

      isDragging = false;
      dragStarted = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      isDragging = true;
      dragStarted = false;
      lastX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;

      const delta = e.touches[0].clientX - lastX;

      if (!dragStarted && Math.abs(delta) >= dragThreshold) {
        dragStarted = true;
      }

      if (dragStarted) {
        lastX = e.touches[0].clientX;
        updateFrameFromDelta(delta);
      }
    };
    const handleTouchEnd = () => handleMouseUp();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current)
        return;
      const w = ContainerWidth;
      const h = 1080;
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
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);

      // Texture'ları temizle
      textureCache.forEach((texture) => {
        texture.dispose();
      });
      textureCache.clear();

      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        if (meshRef.current.material instanceof THREE.Material) {
          meshRef.current.material.dispose();
        }
      }

      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [workspaceItems]);

  const goToNextAnchor = () => {
    const next = findNextAnchorStepByDirection(currentFrameRef.current, 1);
    targetFrameRef.current = next;
    preloadNearbyFrames(next, 5);
  };

  const goToPreviousAnchor = () => {
    const prev = findNextAnchorStepByDirection(currentFrameRef.current, -1);
    targetFrameRef.current = prev;
    preloadNearbyFrames(prev, 5);
  };

  useEffect(() => {
    if (
      !containerRef.current ||
      !rendererRef.current ||
      !cameraRef.current ||
      !isMobile
    )
      return;

    const width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;
    if (width <= 0) return;
    if (height < MIN_CANVAS_HEIGHT) height = MIN_CANVAS_HEIGHT;

    const aspect = width / height;
    const camWidth = cameraHeight * aspect;

    cameraRef.current.left = -camWidth / 2;
    cameraRef.current.right = camWidth / 2;
    cameraRef.current.top = cameraHeight / 2;
    cameraRef.current.bottom = -cameraHeight / 2;
    cameraRef.current.updateProjectionMatrix();

    rendererRef.current.setSize(width, height, true);
  }, [canvasHeight, cameraHeight, isMobile]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current && rendererRef.current) {
        const canvas = rendererRef.current.domElement;
        setContainerDimensions({
          width: canvas.width / rendererRef.current.getPixelRatio(),
          height: canvas.height / rendererRef.current.getPixelRatio(),
        });
      } else if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [canvasHeight]);

  useEffect(() => {
    if (!containerRef.current || !rendererRef.current || !cameraRef.current)
      return;
    const w = ContainerWidth;
    const h = 1080;
    const aspect = w / h;
    const width = cameraHeight * aspect;
    cameraRef.current.left = -width / 2;
    cameraRef.current.right = width / 2;
    cameraRef.current.top = cameraHeight / 2;
    cameraRef.current.bottom = -cameraHeight / 2;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(w, h);
  }, [drawerOpen]);

  const currentFramePolygons =
    workspaceItems?.[currentDisplayFrame]?.polygons || [];

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "100%",
        background: "transparent",
        cursor: "grab",
        position: "relative",
        overflow: "hidden",
        minHeight: isMobile ? `${MIN_CANVAS_HEIGHT}px` : "auto",
        height: canvasHeight || "100%",
        transition: isMobile ? "none" : "height 0.3s ease",
        willChange: isMobile ? "auto" : "height",
        backfaceVisibility: "hidden",
        transform: "translateZ(0)",
        WebkitBackfaceVisibility: "hidden",
        WebkitTransform: "translateZ(0)",
        touchAction: "manipulation",
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

      {containerDimensions.width > 0 && containerDimensions.height > 0 && (
        <PolygonOverlay
          polygons={currentFramePolygons}
          containerWidth={ContainerWidth}
          containerHeight={1080}
          imageWidth={geometrySize[0] * 120}
          imageHeight={geometrySize[1] * 120}
        />
      )}

      <BottomFloatingControls
        onLeftClick={goToPreviousAnchor}
        onRightClick={goToNextAnchor}
      />

      {!isMobile && (
        <>
          <TopFloatingBar angleDeg={angleDeg} />

          <BottomFloatingBar data={tabBarData} />
        </>
      )}
    </div>
  );
}
