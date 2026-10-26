"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for interactive rotation
    const group = new THREE.Group();
    scene.add(group);

    // 1. Subtle Floating 3D Geometric Ring (IoT Data Ring)
    const ringGeometry = new THREE.TorusGeometry(8.5, 0.04, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 3;
    ring.rotation.y = Math.PI / 6;
    group.add(ring);

    // 2. Secondary Amber Ring
    const ring2Geometry = new THREE.TorusGeometry(10.5, 0.03, 16, 120);
    const ring2Material = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.22,
    });
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = -Math.PI / 5;
    group.add(ring2);

    // 3. Delicate Floating 3D Telemetry Particles
    const particleCount = 75;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const greenColor = new THREE.Color(0x10b981);
    const amberColor = new THREE.Color(0xf59e0b);
    const slateColor = new THREE.Color(0x94a3b8);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;

      const mixedColor =
        i % 3 === 0 ? greenColor : i % 3 === 1 ? amberColor : slateColor;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
    });

    const particles = new THREE.Points(geometry, pMaterial);
    group.add(particles);

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = x * 0.0008;
      mouseY = y * 0.0008;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse follow (lerp)
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      group.rotation.y = targetX + elapsed * 0.08;
      group.rotation.x = targetY + Math.sin(elapsed * 0.4) * 0.06;

      ring.rotation.z = elapsed * 0.12;
      ring2.rotation.z = -elapsed * 0.09;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      ring2Geometry.dispose();
      ring2Material.dispose();
      geometry.dispose();
      pMaterial.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-3d-canvas-container"
      aria-hidden="true"
    />
  );
}
