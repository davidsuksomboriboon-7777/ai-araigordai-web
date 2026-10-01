/**
 * AI อะไรก็ได้ (AI Arai Gor Dai) - Three.js 3D Neural Engine 3.0
 * Interactive 3D AI Quantum Core, Neural Synapse Mesh & Kinetic Holographic Field
 * 
 * Brand Colors:
 * - Electric Cyan: #00C2FF
 * - Tech Blue:     #0088FF
 * - Deep Navy:     #001F54
 * - Cyber Gold:    #FACC15
 */

(function () {
  'use strict';

  // Check if WebGL is supported
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLAvailable() || typeof THREE === 'undefined') {
    console.warn('[ThreeAIEngine] WebGL or Three.js is not available. 3D background disabled.');
    return;
  }

  class ThreeAIEngine {
    constructor() {
      this.canvas = document.getElementById('three-ai-canvas');
      if (!this.canvas) {
        this.createCanvas();
      }

      this.scene = null;
      this.camera = null;
      this.renderer = null;

      // 3D Scene Components
      this.coreGroup = null;
      this.innerCore = null;
      this.outerCore = null;
      this.gyros = [];
      this.particles = null;
      this.particlePositions = null;
      this.particleVelocities = null;
      this.particleBasePositions = null;
      this.synapseLines = null;
      this.satellites = [];
      this.shockwaves = [];

      // Configuration & State
      this.isMobile = window.innerWidth < 768;
      this.particleCount = this.isMobile ? 420 : 1050;
      this.maxConnectDistance = this.isMobile ? 7.5 : 6.8;
      this.currentMode = 'quantum'; // 'quantum' | 'matrix' | 'constellation'
      
      // Interaction State
      this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, speed: 0 };
      this.prevMouse = { x: 0, y: 0 };
      this.scrollProgress = 0;
      this.targetScrollProgress = 0;
      this.isDocumentVisible = true;
      this.clock = new THREE.Clock();

      // Energy Pulse State
      this.pulseIntensity = 0;
      this.coreBaseScale = this.isMobile ? 0.8 : 1.15;

      this.init();
    }

    createCanvas() {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'three-ai-canvas';
      this.canvas.className = 'fixed inset-0 w-full h-full pointer-events-none z-[1] transition-opacity duration-1000';
      // Insert canvas before main content
      document.body.insertBefore(this.canvas, document.body.firstChild);
    }

    init() {
      // 1. Scene setup
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x0a192f, 0.012);

      // 2. Camera setup
      const fov = this.isMobile ? 65 : 55;
      const aspect = window.innerWidth / window.innerHeight;
      this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
      this.camera.position.set(0, 0, 36);

      // 3. Renderer setup
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: !this.isMobile,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // 4. Lighting
      this.setupLights();

      // 5. Build 3D Objects
      this.createGlowTexture();
      this.buildQuantumCore();
      this.buildGyroRings();
      this.buildNeuralConstellation();
      this.buildSatellites();

      // 6. Setup Event Listeners
      this.setupEventListeners();

      // 7. Inject 3D HUD Controller
      this.injectHUDController();

      // 8. Setup 3D Card Tilt Physics
      this.setupCardTiltPhysics();

      // 9. Start Animation Loop
      this.animate = this.animate.bind(this);
      requestAnimationFrame(this.animate);

      console.log('⚡ [ThreeAIEngine] 3D Neural Engine 3.0 initialized successfully.');
    }

    setupLights() {
      // Ambient Light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      this.scene.add(ambientLight);

      // Point Lights (Cyan & Blue Glow)
      this.coreLight = new THREE.PointLight(0x00c2ff, 3.5, 50);
      this.coreLight.position.set(0, 0, 0);
      this.scene.add(this.coreLight);

      const secondaryLight = new THREE.PointLight(0x0088ff, 2.0, 60);
      secondaryLight.position.set(15, 12, 10);
      this.scene.add(secondaryLight);

      const accentLight = new THREE.PointLight(0xfacc15, 1.2, 40);
      accentLight.position.set(-15, -10, 10);
      this.scene.add(accentLight);
    }

    createGlowTexture() {
      // Dynamic High-Res Radial Glow Sprite
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(0.2, 'rgba(0, 194, 255, 0.85)');
      gradient.addColorStop(0.5, 'rgba(0, 136, 255, 0.45)');
      gradient.addColorStop(0.8, 'rgba(0, 82, 204, 0.15)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);

      this.particleTexture = new THREE.CanvasTexture(canvas);
    }

    buildQuantumCore() {
      this.coreGroup = new THREE.Group();
      
      // Position core towards the right/center on desktop to complement hero text
      const initialX = this.isMobile ? 0 : 12;
      const initialY = this.isMobile ? 3 : 2;
      this.coreGroup.position.set(initialX, initialY, -2);
      this.coreGroup.scale.setScalar(this.coreBaseScale);

      // 1. Inner Luminous Icosahedron Core
      const innerGeo = new THREE.IcosahedronGeometry(2.8, 1);
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0x00c2ff,
        emissive: 0x0052cc,
        emissiveIntensity: 0.65,
        wireframe: true,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      this.innerCore = new THREE.Mesh(innerGeo, innerMat);
      this.coreGroup.add(this.innerCore);

      // 2. Inner Glowing Core Sphere
      const sphereGeo = new THREE.SphereGeometry(1.6, 24, 24);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0x00e1ff,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });
      this.centerOrb = new THREE.Mesh(sphereGeo, sphereMat);
      this.coreGroup.add(this.centerOrb);

      // 3. Outer Synaptic Lattice Shell
      const outerGeo = new THREE.IcosahedronGeometry(4.2, 2);
      const outerMat = new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        wireframe: true,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending
      });
      this.outerCore = new THREE.Mesh(outerGeo, outerMat);
      this.coreGroup.add(this.outerCore);

      // 4. Core Node Vertices (Glowing Sparkles at vertices)
      const vertexGeo = new THREE.BufferGeometry();
      const vertexPos = innerGeo.attributes.position.array;
      vertexGeo.setAttribute('position', new THREE.BufferAttribute(vertexPos, 3));
      
      const vertexMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.35,
        map: this.particleTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      this.coreNodes = new THREE.Points(vertexGeo, vertexMat);
      this.coreGroup.add(this.coreNodes);

      this.scene.add(this.coreGroup);
    }

    buildGyroRings() {
      // 3 Concentric Gyroscope Rings (Quantum AI Processor)
      const ringConfigs = [
        { radius: 5.6, tube: 0.04, color: 0x00c2ff, rotSpeed: { x: 0.008, y: 0.012, z: 0.005 }, rot: [Math.PI / 4, 0, 0] },
        { radius: 6.8, tube: 0.035, color: 0x0088ff, rotSpeed: { x: -0.01, y: 0.007, z: 0.009 }, rot: [0, Math.PI / 3, 0] },
        { radius: 8.0, tube: 0.03, color: 0xfacc15, rotSpeed: { x: 0.006, y: -0.011, z: -0.007 }, rot: [Math.PI / 6, 0, Math.PI / 4] }
      ];

      ringConfigs.forEach((cfg) => {
        const geo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 90);
        const mat = new THREE.MeshBasicMaterial({
          color: cfg.color,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Mesh(geo, mat);
        ring.rotation.set(...cfg.rot);
        ring.userData = { rotSpeed: cfg.rotSpeed };
        this.coreGroup.add(ring);
        this.gyros.push(ring);
      });
    }

    buildSatellites() {
      // Orbiting Satellite Data Nodes
      const satCount = this.isMobile ? 6 : 12;
      const satGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const satMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        blending: THREE.AdditiveBlending
      });

      for (let i = 0; i < satCount; i++) {
        const sat = new THREE.Mesh(satGeo, satMat);
        sat.userData = {
          orbitRadius: 4.8 + (i % 3) * 1.5,
          angle: (i / satCount) * Math.PI * 2,
          speed: 0.012 + (i % 4) * 0.005,
          inclination: (i % 2 === 0 ? 1 : -1) * (0.3 + (i % 3) * 0.25)
        };
        this.coreGroup.add(sat);
        this.satellites.push(sat);
      }
    }

    buildNeuralConstellation() {
      const count = this.particleCount;
      const positions = new Float32Array(count * 3);
      const basePositions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      const colorPalette = [
        new THREE.Color(0x00c2ff), // Cyan
        new THREE.Color(0x0088ff), // Tech Blue
        new THREE.Color(0x38bdf8), // Sky Blue
        new THREE.Color(0xfacc15)  // Golden accent (10%)
      ];

      const spreadX = this.isMobile ? 40 : 85;
      const spreadY = this.isMobile ? 55 : 65;
      const spreadZ = 35;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = (Math.random() - 0.5) * spreadX;
        const y = (Math.random() - 0.5) * spreadY;
        const z = (Math.random() - 0.5) * spreadZ;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        basePositions[i3] = x;
        basePositions[i3 + 1] = y;
        basePositions[i3 + 2] = z;

        velocities[i3] = (Math.random() - 0.5) * 0.015;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.015;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.015;

        // Choose color
        const isGold = Math.random() < 0.1;
        const c = isGold ? colorPalette[3] : colorPalette[Math.floor(Math.random() * 3)];
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: this.isMobile ? 0.75 : 0.95,
        map: this.particleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.particles = new THREE.Points(geometry, material);
      this.scene.add(this.particles);

      this.particlePositions = positions;
      this.particleBasePositions = basePositions;
      this.particleVelocities = velocities;

      // Dynamic Synapse Connection Lines
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00c2ff,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending
      });

      // Max lines allocation
      const maxLines = this.isMobile ? 250 : 650;
      const linePositions = new Float32Array(maxLines * 6);
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

      this.synapseLines = new THREE.LineSegments(lineGeo, lineMat);
      this.scene.add(this.synapseLines);
      this.maxLines = maxLines;
    }

    triggerEnergyPulse() {
      this.pulseIntensity = 1.0;

      // Create expanding shockwave ring
      const ringGeo = new THREE.RingGeometry(0.5, 0.85, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      const wave = new THREE.Mesh(ringGeo, ringMat);
      wave.position.copy(this.coreGroup.position);
      wave.rotation.x = Math.PI / 2;
      this.scene.add(wave);

      this.shockwaves.push({
        mesh: wave,
        scale: 1,
        opacity: 0.9
      });

      // Flash core light
      if (this.coreLight) {
        this.coreLight.intensity = 8.0;
      }

      // Vibrate nearby particles outward
      const pos = this.particlePositions;
      const coreX = this.coreGroup.position.x;
      const coreY = this.coreGroup.position.y;
      const coreZ = this.coreGroup.position.z;

      for (let i = 0; i < this.particleCount; i++) {
        const i3 = i * 3;
        const dx = pos[i3] - coreX;
        const dy = pos[i3 + 1] - coreY;
        const dz = pos[i3 + 2] - coreZ;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 18) {
          const factor = (18 - dist) * 0.12;
          this.particleVelocities[i3] += (dx / dist) * factor;
          this.particleVelocities[i3 + 1] += (dy / dist) * factor;
          this.particleVelocities[i3 + 2] += (dz / dist) * factor;
        }
      }

      // Dispatch UI notification if HUD is active
      const statusBadge = document.getElementById('three-hud-pulse-btn');
      if (statusBadge) {
        statusBadge.classList.add('scale-110', 'bg-cyan-400', 'text-slate-950');
        setTimeout(() => {
          statusBadge.classList.remove('scale-110', 'bg-cyan-400', 'text-slate-950');
        }, 400);
      }
    }

    setMode(mode) {
      this.currentMode = mode;
      const pos = this.particlePositions;
      const base = this.particleBasePositions;

      if (mode === 'matrix') {
        // Organize into digital grid/matrix pillars
        for (let i = 0; i < this.particleCount; i++) {
          const i3 = i * 3;
          base[i3] = (i % 25 - 12) * 2.8;
          base[i3 + 1] = (Math.floor(i / 25) % 35 - 17) * 2.2;
          base[i3 + 2] = (Math.sin(i * 0.1) * 8);
        }
      } else if (mode === 'constellation') {
        // Expand into wide cosmic field
        for (let i = 0; i < this.particleCount; i++) {
          const i3 = i * 3;
          const u = Math.random();
          const v = Math.random();
          const theta = u * 2.0 * Math.PI;
          const phi = Math.acos(2.0 * v - 1.0);
          const r = Math.cbrt(Math.random()) * 45;
          base[i3] = r * Math.sin(phi) * Math.cos(theta);
          base[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          base[i3 + 2] = r * Math.cos(phi);
        }
      } else {
        // Quantum (Default natural organic neural cloud)
        const spreadX = this.isMobile ? 40 : 85;
        const spreadY = this.isMobile ? 55 : 65;
        const spreadZ = 35;
        for (let i = 0; i < this.particleCount; i++) {
          const i3 = i * 3;
          base[i3] = (Math.random() - 0.5) * spreadX;
          base[i3 + 1] = (Math.random() - 0.5) * spreadY;
          base[i3 + 2] = (Math.random() - 0.5) * spreadZ;
        }
      }

      this.triggerEnergyPulse();
    }

    setupEventListeners() {
      // 1. Mouse / Pointer Move
      window.addEventListener('pointermove', (e) => {
        this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
        
        // Speed calculation
        const dx = this.mouse.targetX - this.prevMouse.x;
        const dy = this.mouse.targetY - this.prevMouse.y;
        this.mouse.speed = Math.sqrt(dx * dx + dy * dy);
        this.prevMouse.x = this.mouse.targetX;
        this.prevMouse.y = this.mouse.targetY;
      }, { passive: true });

      // 2. Click / Tap -> Energy Burst
      window.addEventListener('click', (e) => {
        // Avoid clicks on input, button, or links
        const tag = e.target.tagName.toLowerCase();
        if (['input', 'textarea', 'button', 'a', 'select', 'video'].includes(tag) || e.target.closest('button, a, form')) {
          return;
        }
        this.triggerEnergyPulse();
      });

      // 3. Scroll Tracking
      window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.targetScrollProgress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      }, { passive: true });

      // 4. Window Resize
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.isMobile = window.innerWidth < 768;
          this.camera.aspect = window.innerWidth / window.innerHeight;
          this.camera.fov = this.isMobile ? 65 : 55;
          this.camera.updateProjectionMatrix();
          this.renderer.setSize(window.innerWidth, window.innerHeight);
          this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }, 150);
      });

      // 5. Visibility Change (Pause rendering when tab inactive to save power)
      document.addEventListener('visibilitychange', () => {
        this.isDocumentVisible = !document.hidden;
      });
    }

    setupCardTiltPhysics() {
      // Apply subtle 3D Perspective Tilt on key hero cards and course cards
      const tiltCards = document.querySelectorAll(
        '#hero-video-trigger-box, .card-hover-effect, #instructor .rounded-3xl'
      );

      tiltCards.forEach(card => {
        let bounds = null;

        card.addEventListener('mouseenter', () => {
          bounds = card.getBoundingClientRect();
          card.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';
          card.style.transformStyle = 'preserve-3d';
        });

        card.addEventListener('mousemove', (e) => {
          if (!bounds) bounds = card.getBoundingClientRect();
          const x = e.clientX - bounds.left;
          const y = e.clientY - bounds.top;
          const centerX = bounds.width / 2;
          const centerY = bounds.height / 2;
          const rotateX = ((y - centerY) / centerY) * -7;
          const rotateY = ((x - centerX) / centerX) * 7;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease';
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
      });
    }

    injectHUDController() {
      // Check if already injected
      if (document.getElementById('three-hud-controller')) return;

      const hud = document.createElement('div');
      hud.id = 'three-hud-controller';
      hud.className = 'fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2 select-none font-heading transition-all duration-300';

      hud.innerHTML = `
        <!-- Floating 3D AI HUD Pill Widget -->
        <div id="three-hud-panel" class="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-cyan-400/30 text-white text-xs shadow-2xl shadow-cyan-500/20">
          <div class="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>3D Neural AI</span>
          </div>

          <div class="h-3 w-[1px] bg-slate-700"></div>

          <!-- Mode Switcher -->
          <div class="flex items-center gap-1">
            <button id="three-mode-core" class="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500 hover:text-slate-950 transition-all">
              Core
            </button>
            <button id="three-mode-matrix" class="px-2 py-0.5 rounded-lg text-[10px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
              Matrix
            </button>
            <button id="three-mode-cosmic" class="px-2 py-0.5 rounded-lg text-[10px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
              Cosmic
            </button>
          </div>

          <div class="h-3 w-[1px] bg-slate-700"></div>

          <!-- Pulse Trigger Button -->
          <button id="three-hud-pulse-btn" class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow flex items-center gap-1 transition-all active:scale-95" title="ส่งคลื่นพลังงาน AI">
            <span>💥 Pulse</span>
          </button>

          <!-- Toggle Minimize -->
          <button id="three-hud-minimize-btn" class="p-1 rounded-lg text-slate-400 hover:text-white transition-colors" title="ย่อหน้าต่าง">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
          </button>
        </div>

        <!-- Mini Floating Trigger Pill -->
        <button id="three-hud-pill-btn" class="sm:hidden px-2.5 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-cyan-400/40 text-cyan-400 text-[11px] font-bold shadow-lg flex items-center gap-1.5 active:scale-95">
          <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>3D AI</span>
        </button>
      `;

      document.body.appendChild(hud);

      // Bind HUD Events
      const pulseBtn = document.getElementById('three-hud-pulse-btn');
      if (pulseBtn) {
        pulseBtn.addEventListener('click', () => this.triggerEnergyPulse());
      }

      const modeCore = document.getElementById('three-mode-core');
      const modeMatrix = document.getElementById('three-mode-matrix');
      const modeCosmic = document.getElementById('three-mode-cosmic');

      const updateModeBtnStyles = (activeBtn) => {
        [modeCore, modeMatrix, modeCosmic].forEach(btn => {
          if (btn) {
            btn.className = 'px-2 py-0.5 rounded-lg text-[10px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all';
          }
        });
        if (activeBtn) {
          activeBtn.className = 'px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500 hover:text-slate-950 transition-all';
        }
      };

      if (modeCore) {
        modeCore.addEventListener('click', () => {
          this.setMode('quantum');
          updateModeBtnStyles(modeCore);
        });
      }
      if (modeMatrix) {
        modeMatrix.addEventListener('click', () => {
          this.setMode('matrix');
          updateModeBtnStyles(modeMatrix);
        });
      }
      if (modeCosmic) {
        modeCosmic.addEventListener('click', () => {
          this.setMode('constellation');
          updateModeBtnStyles(modeCosmic);
        });
      }

      // Minimize / Expand logic
      const panel = document.getElementById('three-hud-panel');
      const minBtn = document.getElementById('three-hud-minimize-btn');
      const pillBtn = document.getElementById('three-hud-pill-btn');

      if (minBtn && panel && pillBtn) {
        minBtn.addEventListener('click', () => {
          panel.classList.add('hidden');
          pillBtn.classList.remove('sm:hidden');
        });

        pillBtn.addEventListener('click', () => {
          if (panel.classList.contains('hidden')) {
            panel.classList.remove('hidden');
            pillBtn.classList.add('sm:hidden');
          } else {
            this.triggerEnergyPulse();
          }
        });
      }
    }

    animate() {
      requestAnimationFrame(this.animate);

      if (!this.isDocumentVisible) return;

      const delta = Math.min(this.clock.getDelta(), 0.1);
      const time = this.clock.getElapsedTime();

      // 1. Smooth Mouse Lerp
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

      // 2. Smooth Scroll Lerp
      this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.06;

      // 3. Camera Parallax & Scroll Choreography
      this.camera.position.x = this.mouse.x * 2.5;
      this.camera.position.y = this.mouse.y * 2.0 - this.scrollProgress * 15;
      this.camera.position.z = 36 + Math.sin(this.scrollProgress * Math.PI) * 6;
      this.camera.lookAt(0, -this.scrollProgress * 12, 0);

      // 4. Animate 3D Quantum Core
      if (this.coreGroup) {
        // Continuous organic rotation
        this.innerCore.rotation.x += 0.005 + this.mouse.speed * 0.05;
        this.innerCore.rotation.y += 0.008 + this.mouse.speed * 0.08;
        this.outerCore.rotation.x -= 0.004;
        this.outerCore.rotation.y -= 0.006;

        // Breathing deformation
        const breath = 1.0 + Math.sin(time * 2.2) * 0.045 + this.pulseIntensity * 0.35;
        this.innerCore.scale.setScalar(breath);
        this.outerCore.scale.setScalar(breath * 1.02);

        // Core responsive tilt to cursor
        this.coreGroup.rotation.y = this.mouse.x * 0.45;
        this.coreGroup.rotation.x = -this.mouse.y * 0.35;

        // Position choreography on scroll (glides softly as user scrolls down)
        const baseY = this.isMobile ? 3 : 2;
        const targetCoreY = baseY - this.scrollProgress * 22;
        this.coreGroup.position.y += (targetCoreY - this.coreGroup.position.y) * 0.08;

        // Gyroscope rings rotation
        this.gyros.forEach(ring => {
          const s = ring.userData.rotSpeed;
          ring.rotation.x += s.x + this.pulseIntensity * 0.02;
          ring.rotation.y += s.y + this.pulseIntensity * 0.02;
          ring.rotation.z += s.z;
        });

        // Orbiting Satellites
        this.satellites.forEach(sat => {
          const d = sat.userData;
          d.angle += d.speed + this.pulseIntensity * 0.03;
          sat.position.x = Math.cos(d.angle) * d.orbitRadius;
          sat.position.y = Math.sin(d.angle * 1.2) * (d.orbitRadius * 0.5) * d.inclination;
          sat.position.z = Math.sin(d.angle) * d.orbitRadius;
        });
      }

      // 5. Animate Particle Field & Synaptic Connections
      if (this.particles && this.particlePositions) {
        const pos = this.particlePositions;
        const base = this.particleBasePositions;
        const vel = this.particleVelocities;
        const count = this.particleCount;

        // Animate particles towards their base positions with drift
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;

          // Organic float
          const floatOffset = Math.sin(time * 0.8 + i) * 0.012;
          pos[i3] += vel[i3] + floatOffset;
          pos[i3 + 1] += vel[i3 + 1] + floatOffset;
          pos[i3 + 2] += vel[i3 + 2];

          // Damping velocities back to base
          vel[i3] *= 0.96;
          vel[i3 + 1] *= 0.96;
          vel[i3 + 2] *= 0.96;

          // Return force to base
          pos[i3] += (base[i3] - pos[i3]) * 0.015;
          pos[i3 + 1] += (base[i3 + 1] - pos[i3 + 1]) * 0.015;
          pos[i3 + 2] += (base[i3 + 2] - pos[i3 + 2]) * 0.015;
        }

        this.particles.geometry.attributes.position.needsUpdate = true;

        // Dynamic Synaptic Line Connections
        if (this.synapseLines) {
          const linePos = this.synapseLines.geometry.attributes.position.array;
          let lineIdx = 0;
          const maxDistSq = this.maxConnectDistance * this.maxConnectDistance;
          const step = this.isMobile ? 3 : 2; // Performance skip

          for (let i = 0; i < count; i += step) {
            if (lineIdx >= this.maxLines * 6) break;
            const i3 = i * 3;
            const x1 = pos[i3];
            const y1 = pos[i3 + 1];
            const z1 = pos[i3 + 2];

            // Connect with nearby neighbours
            for (let j = i + 1; j < Math.min(i + 14, count); j++) {
              if (lineIdx >= this.maxLines * 6) break;
              const j3 = j * 3;
              const dx = x1 - pos[j3];
              const dy = y1 - pos[j3 + 1];
              const dz = z1 - pos[j3 + 2];
              const distSq = dx * dx + dy * dy + dz * dz;

              if (distSq < maxDistSq) {
                linePos[lineIdx++] = x1;
                linePos[lineIdx++] = y1;
                linePos[lineIdx++] = z1;
                linePos[lineIdx++] = pos[j3];
                linePos[lineIdx++] = pos[j3 + 1];
                linePos[lineIdx++] = pos[j3 + 2];
              }
            }
          }

          // Clear remaining unused line coordinates
          for (let k = lineIdx; k < this.maxLines * 6; k++) {
            linePos[k] = 0;
          }

          this.synapseLines.geometry.attributes.position.needsUpdate = true;
        }
      }

      // 6. Animate Shockwaves
      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const sw = this.shockwaves[i];
        sw.scale += delta * 24.0;
        sw.opacity -= delta * 1.2;
        sw.mesh.scale.setScalar(sw.scale);
        sw.mesh.material.opacity = Math.max(0, sw.opacity);

        if (sw.opacity <= 0) {
          this.scene.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          sw.mesh.material.dispose();
          this.shockwaves.splice(i, 1);
        }
      }

      // 7. Decay Pulse Intensity & Light
      if (this.pulseIntensity > 0) {
        this.pulseIntensity = Math.max(0, this.pulseIntensity - delta * 2.5);
      }
      if (this.coreLight && this.coreLight.intensity > 3.5) {
        this.coreLight.intensity = Math.max(3.5, this.coreLight.intensity - delta * 6.0);
      }

      // 8. Render
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Auto-instantiate when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.threeAIEngine = new ThreeAIEngine();
    });
  } else {
    window.threeAIEngine = new ThreeAIEngine();
  }

})();
