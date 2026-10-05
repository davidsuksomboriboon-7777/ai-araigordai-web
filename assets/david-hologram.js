/**
 * David AI Assistant - 3D WebGL Hologram Motion Engine
 * Powered by Three.js
 * 
 * Features:
 * - 3D Die-cut Avatar Mesh with Hologram Shader (Scanlines, Fresnel Rim Glow, Chromatic Shimmer)
 * - Holographic Projector Base: Dual Spinning Sci-Fi Rings & Volumetric Light Beam
 * - Ascending Cyber Particles rising through the hologram
 * - 3D Motion: Floating/Levitation, Breathing Sway, and Interactive Mouse Parallax (Facing the User)
 * - Click & Hover Reactions: Holographic Pulse Shockwave & Interactive Dialogue Switching
 */

(function () {
  'use strict';

  // Check if WebGL & Three.js are available
  function isWebGLSupported() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLSupported() || typeof THREE === 'undefined') {
    console.warn('[DavidHologram] WebGL or Three.js is not available.');
    return;
  }

  class DavidHologramAssistant {
    constructor() {
      this.container = document.getElementById('david-hologram-container');
      this.canvas = document.getElementById('david-hologram-canvas');
      this.widget = document.getElementById('remotion-assistant-widget');
      this.speechBubble = document.getElementById('remotion-speech-bubble');
      this.speechText = document.querySelector('.speech-bubble-text');

      if (!this.container || !this.canvas) return;

      this.scene = null;
      this.camera = null;
      this.renderer = null;

      // 3D Objects
      this.avatarMesh = null;
      this.holoMaterial = null;
      this.projectorGroup = null;
      this.ring1 = null;
      this.ring2 = null;
      this.gridRing = null;
      this.beamCone = null;
      this.particles = null;
      this.particlePositions = null;
      this.shockwaves = [];

      // Dialogue tips on click
      this.dialogues = [
        '"เว็ปไซต์นี้ก็ใช้ AI ทำให้นะครับ"',
        '"เรียน AI วันนี้ นำหน้าคู่แข่งไป 10 ก้าวแน่นอนครับ!"',
        '"สงสัยตรงไหน ทัก LINE OA หรือโทรสอบถามได้ตลอดนะครับ"',
        '"คอร์ส Basic AI 990.- สอนตั้งแต่ศูนย์จนสร้างรายได้จริง"',
        '"มีคอร์ส AI สำหรับธุรกิจ 1,290.- ด้วยนะครับ เหมาะกับเจ้าของแบรนด์มาก!"',
        '"ยินดีต้อนรับสู่ AI อะไรก็ได้ ครับ! พร้อมลุยไปด้วยกันไหมครับ?"'
      ];
      this.dialogueIndex = 0;

      // Interaction State
      this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
      this.isHovered = false;
      this.isVisible = false;
      this.clock = new THREE.Clock();
      this.animFrameId = null;

      this.init();
    }

    init() {
      const rect = this.container.getBoundingClientRect();
      const width = rect.width || 176;
      const height = rect.height || 240;

      // 1. Scene
      this.scene = new THREE.Scene();

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
      this.camera.position.set(0, 0.15, 3.8);

      // 3. Renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height, false);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // 4. Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      this.scene.add(ambientLight);

      const cyanLight = new THREE.PointLight(0x00c2ff, 3.5, 10);
      cyanLight.position.set(0, 0.5, 2);
      this.scene.add(cyanLight);

      // 5. Load David Cutout Texture & Create Mesh
      this.createHologramAvatar();

      // 6. Create Hologram Projector Base & Beam
      this.createProjectorBase();

      // 7. Create Rising Cyber Particles
      this.createCyberParticles();

      // 8. Event Listeners
      this.setupEvents();

      // 9. Start Loop
      this.animate();
    }

    createHologramAvatar() {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        'assets/images/david-assistant-cutout.png',
        (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;

          // Custom Hologram Shader Material
          const hologramShader = {
            uniforms: {
              uTexture: { value: texture },
              uTime: { value: 0 },
              uColor: { value: new THREE.Color(0x00c2ff) },      // Electric Cyan
              uRimColor: { value: new THREE.Color(0x38bdf8) },   // Bright Ice Blue
              uGlitch: { value: 0.0 },
              uHover: { value: 0.0 }
            },
            vertexShader: `
              varying vec2 vUv;
              varying vec3 vNormal;
              varying vec3 vPosition;
              uniform float uTime;
              uniform float uGlitch;

              void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vec3 pos = position;

                // Subtle organic 3D breathing displacement
                pos.z += sin(pos.y * 3.5 + uTime * 2.5) * 0.02;

                // Occasional subtle holographic glitch horizontal slice
                if (uGlitch > 0.5) {
                  float slice = step(0.85, sin(pos.y * 25.0 + uTime * 30.0));
                  pos.x += slice * 0.03 * sin(uTime * 40.0);
                }

                vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
              }
            `,
            fragmentShader: `
              varying vec2 vUv;
              varying vec3 vNormal;
              varying vec3 vPosition;
              uniform sampler2D uTexture;
              uniform float uTime;
              uniform vec3 uColor;
              uniform vec3 uRimColor;
              uniform float uGlitch;
              uniform float uHover;

              void main() {
                vec4 tex = texture2D(uTexture, vUv);
                if (tex.a < 0.05) discard;

                // 1. Moving Horizontal Hologram Scanlines
                float scanlines = sin(vUv.y * 120.0 - uTime * 5.0) * 0.12;

                // 2. High-energy vertical sweeping beam
                float sweep = smoothstep(0.12, 0.0, abs(fract(vUv.y * 0.7 - uTime * 0.4) - 0.5));

                // 3. Hologram Color Tint & Shimmer
                vec3 holo = mix(tex.rgb, uColor, 0.28 + uHover * 0.15);
                holo += uColor * scanlines;
                holo += uRimColor * (sweep * 0.45);

                // 4. Edge Fresnel glow
                vec3 viewDir = normalize(-vPosition);
                float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.5);
                holo += uRimColor * (fresnel * 0.5);

                // 5. Glitch color flicker
                if (uGlitch > 0.6) {
                  holo += vec3(0.1, 0.3, 0.5) * step(0.9, sin(vUv.y * 40.0 + uTime * 50.0));
                }

                // 6. Pulsing Transparency
                float alpha = tex.a * (0.92 + 0.08 * sin(uTime * 3.0) + uHover * 0.08);

                gl_FragColor = vec4(holo, alpha);
              }
            `,
            transparent: true,
            side: THREE.DoubleSide
          };

          this.holoMaterial = new THREE.ShaderMaterial(hologramShader);

          // Geometry: Plane with 1:1 aspect ratio matching David's cutout
          const geometry = new THREE.PlaneGeometry(2.35, 2.35, 32, 32);
          this.avatarMesh = new THREE.Mesh(geometry, this.holoMaterial);
          this.avatarMesh.position.set(0, 0.15, 0);

          this.scene.add(this.avatarMesh);
        },
        undefined,
        (err) => console.error('[DavidHologram] Failed to load cutout texture:', err)
      );
    }

    createProjectorBase() {
      this.projectorGroup = new THREE.Group();
      this.projectorGroup.position.set(0, -0.95, 0);

      // 1. Inner Neon Ring
      const ringGeo1 = new THREE.RingGeometry(0.55, 0.62, 32);
      const ringMat1 = new THREE.MeshBasicMaterial({
        color: 0x00c2ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      this.ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      this.ring1.rotation.x = Math.PI / 2.3;
      this.projectorGroup.add(this.ring1);

      // 2. Outer Rotating Sci-Fi Ring
      const ringGeo2 = new THREE.RingGeometry(0.72, 0.77, 32);
      const ringMat2 = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      this.ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      this.ring2.rotation.x = Math.PI / 2.3;
      this.projectorGroup.add(this.ring2);

      // 3. Grid Radar Ring
      const gridGeo = new THREE.RingGeometry(0.2, 0.45, 16);
      const gridMat = new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        side: THREE.DoubleSide,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      this.gridRing = new THREE.Mesh(gridGeo, gridMat);
      this.gridRing.rotation.x = Math.PI / 2.3;
      this.projectorGroup.add(this.gridRing);

      // 4. Volumetric Light Cone Projector Beam
      const coneGeo = new THREE.ConeGeometry(0.85, 2.1, 32, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0x00c2ff,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      this.beamCone = new THREE.Mesh(coneGeo, coneMat);
      this.beamCone.position.set(0, 1.05, 0);
      this.beamCone.rotation.x = Math.PI; // upside down pointing up
      this.projectorGroup.add(this.beamCone);

      this.scene.add(this.projectorGroup);
    }

    createCyberParticles() {
      const particleCount = 45;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(particleCount * 3);
      this.particleVelocities = [];

      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 1.4;
        pos[i * 3 + 1] = -0.9 + Math.random() * 2.2;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;

        this.particleVelocities.push({
          y: 0.4 + Math.random() * 0.6,
          sway: Math.random() * 2
        });
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

      // Circular Glow Point Material
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.3, 'rgba(0, 194, 255, 0.8)');
      grad.addColorStop(1, 'rgba(0, 194, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);

      const pTexture = new THREE.CanvasTexture(canvas);

      const mat = new THREE.PointsMaterial({
        size: 0.08,
        map: pTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.75
      });

      this.particles = new THREE.Points(geo, mat);
      this.particlePositions = pos;
      this.scene.add(this.particles);
    }

    createShockwave() {
      const ringGeo = new THREE.RingGeometry(0.1, 0.16, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const mesh = new THREE.Mesh(ringGeo, ringMat);
      mesh.position.set(0, 0.2, 0.1);
      this.scene.add(mesh);

      this.shockwaves.push({
        mesh,
        scale: 1.0,
        opacity: 1.0
      });
    }

    setupEvents() {
      // 1. Mouse move on window for 3D parallax tracking
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.mouse.targetX = x;
        this.mouse.targetY = y;
      });

      // 2. Hover effect on container
      this.container.addEventListener('mouseenter', () => {
        this.isHovered = true;
      });

      this.container.addEventListener('mouseleave', () => {
        this.isHovered = false;
      });

      // 3. Click interaction: shockwave & dialogue switch
      this.container.addEventListener('click', (e) => {
        e.stopPropagation();
        this.createShockwave();

        // Switch dialogue
        this.dialogueIndex = (this.dialogueIndex + 1) % this.dialogues.length;
        if (this.speechText) {
          this.speechText.style.opacity = '0';
          setTimeout(() => {
            this.speechText.textContent = this.dialogues[this.dialogueIndex];
            this.speechText.style.opacity = '1';
          }, 150);
        }

        // Show bubble if hidden
        if (this.speechBubble && this.speechBubble.classList.contains('hidden')) {
          this.speechBubble.classList.remove('hidden');
        }
      });

      // 4. Resize observer
      const resizeObserver = new ResizeObserver(() => this.onResize());
      resizeObserver.observe(this.container);

      // 5. Visibility / Intersection observer
      if (this.widget) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            this.isVisible = entry.isIntersecting && !this.widget.classList.contains('hidden');
          });
        }, { threshold: 0.05 });
        observer.observe(this.widget);
      } else {
        this.isVisible = true;
      }
    }

    onResize() {
      if (!this.container || !this.renderer || !this.camera) return;
      const rect = this.container.getBoundingClientRect();
      const width = rect.width || 176;
      const height = rect.height || 240;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
    }

    animate() {
      this.animFrameId = requestAnimationFrame(() => this.animate());

      const delta = this.clock.getDelta();
      const time = this.clock.getElapsedTime();

      // Smooth mouse lerping
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

      // 1. Animate Avatar Mesh (3D Motion)
      if (this.avatarMesh) {
        // Floating levitation
        const levitation = Math.sin(time * 2.2) * 0.06;
        this.avatarMesh.position.y = 0.15 + levitation;

        // Subtle 3D breathing sway
        const breathingSway = Math.sin(time * 1.5) * 0.02;
        this.avatarMesh.rotation.z = breathingSway;

        // 3D Parallax: Head/body turns to look at the cursor
        const targetRotY = this.mouse.x * 0.4;
        const targetRotX = -this.mouse.y * 0.2;
        this.avatarMesh.rotation.y = THREE.MathUtils.lerp(this.avatarMesh.rotation.y, targetRotY, 0.08);
        this.avatarMesh.rotation.x = THREE.MathUtils.lerp(this.avatarMesh.rotation.x, targetRotX, 0.08);

        // Update Shader Uniforms
        if (this.holoMaterial && this.holoMaterial.uniforms) {
          this.holoMaterial.uniforms.uTime.value = time;

          // Occasional random glitch pulse every few seconds
          const glitchTrigger = Math.sin(time * 0.8) > 0.94 ? 1.0 : 0.0;
          this.holoMaterial.uniforms.uGlitch.value = glitchTrigger;

          // Hover transition
          const targetHover = this.isHovered ? 1.0 : 0.0;
          this.holoMaterial.uniforms.uHover.value = THREE.MathUtils.lerp(
            this.holoMaterial.uniforms.uHover.value,
            targetHover,
            0.1
          );
        }
      }

      // 2. Animate Projector Base Rings
      if (this.ring1) this.ring1.rotation.z += delta * (this.isHovered ? 2.5 : 1.2);
      if (this.ring2) this.ring2.rotation.z -= delta * (this.isHovered ? 1.8 : 0.8);
      if (this.gridRing) this.gridRing.rotation.z += delta * 0.5;

      if (this.beamCone) {
        this.beamCone.material.opacity = 0.12 + 0.05 * Math.sin(time * 4.0) + (this.isHovered ? 0.08 : 0);
      }

      // 3. Animate Ascending Cyber Particles
      if (this.particles && this.particlePositions) {
        const positions = this.particlePositions;
        const count = positions.length / 3;

        for (let i = 0; i < count; i++) {
          const v = this.particleVelocities[i];
          const speedMultiplier = this.isHovered ? 1.8 : 1.0;
          positions[i * 3 + 1] += v.y * delta * speedMultiplier;
          positions[i * 3] += Math.sin(time * 2.0 + v.sway) * delta * 0.15;

          // Reset to bottom if past top
          if (positions[i * 3 + 1] > 1.3) {
            positions[i * 3 + 1] = -0.9;
            positions[i * 3] = (Math.random() - 0.5) * 1.2;
          }
        }
        this.particles.geometry.attributes.position.needsUpdate = true;
      }

      // 4. Animate Shockwaves
      for (let i = this.shockwaves.length - 1; i >= 0; i--) {
        const sw = this.shockwaves[i];
        sw.scale += delta * 4.5;
        sw.opacity -= delta * 2.2;
        sw.mesh.scale.set(sw.scale, sw.scale, 1);
        sw.mesh.material.opacity = Math.max(0, sw.opacity);

        if (sw.opacity <= 0) {
          this.scene.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          sw.mesh.material.dispose();
          this.shockwaves.splice(i, 1);
        }
      }

      // 5. Render
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.davidHologram = new DavidHologramAssistant();
    });
  } else {
    window.davidHologram = new DavidHologramAssistant();
  }

})();
