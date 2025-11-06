import * as THREE from "three";
import grainyFragment from "./shader/grainyFragment.glsl?raw";
import grainyVertex from "./shader/grainyVertex.glsl?raw";

// Global state for scroll continuity across page transitions
let globalScrollOffset = 0;

export function createGrainy(canvas: HTMLCanvasElement) {
  // Setup
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  camera.position.z = 1;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Add noise plane
  const planeGeometry = new THREE.PlaneGeometry(2, 2);
  const planeMaterial = new THREE.ShaderMaterial({
    fragmentShader: grainyFragment,
    uniforms: {
      scrollOffset: { value: globalScrollOffset },
    },
    vertexShader: grainyVertex,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);

  // Animation state
  let animationId: number | null = null;
  let isRendering = false;

  // Store base scroll position when effect is created
  const baseScrollY = window.scrollY;

  // Render function - only renders once when called
  function render() {
    // Calculate relative scroll from base position
    const relativeScroll = window.scrollY - baseScrollY;
    planeMaterial.uniforms.scrollOffset.value =
      (globalScrollOffset + relativeScroll) * 0.001;

    renderer.render(scene, camera);
    isRendering = false;
  }

  // Request render if not already scheduled
  function requestRender() {
    if (!isRendering) {
      isRendering = true;
      animationId = requestAnimationFrame(render);
    }
  }

  // Initial render
  requestRender();

  // Scroll handler - render on scroll
  const handleScroll = () => {
    requestRender();
  };

  // Resize handler - render on resize
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    camera.updateProjectionMatrix();
    requestRender();
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize);

  // Cleanup function for when the effect is destroyed
  return () => {
    // Save current scroll offset for next page
    const currentRelativeScroll = window.scrollY - baseScrollY;
    globalScrollOffset += currentRelativeScroll;

    if (animationId !== null) {
      cancelAnimationFrame(animationId);
    }
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleResize);
    renderer.dispose();
    planeGeometry.dispose();
    planeMaterial.dispose();
  };
}
