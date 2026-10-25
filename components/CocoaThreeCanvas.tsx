"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CocoaThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    // 3. Texture Loader for the Cutout Cocoa
    const textureLoader = new THREE.TextureLoader();
    let cocoaMesh: THREE.Mesh | null = null;
    let shadowMesh: THREE.Mesh | null = null;

    textureLoader.load("/images/kakao-fresh-cutout.png", (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // Cocoa Quad Mesh
      const geometry = new THREE.PlaneGeometry(3.6, 3.6);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        roughness: 0.45,
        metalness: 0.05,
      });

      cocoaMesh = new THREE.Mesh(geometry, material);
      cocoaMesh.position.set(0, 0.2, 0);
      scene.add(cocoaMesh);

      // Soft Radial Contact Shadow below Cocoa
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = 128;
      shadowCanvas.height = 128;
      const ctx = shadowCanvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 60);
        gradient.addColorStop(0, "rgba(15, 23, 42, 0.35)");
        gradient.addColorStop(0.5, "rgba(15, 23, 42, 0.15)");
        gradient.addColorStop(1, "rgba(15, 23, 42, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 128, 128);
      }
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(3.2, 1.0);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.6,
      });
      shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.position.set(0, -1.5, -0.1);
      shadowMesh.rotation.x = -Math.PI / 12;
      scene.add(shadowMesh);
    });

    // 4. Interactive Mouse Handling
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 0.7;
      mouseY = y * 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 5. Window Resize
    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // 6. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth lerp mouse response
      targetX += (mouseX - targetX) * 0.08;
      targetY += (mouseY - targetY) * 0.08;

      if (cocoaMesh) {
        // Natural organic floating bobbing
        const floatY = Math.sin(elapsed * 1.6) * 0.14;
        cocoaMesh.position.y = 0.2 + floatY;

        // 3D Parallax tilt
        cocoaMesh.rotation.y = targetX + Math.sin(elapsed * 0.8) * 0.04;
        cocoaMesh.rotation.x = -targetY + Math.cos(elapsed * 0.9) * 0.03;
        cocoaMesh.rotation.z = Math.sin(elapsed * 1.2) * 0.02;

        // Reactive shadow
        if (shadowMesh) {
          const shadowScale = 1 - floatY * 0.8;
          shadowMesh.scale.set(shadowScale, shadowScale, 1);
          (shadowMesh.material as THREE.MeshBasicMaterial).opacity =
            0.55 - floatY * 0.3;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="cocoa-three-canvas-wrap"
      title="Sentuh atau gerakkan kursor untuk melihat animasi 3D buah kakao"
    />
  );
}
