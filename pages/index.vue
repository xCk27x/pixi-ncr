<template>
  <div id="screen" class=" h-screen w-screen flex justify-center items-center">
    <div id="canvas-container" class="w-fit border-2"></div>
  </div>
</template>

<script lang="ts" setup>
import { Overworld, Controller } from "~/pixi-ncr-jsr/index";

onMounted(async () => {
  const overworld = new Overworld();
  const lowerMap = await overworld.loadLowerMap('/rpg/maps/DemoLower.png', 0, -1);
  const upperMap = await overworld.loadUpperMap('/rpg/maps/DemoUpper.png', 0, -1);
  const hero = await overworld.loadSprite('/rpg/characters/hero/hero.json', true, 10, 10);
  const hero2 = await overworld.loadSprite('/rpg/characters/hero/hero.json', false, 6, 6);
  const hero3 = await overworld.loadSprite('/rpg/characters/hero/hero.json', false, 9, 9);
  const controller = new Controller(overworld);
  // overworld.addWall([0, 0], [0, 100]);
  overworld.addWall([1, -7], [1, -2]);
  overworld.addWall([-4, -1], [1, -1]);
  overworld.addWall([-10, -1], [-6, -1]);
  overworld.addWall([-10, -7], [-10, -1]);
  overworld.addWall([-10, -8], [-5, -8]);
  overworld.addWall([-4, -7], [-4, -7]);
  overworld.addWall([-2, -7], [-2, -7]);
  overworld.addWall([-2, -5], [-2, -4]);
  overworld.addWall([-3, -5], [-3, -4]);
  overworld.addWall([-2, -8], [0, -8]);
  console.log('Walls:', overworld.walls);
});
</script>

<style lang="scss">
#canvas-container {
  transform: scale(1.5);

  & .canvas-entity {
    image-rendering: pixelated;
  }
}
</style>