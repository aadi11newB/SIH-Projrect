'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, RotateCcw, Sun, Eye, Layers } from 'lucide-react';
import { ShelterGeometry, ShelterMaterials, ShelterOpenings } from '@/lib/types';

interface ThreeShelterViewProps {
  geometry: ShelterGeometry;
  materials: ShelterMaterials;
  openings: ShelterOpenings;
  showSolarPanels?: boolean;
}

export const ThreeShelterView: React.FC<ThreeShelterViewProps> = ({
  geometry,
  materials,
  openings,
  showSolarPanels = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [togglePanels, setTogglePanels] = useState(showSolarPanels);
  const [colorMode, setColorMode] = useState<'realistic' | 'thermal'>('thermal');

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 500;
    const height = mountRef.current.clientHeight || 350;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b14);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(12, 10, 14);
    camera.lookAt(0, 1.5, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    sunLight.position.set(10, 15, 8);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Point lights for tactical glow
    const tealLight = new THREE.PointLight(0x00f2fe, 0.8, 15);
    tealLight.position.set(-6, 4, -6);
    scene.add(tealLight);

    // 5. Ground Grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x14b8a6, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Compass ring on ground
    const ringGeo = new THREE.RingGeometry(8, 8.1, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x0f766e, side: THREE.DoubleSide });
    const compassRing = new THREE.Mesh(ringGeo, ringMat);
    compassRing.rotation.x = Math.PI / 2;
    compassRing.position.y = 0.02;
    scene.add(compassRing);

    // 6. Shelter Group Model
    const shelterGroup = new THREE.Group();

    const L = geometry.length;
    const W = geometry.width;
    const H = geometry.height;
    const pitchRad = (geometry.roof_angle * Math.PI) / 180;

    // Materials
    const wallColor = colorMode === 'thermal' ? 0x0d9488 : 0x334155;
    const roofColor = colorMode === 'thermal' ? 0xf59e0b : 0x1e293b;

    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.5,
      metalness: 0.2,
    });

    const roofMat = new THREE.MeshStandardMaterial({
      color: roofColor,
      roughness: 0.3,
      metalness: 0.6,
      side: THREE.DoubleSide,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      ior: 1.5,
    });

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8,
    });

    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.2,
      metalness: 0.8,
    });

    // Shelter Base Walls
    const wallGeo = new THREE.BoxGeometry(L, H, W);
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.y = H / 2;
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    shelterGroup.add(wallMesh);

    // Roof Mesh (Shed or Pitch)
    const roofThickness = 0.15;
    const roofGeo = new THREE.BoxGeometry(L + 0.6, roofThickness, W + 0.6);
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.set(0, H + roofThickness / 2, 0);
    roofMesh.rotation.x = pitchRad * 0.4;
    roofMesh.castShadow = true;
    shelterGroup.add(roofMesh);

    // South Windows (Passive Solar Solarium)
    const southWinArea = openings.south_window_area_sqm;
    const winWidth = Math.min(L * 0.7, Math.sqrt(southWinArea * 2.0));
    const winHeight = Math.min(H * 0.7, southWinArea / winWidth);

    const winGeo = new THREE.BoxGeometry(winWidth, winHeight, 0.08);
    const winMesh = new THREE.Mesh(winGeo, glassMat);
    winMesh.position.set(0, H * 0.5, W / 2 + 0.05);
    shelterGroup.add(winMesh);

    // Window Frame Border
    const winFrameGeo = new THREE.BoxGeometry(winWidth + 0.1, winHeight + 0.1, 0.04);
    const winFrameMesh = new THREE.Mesh(winFrameGeo, frameMat);
    winFrameMesh.position.set(0, H * 0.5, W / 2 + 0.02);
    shelterGroup.add(winFrameMesh);

    // Door on South Facade
    const doorGeo = new THREE.BoxGeometry(0.9, 2.0, 0.08);
    const doorMesh = new THREE.Mesh(doorGeo, frameMat);
    doorMesh.position.set(winWidth / 2 + 0.8, 1.0, W / 2 + 0.05);
    shelterGroup.add(doorMesh);

    // Solar PV Panels on Roof
    if (togglePanels) {
      const panelCols = 4;
      const panelRows = 2;
      const pW = (L * 0.75) / panelCols;
      const pH = (W * 0.7) / panelRows;

      for (let r = 0; r < panelRows; r++) {
        for (let c = 0; c < panelCols; c++) {
          const pGeo = new THREE.BoxGeometry(pW - 0.08, 0.04, pH - 0.08);
          const pMesh = new THREE.Mesh(pGeo, panelMat);
          const posX = -((panelCols - 1) * pW) / 2 + c * pW;
          const posZ = -((panelRows - 1) * pH) / 2 + r * pH;
          pMesh.position.set(posX, H + 0.18 + r * 0.08, posZ);
          pMesh.rotation.x = pitchRad * 0.4;
          pMesh.castShadow = true;
          shelterGroup.add(pMesh);
        }
      }
    }

    // Orientation rotation
    // 180 deg is South facing
    const azRad = ((geometry.orientation_azimuth - 180) * Math.PI) / 180;
    shelterGroup.rotation.y = azRad;

    scene.add(shelterGroup);

    // Interactive mouse rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      shelterGroup.rotation.y += deltaX * 0.01;
      camera.position.y = Math.max(2, Math.min(20, camera.position.y + deltaY * 0.05));
      camera.lookAt(0, 1.5, 0);

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && dom) {
        mountRef.current.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [geometry, materials, openings, togglePanels, colorMode]);

  return (
    <div className="tactical-card p-5 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Box className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-slate-100 text-sm tracking-wide">
            3D PARAMETRIC SHELTER & SOLAR ARRAY VIEWER
          </h3>
        </div>

        {/* 3D Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setTogglePanels(!togglePanels)}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium flex items-center space-x-1 transition-all ${
              togglePanels
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-navy-900 text-slate-400 border border-slate-800'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>{togglePanels ? 'PV Array: ON' : 'PV Array: OFF'}</span>
          </button>

          <button
            onClick={() => setColorMode(colorMode === 'thermal' ? 'realistic' : 'thermal')}
            className="px-2.5 py-1 rounded text-xs font-mono font-medium bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center space-x-1"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mode: {colorMode.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-[320px] rounded-xl bg-navy-950/90 border border-teal-500/30 relative overflow-hidden cursor-grab active:cursor-grabbing shadow-inner flex items-center justify-center"
      >
        {/* Helper overlay */}
        <div className="absolute top-3 left-3 bg-navy-950/80 px-2.5 py-1 rounded text-[10px] font-mono text-slate-400 border border-slate-800 pointer-events-none">
          Click & Drag to Rotate | Dynamic Solar Altitude Vector
        </div>

        <div className="absolute bottom-3 right-3 bg-navy-950/80 px-2.5 py-1 rounded text-[10px] font-mono text-teal-400 border border-teal-500/30 pointer-events-none">
          L: {geometry.length}m | W: {geometry.width}m | H: {geometry.height}m | Pitch: {geometry.roof_angle}°
        </div>
      </div>
    </div>
  );
};
