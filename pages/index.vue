<template>
<div id="screen" class=" h-screen w-screen flex justify-center items-center">
  <div id="canvas-container" class="w-fit border-2"></div>
</div>
</template>

<script lang="ts" setup>
import { Overworld } from "~/pixi-ncr-jsr/index";

onMounted(async () => {
  const overworld = new Overworld();
  const lowerMap = await overworld.loadLowerMap('/rpg/maps/DemoLower.png');
  const hero = await overworld.loadSprite('/rpg/characters/hero/hero.json');
  const upperMap = await overworld.loadUpperMap('/rpg/maps/DemoUpper.png');
  setTimeout(() => {
    hero.changeAnime('hero-right');
    setTimeout(() => {
      hero.changeAnime('hero-left');
    }, 1000)
  }, 1000);
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