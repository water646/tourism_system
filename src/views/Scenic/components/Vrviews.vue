<template>
  <div ref="container" class="viewer"></div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import * as THREE from "three";
import img from "@/assets/img/pic6.png"; // 👉 确保路径正确

const container = ref(null);

onMounted(() => {
  // 场景
  const scene = new THREE.Scene();

  // 相机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  // 渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.value.appendChild(renderer.domElement);

  // 球体（包裹图片）
  const geometry = new THREE.SphereGeometry(500, 60, 40);
  geometry.scale(-1, 1, 1); // 👈 必须反转

  let mesh;

  // 加载图片
  const loader = new THREE.TextureLoader();
  loader.load(
    img,
    (texture) => {
      const material = new THREE.MeshBasicMaterial({ map: texture });
      mesh = new THREE.Mesh(geometry, material);

      // 👇 关键：让图片一开始在正前方
      mesh.rotation.y = Math.PI;

      scene.add(mesh);
    },
    undefined,
    (err) => {
      console.error("图片加载失败:", err);
    }
  );

  // 相机位置（在球内部）
  camera.position.set(0, 0, 0.1);

  // ===== 鼠标控制 =====
  let isDragging = false;
  let lon = 0;
  let lat = 0;

  container.value.addEventListener("mousedown", () => {
    isDragging = true;
  });

  container.value.addEventListener("mouseup", () => {
    isDragging = false;
  });

  container.value.addEventListener("mouseleave", () => {
    isDragging = false;
  });

  container.value.addEventListener("mousemove", (event) => {
    if (isDragging) {
      lon += event.movementX * 0.1;
      lat -= event.movementY * 0.1;
    }
  });

  // ===== 动画循环 =====
  function animate() {
    requestAnimationFrame(animate);

    // 限制上下视角（防止翻转）
    lat = Math.max(-85, Math.min(85, lat));

    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);

    const x = 500 * Math.sin(phi) * Math.cos(theta);
    const y = 500 * Math.cos(phi);
    const z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(x, y, z);

    renderer.render(scene, camera);
  }

  animate();
});
</script>

<style>
.viewer {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>