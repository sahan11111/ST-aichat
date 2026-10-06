"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ThreeBackgroundProps {
  variant?: "auth" | "chat";
  className?: string;
}

export default function ThreeBackground({
  variant = "auth",
  className = "",
}: ThreeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a071b, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = variant === "auth" ? 75 : 90;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 2. Interactive Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.05;
      mouseY = (event.clientY - windowHalfY) * 0.05;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // 3. Central 3D Floating Geometry (Auth Mode)
    const objectsToAnimate: Array<{
      mesh: THREE.Object3D;
      rotX: number;
      rotY: number;
      rotZ: number;
    }> = [];

    if (variant === "auth") {
      // Outer wireframe icosahedron
      const icoGeo = new THREE.IcosahedronGeometry(22, 1);
      const icoMat = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6, // Violet
        wireframe: true,
        transparent: true,
        opacity: 0.28,
      });
      const icoMesh = new THREE.Mesh(icoGeo, icoMat);
      icoMesh.position.set(0, 0, -5);
      scene.add(icoMesh);
      objectsToAnimate.push({ mesh: icoMesh, rotX: 0.002, rotY: 0.003, rotZ: 0.001 });

      // Inner glowing octahedron
      const octGeo = new THREE.OctahedronGeometry(12, 0);
      const octMat = new THREE.MeshBasicMaterial({
        color: 0x6366f1, // Indigo
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      });
      const octMesh = new THREE.Mesh(octGeo, octMat);
      octMesh.position.set(0, 0, -5);
      scene.add(octMesh);
      objectsToAnimate.push({ mesh: octMesh, rotX: -0.004, rotY: 0.005, rotZ: 0.002 });

      // Core glowing sphere
      const coreGeo = new THREE.SphereGeometry(4, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8, // Sky cyan
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.set(0, 0, -5);
      scene.add(coreMesh);
      objectsToAnimate.push({ mesh: coreMesh, rotX: 0.006, rotY: -0.003, rotZ: 0.005 });
    }

    // 4. Floating 3D Starfield / Particle Constellation
    const particleCount = variant === "auth" ? 220 : 160;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0xa78bfa), // Light violet
      new THREE.Color(0x818cf8), // Indigo
      new THREE.Color(0x38bdf8), // Cyan
      new THREE.Color(0xc084fc), // Purple
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 220;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 180;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Circular particle texture using procedural canvas
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.3, "rgba(200,220,255,0.7)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: variant === "auth" ? 2.5 : 1.8,
      map: particleTexture,
      transparent: true,
      opacity: variant === "auth" ? 0.75 : 0.45,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // 5. Constellation Lines between nearby particles
    const maxConnections = particleCount * 2;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: variant === "auth" ? 0.25 : 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    // 6. Responsive Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera smooth damping towards target parallax
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      camera.position.x = targetX * 0.3;
      camera.position.y = -targetY * 0.3;
      camera.lookAt(0, 0, 0);

      // Rotate geometric meshes
      for (const obj of objectsToAnimate) {
        obj.mesh.rotation.x += obj.rotX;
        obj.mesh.rotation.y += obj.rotY;
        obj.mesh.rotation.z += obj.rotZ;
      }

      // Slowly rotate particle field
      particles.rotation.y = elapsed * 0.025;
      particles.rotation.x = Math.sin(elapsed * 0.015) * 0.05;

      // Update dynamic connecting lines
      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const linePosAttr = lineGeo.getAttribute("position") as THREE.BufferAttribute;
      const lineColAttr = lineGeo.getAttribute("color") as THREE.BufferAttribute;
      const lPos = linePosAttr.array as Float32Array;
      const lCol = lineColAttr.array as Float32Array;

      let lineIndex = 0;
      const threshold = variant === "auth" ? 28 : 22;

      // Sample a subset for 60fps performance
      const stride = 2;
      for (let i = 0; i < particleCount; i += stride) {
        for (let j = i + stride; j < particleCount; j += stride) {
          const dx = posArray[i * 3] - posArray[j * 3];
          const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
          const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < threshold && lineIndex < maxConnections) {
            const alpha = 1.0 - dist / threshold;
            const idx6 = lineIndex * 6;

            lPos[idx6] = posArray[i * 3];
            lPos[idx6 + 1] = posArray[i * 3 + 1];
            lPos[idx6 + 2] = posArray[i * 3 + 2];

            lPos[idx6 + 3] = posArray[j * 3];
            lPos[idx6 + 4] = posArray[j * 3 + 1];
            lPos[idx6 + 5] = posArray[j * 3 + 2];

            // Color gradient along the line
            lCol[idx6] = 0.55 * alpha;
            lCol[idx6 + 1] = 0.35 * alpha;
            lCol[idx6 + 2] = 0.95 * alpha;

            lCol[idx6 + 3] = 0.25 * alpha;
            lCol[idx6 + 4] = 0.65 * alpha;
            lCol[idx6 + 5] = 0.95 * alpha;

            lineIndex++;
          }
        }
      }

      lineGeo.setDrawRange(0, lineIndex * 2);
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;
      lineMesh.rotation.y = particles.rotation.y;
      lineMesh.rotation.x = particles.rotation.x;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      // Dispose resources
      geometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      lineGeo.dispose();
      lineMat.dispose();

      for (const obj of objectsToAnimate) {
        if ("geometry" in obj.mesh && obj.mesh.geometry) {
          (obj.mesh.geometry as THREE.BufferGeometry).dispose();
        }
        if ("material" in obj.mesh && obj.mesh.material) {
          (obj.mesh.material as THREE.Material).dispose();
        }
      }

      renderer.dispose();
    };
  }, [variant, mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
    />
  );
}
