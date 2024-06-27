<template>
  <div id="screen" class="h-screen w-screen flex justify-center items-center" @click="handleScreenClick">
    <div id="canvas-container" class="relative w-fit border-2">
      <!-- Original canvas element where Pixi.js will render -->
      <div id="pixi-canvas" class="canvas-entity"></div>
      <!-- Dialog container within the canvas container -->
      <div v-if="showDialog" id="dialog-container" class="absolute bottom-0 w-full p-4 bg-gray-800 text-white z-10">
        <p id="dialog-text">{{ dialogText }}</p>
        <p class="text-xs text-gray-400 text-right">點擊螢幕繼續</p> <!-- 新增這行 -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { Overworld, Controller } from "~/pixi-rpg/index";
import { useDialog } from "~/pixi-rpg/lib/dialog";
import eventBus from "~/pixi-rpg/lib/eventBus";

// const dialog = useDialog('Welcome to the RPG game!');
// const dialogText = computed(() => dialog.getText());
// 初始化对话框相关状态
const dialog = useDialog('');
const dialogText = computed(() => dialog.getText());
const showDialog = ref(false);

function handleScreenClick() {
  if (showDialog.value) {
    dialog.stopTyping(); // 停止打字效果
    showDialog.value = false;
  }
}

function handleLeaveTriggerArea() {
  if (showDialog.value) {
    // 此處添加離開觸發區域後需要執行的邏輯
    showDialog.value = false;
  }
}


onMounted(async () => {
  const overworld = new Overworld('pixi-canvas');
  const lowerMap = await overworld.loadLowerMap('/rpg/maps/DemoLower.png', 0, -1);
  const upperMap = await overworld.loadUpperMap('/rpg/maps/DemoUpper.png', 0, -1);
  const hero = await overworld.loadSprite('/rpg/characters/hero/hero.json', true, 10, 3);
  const hero2 = await overworld.loadSprite('/rpg/characters/hero/hero.json', false, 6, 6);
  const hero3 = await overworld.loadSprite('/rpg/characters/hero/hero.json', false, 9, 9);
  const controller = new Controller(overworld);

  overworld.addWall([1, -3], [1, 5]);
  overworld.addWall([-4, 6], [1, 6]);
  overworld.addWall([-10, 6], [-6, 6]);
  overworld.addWall([-10, -4], [-10, 6]);
  overworld.addWall([-10, -4], [1, -4]);
  overworld.addWall([-10, -1], [-5, -1]);
  overworld.addWall([-4, 0], [-4, 0]);
  overworld.addWall([-2, 0], [-2, 0]);
  overworld.addWall([-2, 2], [-2, 3]);
  overworld.addWall([-3, 2], [-3, 3]);
  overworld.addWall([-2, -1], [0, -1]);

  console.log('Walls:', overworld.walls);

  overworld.addTrigger(-5, 6, '這裡是門口');

  eventBus.on('trigger-dialog', (text: string) => {
    dialog.setText(text);
    showDialog.value = true;
  });

  // eventBus.on('leave-trigger-area', handleLeaveTriggerArea);


  window.addEventListener('click', handleScreenClick);
  // eventBus.on('trigger-dialog', (text: string) => {
  //   dialog.setText(text);
  //   showDialog.value = true;
  // });
});

onUnmounted(() => {
  // eventBus.off('leave-trigger-area', handleLeaveTriggerArea);

  window.removeEventListener('click', handleScreenClick)
});
</script>

<style lang="scss">
#canvas-container {
  transform: scale(2.5);
  position: relative;
  /* Ensure that the canvas-container can position children absolutely */
}

#pixi-canvas {
  width: 100%;
  height: 100%;
  /* Ensures the Pixi.js canvas takes up the full container */
}

#dialog-container {
  width: 80%;
  height: 30%;
  border-radius: 8px;
  left: 10%;
  right: 10%;
  bottom: 5%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;

  /* Position it at the bottom of the container */
  text-align: left;
  font-family: 'Arial', sans-serif;
  font-size: 10px;
  z-index: 10;
  /* Ensure it's above the canvas elements */
}

.text-xs {
  font-size: 8px;
  /* 新增這行，用於小字體 */
}

.text-gray-400 {
  color: rgba(156, 163, 175, 1);
  /* 新增這行，用於灰色文字 */
}

.text-right {
  text-align: right;
  bottom: 3px;
  right: 3px;
  position: absolute;
  /* 新增這行，使其绝对定位 */
  /* 新增這行，讓文字靠右 */
}
</style>
