<template>
  <div id="screen" class="h-screen w-screen flex justify-center items-center">
    <div id="canvas-container" class="relative w-fit border-2">
      <!-- Original canvas element where Pixi.js will render -->
      <div id="pixi-canvas" class="canvas-entity"></div>
      <!-- Dialog container within the canvas container -->
      <div v-if="showDialog" id="dialog-container" class="absolute bottom-0 w-full p-4 bg-gray-800 text-white z-10">
        <p id="dialog-text">{{ dialogText }}</p>
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

eventBus.on('trigger-dialog', (text: string) => {
  dialog.setText(text);
  showDialog.value = true;
  setTimeout(() => {
    showDialog.value = false;
  }, 2000); // 2 seconds later, hide the dialog
});

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

  // eventBus.on('trigger-dialog', (text: string) => {
  //   dialog.setText(text);
  //   showDialog.value = true;
  // });
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
  width: 100%;
  height: 30%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  bottom: 0;
  /* Position it at the bottom of the container */
  text-align: center;
  font-family: 'Arial', sans-serif;
  font-size: 10px;
  z-index: 10;
  /* Ensure it's above the canvas elements */
}
</style>
