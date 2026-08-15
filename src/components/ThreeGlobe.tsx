"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  ExternalLink, 
  Briefcase, 
  Check, 
  Plus 
} from "lucide-react";

export type CompanyPin = {
  id: string;
  name: string;
  website_url: string;
  logo_url?: string | null;
  description: string | null;
  location_text?: string | null;
  status: string;
  latitude: number | null;
  longitude: number | null;
  activeJobCount: number;
  jobTitles?: string[];
};

// Procedurally generate high-contrast continent texture on canvas (100% reliable, zero CDN dependency)
function createEarthCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Deep ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, "#081C26");
  oceanGrad.addColorStop(0.5, "#0B2636");
  oceanGrad.addColorStop(1, "#081C26");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw latitude & longitude grid lines (subtle cyan/sage)
  ctx.strokeStyle = "rgba(78, 160, 180, 0.12)";
  ctx.lineWidth = 1;
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * canvas.height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = ((lng + 180) / 360) * canvas.width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Draw simplified high-contrast stylized world continents (Americas, Eurasia, Africa, Australia)
  ctx.fillStyle = "#1E5868"; // Continental land color matching reference
  ctx.strokeStyle = "#4FB6C9"; // Coastal glow
  ctx.lineWidth = 2;

  function drawLand(pathData: number[][]) {
    ctx.beginPath();
    pathData.forEach(([lng, lat], i) => {
      const x = ((lng + 180) / 360) * canvas.width;
      const y = ((90 - lat) / 180) * canvas.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // North America
  drawLand([
    [-165, 65], [-140, 70], [-100, 72], [-80, 70], [-60, 50],
    [-70, 42], [-80, 25], [-90, 20], [-105, 23], [-120, 34],
    [-125, 48], [-140, 58], [-165, 60]
  ]);

  // South America
  drawLand([
    [-80, 10], [-50, -5], [-35, -5], [-40, -22], [-55, -40],
    [-70, -55], [-75, -45], [-72, -18], [-80, 0]
  ]);

  // Europe & Asia (Eurasia)
  drawLand([
    [-10, 35], [0, 42], [10, 55], [30, 60], [60, 68], [90, 72],
    [130, 70], [170, 65], [145, 45], [120, 32], [105, 12],
    [100, 5], [80, 10], [70, 24], [50, 28], [35, 32], [28, 41],
    [15, 38], [-5, 36]
  ]);

  // Africa
  drawLand([
    [-15, 32], [10, 36], [32, 30], [50, 12], [42, -5],
    [32, -30], [20, -35], [12, -15], [-15, 12], [-18, 25]
  ]);

  // Australia & New Zealand
  drawLand([
    [115, -22], [130, -12], [145, -15], [152, -28],
    [142, -38], [128, -35], [115, -30]
  ]);
  drawLand([[168, -44], [174, -36], [178, -38], [172, -46]]);

  // Japan & UK & Madagascar & Indonesia
  drawLand([[130, 32], [140, 40], [142, 44], [138, 36]]);
  drawLand([[-6, 50], [-2, 58], [1, 52], [-4, 50]]);
  drawLand([[45, -12], [50, -18], [47, -25], [43, -18]]);
  drawLand([[96, 4], [108, -6], [118, -8], [102, 1]]);

  return new THREE.CanvasTexture(canvas);
}

// Convert Lat/Lng to 3D Cartesian coordinates on sphere of radius R
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export default function ThreeGlobe({
  companies,
  onSelectCompany,
  selectedCompanyId,
  isSpinning,
  spinSpeed = 1,
  onToggleSpin,
}: {
  companies: CompanyPin[];
  onSelectCompany: (companyId: string) => void;
  selectedCompanyId?: string | null;
  isSpinning: boolean;
  spinSpeed?: number;
  onToggleSpin?: () => void;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [projectedPins, setProjectedPins] = useState<
    Array<{
      company: CompanyPin;
      screenX: number;
      screenY: number;
      visible: boolean;
      scale: number;
      opacity: number;
    }>
  >([]);

  const globeGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  const GLOBE_RADIUS = 4.2;

  // Filter valid companies
  const validCompanies = companies.filter(
    (c) => c.latitude !== null && c.longitude !== null
  );

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 12.5;
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Starfield Particle Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 80;
      starPositions[i + 1] = (Math.random() - 0.5) * 80;
      starPositions[i + 2] = -15 - Math.random() * 50;
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0x8ea0a8,
      size: 0.12,
      transparent: true,
      opacity: 0.65,
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // Globe Group
    const globeGroup = new THREE.Group();
    // Default angle facing Asia / Europe / Americas
    globeGroup.rotation.y = -1.2;
    globeGroup.rotation.x = 0.25;
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // Earth Sphere Mesh
    const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthTexture = createEarthCanvasTexture();
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 15,
      specular: new THREE.Color(0x1a4555),
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // Outer Atmospheric Radial Glow Mesh
    const atmosphereGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.14, 48, 48);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.35, 0.72, 0.88, 1.0) * intensity * 1.4;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x70d6ff, 1.2);
    dirLight.position.set(12, 10, 15);
    scene.add(dirLight);

    // Mouse Drag Interactions
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !globeGroupRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      globeGroupRef.current.rotation.y += deltaX * 0.005;
      globeGroupRef.current.rotation.x += deltaY * 0.005;
      // Clamp vertical tilt
      globeGroupRef.current.rotation.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, globeGroupRef.current.rotation.x)
      );
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z += e.deltaY * 0.008;
      cameraRef.current.position.z = Math.max(7.0, Math.min(20.0, cameraRef.current.position.z));
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    // Window Resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animId: number;
    const render = () => {
      animId = requestAnimationFrame(render);

      // Auto spin
      if (isSpinning && !isDraggingRef.current && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += 0.0016 * spinSpeed;
      }

      renderer.render(scene, camera);

      // Project 3D positions of all companies onto 2D screen coordinates
      if (cameraRef.current && globeGroupRef.current && mountRef.current) {
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        const camPos = cameraRef.current.position;

        const updated = validCompanies.map((c) => {
          const localPos = latLngToVector3(c.latitude!, c.longitude!, GLOBE_RADIUS);
          const worldPos = localPos.clone().applyMatrix4(globeGroupRef.current!.matrixWorld);

          // Dot product normal vs camera view vector to determine front/back visibility
          const surfaceNormal = worldPos.clone().normalize();
          const toCamera = camPos.clone().sub(worldPos).normalize();
          const dot = surfaceNormal.dot(toCamera);

          const isVisible = dot > 0.05; // Visible if facing the camera

          // Project to 2D screen
          const proj = worldPos.clone().project(cameraRef.current!);
          const screenX = ((proj.x + 1) * w) / 2;
          const screenY = ((-proj.y + 1) * h) / 2;

          // Scale based on camera distance and angle
          const dist = worldPos.distanceTo(camPos);
          const scale = Math.max(0.6, Math.min(1.15, 14 / dist)) * (0.6 + dot * 0.4);
          const opacity = Math.max(0, Math.min(1, dot * 2.5));

          return {
            company: c,
            screenX,
            screenY,
            visible: isVisible,
            scale,
            opacity,
          };
        });

        setProjectedPins(updated);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current?.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, [validCompanies, isSpinning, spinSpeed]);

  // Zoom controls
  const handleZoomIn = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.max(7.0, cameraRef.current.position.z - 1.2);
  };

  const handleZoomOut = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.min(20.0, cameraRef.current.position.z + 1.2);
  };

  const handleReset = () => {
    if (!cameraRef.current || !globeGroupRef.current) return;
    cameraRef.current.position.z = 12.5;
    globeGroupRef.current.rotation.set(0.25, -1.2, 0);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#060908] select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* ── 3D Projected Pop-Up Company Cards (Matching Reference) ─ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {projectedPins.map(({ company, screenX, screenY, visible, scale, opacity }) => {
          if (!visible) return null;
          const isSelected = selectedCompanyId === company.id;
          const hasJobs = company.activeJobCount > 0;

          return (
            <div
              key={company.id}
              style={{
                position: "absolute",
                left: `${screenX}px`,
                top: `${screenY}px`,
                transform: `translate(-50%, -100%) scale(${scale})`,
                opacity: opacity,
                zIndex: isSelected ? 40 : Math.round(scale * 10),
                transformOrigin: "bottom center",
              }}
              className="pointer-events-auto transition-transform duration-75"
            >
              {/* 3D Card Marker Matching Reference */}
              <motion.div
                whileHover={{ scale: 1.22, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCompany(company.id);
                }}
                className={`cursor-pointer flex flex-col items-center group relative`}
              >
                {/* Outer Card Body */}
                <div
                  className={`bg-white/95 backdrop-blur-md rounded-2xl p-1.5 shadow-2xl flex flex-col items-center transition-all ${
                    hasJobs
                      ? "border-2 border-[#4E9B78] ring-4 ring-[#4E9B78]/20 shadow-[0_4px_20px_rgba(78,155,120,0.4)]"
                      : "border border-gray-300 shadow-md opacity-85"
                  }`}
                >
                  {/* Top: Company Logo */}
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden p-1 border border-gray-200">
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="font-bold text-[#0B2636] text-sm font-space-grotesk">
                        {company.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Bottom: Company Name Label */}
                  <div className="mt-1 px-1.5 py-0.5 text-center max-w-[85px]">
                    <p className="text-[10px] font-bold text-gray-900 truncate font-space-grotesk leading-tight">
                      {company.name}
                    </p>
                  </div>

                  {/* Active Job Pill Badge */}
                  <div
                    className={`absolute -top-2 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold shadow-sm flex items-center gap-0.5 ${
                      hasJobs
                        ? "bg-[#4E9B78] text-white ring-2 ring-white"
                        : "bg-gray-400 text-white ring-1 ring-white"
                    }`}
                  >
                    {hasJobs && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    <span>{company.activeJobCount}</span>
                  </div>
                </div>

                {/* Pin Tail Pointing into Sphere */}
                <div
                  className={`w-2.5 h-2.5 rotate-45 -mt-1 shadow-sm rounded-sm ${
                    hasJobs ? "bg-[#4E9B78]" : "bg-gray-300"
                  }`}
                />
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* ── Right-Side View & Navigation Dock (Matching Reference) ─ */}
      <div className="absolute right-5 top-20 z-30 flex flex-col gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-gray-200 shadow-xl">
        <button
          onClick={handleZoomIn}
          className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
          title="Zoom In"
        >
          <span className="font-extrabold text-lg leading-none">+</span>
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
          title="Zoom Out"
        >
          <span className="font-extrabold text-lg leading-none">−</span>
        </button>
        <div className="h-px bg-gray-200 my-0.5" />
        <button
          onClick={handleReset}
          className="p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors text-xs font-mono"
          title="Reset Globe Orientation"
        >
          📍
        </button>
      </div>
    </div>
  );
}
