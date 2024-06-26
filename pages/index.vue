<template>
  <div id="screen" class=" h-screen w-screen flex justify-center items-center">
    <div id="canvas-container" class="w-fit border-2"></div>
  </div>
</template>

<script lang="ts" setup>
import { Overworld, Controller } from "~/pixi-ncr-jsr/index";

onMounted(async () => {
  const overworld = new Overworld();
  const lowerMap = await overworld.loadLowerMap('/rpg/maps/DemoLower.png', 0, 0);
  const upperMap = await overworld.loadUpperMap('/rpg/maps/DemoUpper.png', 0, 0);
  const hero = await overworld.loadSprite('/rpg/characters/hero/hero.json', true, 10, 10);
  const hero2 = await overworld.loadSprite('/rpg/characters/hero/hero.json', false, 6, 6);
  const hero3 = await overworld.loadSprite('/rpg/characters/hero/hero.json', false, 9, 9);
  const controller = new Controller(overworld);
  overworld.addWall([0, 0], [0, 100]);
  overworld.addWall([20, -100], [20, -6]);
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