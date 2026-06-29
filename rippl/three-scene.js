import * as THREE from './three.module.min.js';

const canvas = document.querySelector('#webgl');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;

if (!reduced && canvas && 'WebGL2RenderingContext' in window) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !coarse, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.15 : 1.5));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, innerWidth / innerHeight, .1, 100);
  camera.position.set(0, .2, 11);
  scene.add(new THREE.HemisphereLight(0xe6ff92, 0x10110f, 1.8));
  const key = new THREE.PointLight(0xd8ff52, 18, 18, 1.5);
  key.position.set(2.8, 4, 4);
  scene.add(key);
  const warm = new THREE.PointLight(0xff5c35, 9, 14, 2);
  warm.position.set(-4, -2, 3);
  scene.add(warm);

  const world = new THREE.Group();
  scene.add(world);

  // A dimensional abstraction of Rippl's lamp, built from lightweight primitives.
  const lamp = new THREE.Group();
  const graphite = new THREE.MeshStandardMaterial({ color: 0x282a24, roughness: .32, metalness: .75 });
  const pale = new THREE.MeshStandardMaterial({ color: 0xe8e5db, roughness: .68, metalness: .08 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.35, .2, 48), graphite);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(.07, .09, 3.8, 20), graphite);
  stem.position.y = 2;
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(.06, .07, 2.6, 20), graphite);
  arm.rotation.z = Math.PI / 2;
  arm.position.set(-1.25, 3.85, 0);
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(.48, .85, .56, 40, 1, true), pale);
  shade.position.set(-2.55, 3.55, 0);
  shade.rotation.z = -.22;
  const aperture = new THREE.Mesh(new THREE.CircleGeometry(.7, 40), new THREE.MeshBasicMaterial({ color: 0xd8ff52, transparent: true, opacity: .85 }));
  aperture.position.set(-2.68, 3.27, .02);
  aperture.rotation.x = -Math.PI / 2;
  lamp.add(base, stem, arm, shade, aperture);
  lamp.scale.setScalar(.78);
  lamp.position.set(4.1, -2.8, -1.5);
  lamp.rotation.set(.08, -.55, .02);
  world.add(lamp);

  // Projected knowledge is the central visual metaphor.
  const beamMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uIntensity: { value: .5 } },
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec2 vUv;uniform float uTime;uniform float uIntensity;void main(){float edge=smoothstep(.0,.24,vUv.x)*smoothstep(1.,.76,vUv.x);float pulse=.76+.24*sin(uTime*1.4+vUv.y*8.);float alpha=edge*(1.-vUv.y)*.19*uIntensity*pulse;gl_FragColor=vec4(.78,1.,.25,alpha);}`
  });
  const beam = new THREE.Mesh(new THREE.ConeGeometry(2.7, 7.2, 48, 1, true), beamMaterial);
  beam.position.set(1.1, -.2, -1.8);
  beam.rotation.z = -1.15;
  world.add(beam);

  // Concentric rings connect the product name to expanding context.
  const ripples = new THREE.Group();
  for (let i = 0; i < 7; i++) {
    const material = new THREE.MeshBasicMaterial({ color: i % 2 ? 0xd8ff52 : 0xff5c35, transparent: true, opacity: .28 - i * .024 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.7 + i * .55, .012, 6, 80), material);
    ring.userData.phase = i * .7;
    ripples.add(ring);
  }
  ripples.position.set(-3.2, .5, -1.5);
  ripples.rotation.x = 1.08;
  world.add(ripples);

  // One instanced draw call creates the field of emerging annotations.
  const dotGeometry = new THREE.IcosahedronGeometry(.018, 0);
  const dotMaterial = new THREE.MeshBasicMaterial({ color: 0xd8ff52, transparent: true, opacity: .62 });
  const particles = new THREE.InstancedMesh(dotGeometry, dotMaterial, coarse ? 70 : 150);
  const dummy = new THREE.Object3D();
  const seeds = [];
  for (let i = 0; i < particles.count; i++) {
    const seed = { x: (Math.random() - .5) * 13, y: (Math.random() - .5) * 9, z: (Math.random() - .5) * 6, s: Math.random() * .9 + .2 };
    seeds.push(seed);
    dummy.position.set(seed.x, seed.y, seed.z);
    dummy.scale.setScalar(seed.s);
    dummy.updateMatrix();
    particles.setMatrixAt(i, dummy.matrix);
  }
  world.add(particles);

  const textureLoader = new THREE.TextureLoader();
  const uiTexture = textureLoader.load('./assets/startup-flow.png');
  uiTexture.colorSpace = THREE.SRGBColorSpace;
  const uiMaterial = new THREE.MeshBasicMaterial({ map: uiTexture, transparent: true, opacity: 0, side: THREE.DoubleSide });
  const uiPlane = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 2.15), uiMaterial);
  uiPlane.position.set(2.3, -.2, -2.2);
  uiPlane.rotation.set(-.18, -.5, -.06);
  world.add(uiPlane);

  const pointer = new THREE.Vector2();
  addEventListener('pointermove', event => {
    pointer.x = event.clientX / innerWidth - .5;
    pointer.y = event.clientY / innerHeight - .5;
  }, { passive: true });

  const sections = [...document.querySelectorAll('.hero,.definition,.question,.interface,.reflection')];
  const state = { mode: 'hero' };
  const detectSection = () => {
    const centre = innerHeight * .48;
    const current = sections.find(section => { const box = section.getBoundingClientRect(); return box.top < centre && box.bottom > centre; });
    state.mode = current?.classList.contains('interface') ? 'interface' : current?.classList.contains('question') ? 'question' : current?.classList.contains('definition') ? 'object' : current?.classList.contains('reflection') ? 'reflection' : current?.classList.contains('hero') ? 'hero' : 'hidden';
    canvas.classList.toggle('active', state.mode !== 'hidden');
  };
  addEventListener('scroll', detectSection, { passive: true });
  detectSection();

  const clock = new THREE.Clock();
  let frame;
  const render = () => {
    frame = requestAnimationFrame(render);
    const time = clock.getElapsedTime();
    beamMaterial.uniforms.uTime.value = time;
    const lampX = state.mode === 'object' ? 2.4 : state.mode === 'interface' ? 4.6 : 4.1;
    lamp.position.x += (lampX - lamp.position.x) * .035;
    lamp.rotation.y += ((state.mode === 'object' ? -.25 : -.55) + pointer.x * .22 - lamp.rotation.y) * .035;
    lamp.rotation.x += (pointer.y * .12 - lamp.rotation.x) * .03;
    const beamLevel = state.mode === 'question' ? 1.8 : state.mode === 'object' ? .95 : state.mode === 'hero' ? .55 : .18;
    beamMaterial.uniforms.uIntensity.value += (beamLevel - beamMaterial.uniforms.uIntensity.value) * .04;
    uiMaterial.opacity += ((state.mode === 'interface' ? .76 : 0) - uiMaterial.opacity) * .045;
    uiPlane.rotation.y = -.5 + Math.sin(time * .3) * .04;
    ripples.children.forEach((ring, i) => {
      const pulse = 1 + Math.sin(time * .65 - ring.userData.phase) * .09;
      ring.scale.setScalar(pulse);
      ring.material.opacity = (state.mode === 'question' ? .48 : .2) * (1 - i / 10);
    });
    seeds.forEach((seed, i) => {
      dummy.position.set(seed.x + Math.sin(time * .15 + i) * .08, ((seed.y + time * seed.s * .08 + 5) % 10) - 5, seed.z);
      dummy.scale.setScalar(seed.s);
      dummy.updateMatrix();
      particles.setMatrixAt(i, dummy.matrix);
    });
    particles.instanceMatrix.needsUpdate = true;
    camera.position.x += (pointer.x * .55 - camera.position.x) * .025;
    camera.position.y += (-pointer.y * .35 + .2 - camera.position.y) * .025;
    world.rotation.z = Math.sin(time * .12) * .015;
    renderer.render(scene, camera);
  };
  render();

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.15 : 1.5));
    renderer.setSize(innerWidth, innerHeight, false);
  });

  addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    world.traverse(object => {
      object.geometry?.dispose();
      if (Array.isArray(object.material)) object.material.forEach(material => material.dispose());
      else object.material?.dispose();
    });
    uiTexture.dispose();
    renderer.dispose();
  }, { once: true });
} else if (!reduced) {
  document.querySelector('#webgl-status').textContent = 'The 3D layer is unavailable; the full case study remains accessible.';
}
