<template>
  <div id="screen" class="h-screen w-screen flex justify-center items-center">
    <div class="a"></div>
    <div id="canvas-container" class="relative w-fit border-2">
      <!-- Original canvas element where Pixi.js will render -->
      <div id="pixi-canvas" class="canvas-entity portrait"></div>
      <!-- Dialog container within the canvas container -->
      <div v-if="showDialog" id="dialog-container" class="absolute bottom-0 w-full p-4 bg-gray-800 text-white z-10"
        @click="handleDialogClick">
        <p id="dialog-text">{{ dialogText }}</p>
        <p class="text-left">點擊背景以取消</p>
        <p class="text-right">點擊對話框繼續</p>
      </div>

      <div id="controls" class="control-panel">
        <div class="control-btn up" @mousedown="startMove('up')" @mouseup="stopMove('up')"
          @touchstart.prevent="startMove('up')" @touchend="stopMove('up')">▲</div>
        <div class="control-btn left" @mousedown="startMove('left')" @mouseup="stopMove('left')"
          @touchstart="startMove('left')" @touchend="stopMove('left')">◄</div>
        <div class="control-btn down" @mousedown="startMove('down')" @mouseup="stopMove('down')"
          @touchstart.prevent="startMove('down')" @touchend="stopMove('down')">▼</div>
        <div class="control-btn right" @mousedown="startMove('right')" @mouseup="stopMove('right')"
          @touchstart.prevent="startMove('right')" @touchend="stopMove('right')">►</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';
import { Overworld, Controller } from "~/pixi-rpg/index";
import { useRouter } from 'vue-router';
import { useDialog } from "~/pixi-rpg/lib/dialog";
import { eventBus } from "~/pixi-rpg/lib/eventBus";
const nextRoute = ref<string | null>(null); // 用于存储下一步的路由


const dialog = useDialog('');
const dialogText = computed(() => dialog.getText());
const showDialog = ref(false);
// const isDialogActive = ref(false); // 用于指示对话框是否处于活动状态
const router = useRouter(); // 获取 router 实例\
let overworld: Overworld;

function handleDialogClick() {
  if (showDialog.value) {
    if (!dialog.isTextFullyDisplayed()) {
      dialog.completeTyping(); // 完成当前页的文字输出
    } else {
      if (!dialog.nextPage()) {
        showDialog.value = false; // 关闭对话框
        overworld.isDialogActive = false;
        console.log('isDialogActive:', overworld.isDialogActive);
        if (nextRoute.value) {
          router.push(nextRoute.value);
          nextRoute.value = null; // 清空 nextRoute
        }
      }
    }
  }
}

function handleScreenClick(event: MouseEvent) {
  const dialogContainer = document.getElementById('dialog-container');
  if (dialogContainer && !dialogContainer.contains(event.target as Node)) {
    showDialog.value = false;
    overworld.isDialogActive = false;
    // overworld.resetLastTriggerPosition();
    console.log('Dialog closed by clicking outside');
  }
}

function handleLeaveTriggerArea() {
  if (showDialog.value) {
    // 此處添加離開觸發區域後需要執行的邏輯
    showDialog.value = false;
  }
}
function startMove(direction: string) {
  eventBus.emit('move-start', direction);
}

function stopMove(direction: string) {
  eventBus.emit('move-stop', direction);
}

function scaleCanvas() {
  const container = document.getElementById('canvas-container')!;
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const scaleX = (window.innerWidth - 50) / containerWidth;
  const scaleY = (window.innerHeight - 50) / containerHeight;



  const scale = Math.min(scaleX, scaleY);

  container.style.transform = `scale(${scale})`;
  container.style.transformOrigin = 'top left';
}

function navigateToRoute(route: string) {
  nextRoute.value = route;
  if (!showDialog.value) {
    router.push(nextRoute.value);
    nextRoute.value = null;
  }
}

function parseTiledWalls(wallData: any) {
  wallData.forEach((wall: any) => {
    const startX = wall.x / 16 - 8;
    const startY = wall.y / 16 - 5;
    const width = wall.width / 16;
    const height = wall.height / 16;

    for (let x = startX; x < startX + width; x++) {
      for (let y = startY; y < startY + height; y++) {
        overworld.addWall(x, y);
      }
    }
  });
}



onMounted(async () => {
  overworld = new Overworld('pixi-canvas');
  // const overworld = new Overworld();
  // const lowerMap = await overworld.loadLowerMap('/rpg/maps/DemoLower.png', 0, -1);
  const lowerMap = await overworld.loadLowerMap('/rpg/maps/DemoLower.png', 0, 0
  );
  const wallData = [
    { "height": 192, "id": 1, "name": "", "rotation": 0, "type": "", "visible": true, "width": 0, "x": 192, "y": 0 },
    { "height": 192, "id": 5, "name": "", "rotation": 0, "type": "", "visible": true, "width": 16, "x": 176, "y": 0 },
    { "height": 32, "id": 9, "name": "", "rotation": 0, "type": "", "visible": true, "width": 80, "x": 96, "y": 160 },
    { "height": 32, "id": 10, "name": "", "rotation": 0, "type": "", "visible": true, "width": 64, "x": 16, "y": 160 },
    { "height": 16, "id": 18, "name": "", "rotation": 0, "type": "", "visible": true, "width": 16, "x": 80, "y": 176 },
    { "height": 192, "id": 19, "name": "", "rotation": 0, "type": "", "visible": true, "width": 16, "x": 0, "y": 0 },
    { "height": 16, "id": 20, "name": "", "rotation": 0, "type": "", "visible": true, "width": 160, "x": 16, "y": 0 }
  ];
  parseTiledWalls(wallData);


  const hero = await overworld.loadSprite('/rpg/characters/hero/hero.json', true, 8, 5);
  // const hero = await overworld.loadSprite('/rpg/characters/hero/hero.json', true, 0, 0);
  // const hero = await overworld.loadSprite('/rpg/characters/hero/hero.json', true, 0, 0);
  const hero2 = await overworld.loadSprite('/rpg/characters/hero/hero.json', false, -4, 2);
  const hero3 = await overworld.loadSprite('/rpg/characters/hero/hero.json', false, -6, 3);
  const hero4 = await overworld.loadSprite('/rpg/characters/hero/hero.json', false, -2, 3);
  const upperMap = await overworld.loadUpperMap('/rpg/maps/DemoUpper.png', 0, 0);
  const controller = new Controller(overworld);

  overworld.restorePositionOnLoad(); // Restore position on load


  hero3.anim.play();

  // overworld.addWall([1, -3], [1, 5]);
  // overworld.addWall([-4, 6], [1, 6]);
  // overworld.addWall([-10, 6], [-6, 6]);
  // overworld.addWall([-10, -4], [-10, 6]);
  // overworld.addWall([-10, -4], [1, -4]);
  // overworld.addWall([-10, -1], [-5, -1]);
  // overworld.addWall([-4, 0], [-4, 0]);
  // overworld.addWall([-2, 0], [-2, 0]);
  // overworld.addWall([-2, 2], [-2, 3]);
  // overworld.addWall([-3, 2], [-3, 3]);
  // overworld.addWall([-2, -1], [0, -1]);

  console.log('Walls:', overworld.walls);

  // overworld.addTrigger(-5, 6, ['這裡前往校園地圖'], () => navigateToRoute('/map'));
  // overworld.addTrigger(-5, 6, ['這裡前往校園地圖'])
  overworld.addTrigger(-3, 5, ['這裡前往校園地圖'], () => navigateToRoute('/rpg/map'));

  await overworld.addImage('/rpg/characters/hero/bottle_test2.png', -5, 4);
  overworld.addTrigger(
    -5,
    4,
    ['這看起來是個瓶子', 'teststestesteststetstest', '它看起來什麼都沒有 成功浪費了你幾秒'],
    () => overworld.removeTrigger(-5, 4),
    () => overworld.removeImage(-5, 4)
  );

  overworld.addTrigger(-4, 2, ['hello'], () => hero2.anim.play());

  function moveHero4InSquare() {
    const moveSequence = [
      { direction: 'right', x: 1, y: 0 },
      { direction: 'down', x: 0, y: 1 },
      { direction: 'left', x: -1, y: 0 },
      { direction: 'up', x: 0, y: -1 }
    ];
    let step = 0;

    setInterval(() => {
      const move = moveSequence[step];
      overworld.moveCharacter(hero4, move.x, move.y, move.direction);

      step = (step + 1) % moveSequence.length;
    }, 300);
  }

  moveHero4InSquare();





  eventBus.on('trigger-dialog', (text: string | string[], route?: string) => {
    if (!showDialog.value) {
      dialog.setText(text);
      showDialog.value = true;
      overworld.isDialogActive = true;
      if (route) {
        nextRoute.value = route;
      }
    }
  });



  eventBus.on('leave-trigger-area', handleLeaveTriggerArea);


  overworld.sortChildren();


  eventBus.on('navigate', (route: string) => {
    nextRoute.value = route;
  });

  window.addEventListener('click', handleScreenClick);
  scaleCanvas();
  window.addEventListener('resize', scaleCanvas);
});

onUnmounted(() => {
  eventBus.off('leave-trigger-area', handleLeaveTriggerArea);
  window.removeEventListener('resize', scaleCanvas);
  window.removeEventListener('click', handleScreenClick);
  // window.removeEventListener('click', handleScreenClick)
});
</script>

<style lang="scss">
#canvas-container {
  position: relative;
  transform-origin: center !important;
}



@media (min-width: 1000px) {


  #controls {
    display: none !important;
  }

}

@media (max-width: 1000px) {}

@media (max-width: 700px) {}

@media (oritation: portrait) {
  .portrait {
    display: none;
    transform: scale(0.0);
  }

}


#pixi-canvas {

  //width: 100%;

  height: 100%;
  /* Ensures the Pixi.js canvas takes up the full container */
}

#dialog-container {
  width: 80%;
  height: 40%;
  border-radius: 8px;
  left: 10%;
  right: 10%;
  bottom: 5%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  //padding: 10px;

  /* Position it at the bottom of the container */
  text-align: left;
  font-family: 'Arial', sans-serif;
  font-size: 10px;
  font-weight: 800;
  z-index: 11;
  /* Ensure it's above the canvas elements */
}



.text-right {
  font-size: 8px;
  color: rgb(227, 225, 225);
  text-align: right;
  bottom: 3px;
  right: 6px;
  font-weight: 400;
  position: absolute;
  /* 新增這行，使其绝对定位 */
  /* 新增這行，讓文字靠右 */
}

.text-left {
  font-size: 8px;
  color: rgba(156, 163, 175, 1);
  text-align: left;
  bottom: 3px;
  left: 6px;
  font-weight: 400;
  position: absolute;
  /* 新增這行，使其绝对定位 */
  /* 新增這行，讓文字靠左 */
}

/* 移动按钮样式 */
#controls {
  position: absolute;
  bottom: 10%;
  left: 15%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: 15px 15px 15px;
  grid-template-rows: 15px 15px 15px;
  gap: 5px;
  z-index: 10;
}

.control-btn {
  width: 20px;
  height: 20px;
  background-color: #555;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 8px;
  cursor: pointer;
  user-select: none;
  /* 禁用文本选择 */
  -webkit-user-select: none;
  /* 适用于Safari */
  -ms-user-select: none;
  /* 适用于IE */
  -moz-user-select: none;
  /* 适用于Firefox */
  -webkit-touch-callout: none;
  /* 禁用长按呼出上下文菜单 */
  -webkit-user-drag: none;
  /* 禁用拖拽 */
  touch-action: manipulation;
  /* 禁用所有默认触摸行为 */
}

.control-btn.up {
  grid-column: 2;
  grid-row: 1;
}

.control-btn.left {
  grid-column: 1;
  grid-row: 2;
}

.control-btn.down {
  grid-column: 2;
  grid-row: 3;
}

.control-btn.right {
  grid-column: 3;
  grid-row: 2;
}

.control-btn:active {
  background-color: #333;
}
</style>