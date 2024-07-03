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
        <p class="text-left">離開以取消</p>
        <p class="text-right">點擊對話框繼續</p>
      </div>

      <div id="controls" class="control-panel">
        <div class="control-btn up" @mousedown="startMove('up')" @mouseup="stopMove('up')" @touchstart="startMove('up')"
          @touchend="stopMove('up')">▲</div>
        <div class="control-btn left" @mousedown="startMove('left')" @mouseup="stopMove('left')"
          @touchstart="startMove('left')" @touchend="stopMove('left')">◄</div>
        <div class="control-btn down" @mousedown="startMove('down')" @mouseup="stopMove('down')"
          @touchstart="startMove('down')" @touchend="stopMove('down')">▼</div>
        <div class="control-btn right" @mousedown="startMove('right')" @mouseup="stopMove('right')"
          @touchstart="startMove('right')" @touchend="stopMove('right')">►</div>
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

// const dialog = useDialog('Welcome to the RPG game!');
// const dialogText = computed(() => dialog.getText());
// 初始化对话框相关状态
const dialog = useDialog('');
const dialogText = computed(() => dialog.getText());
const showDialog = ref(false);
// const isDialogActive = ref(false); // 用于指示对话框是否处于活动状态
const router = useRouter(); // 获取 router 实例\
let overworld: Overworld;

// function handleDialogClick() {
//   if (showDialog.value) {
//     if (!dialog.isTextFullyDisplayed()) {
//       dialog.completeTyping(); // 完成当前页的文字输出
//     } else {
//       if (!dialog.nextPage()) {
//         showDialog.value = false; // 关闭对话框
//         overworld.isDialogActive = false;
//         // overworld.endDialog(); // 结束对话时重新允许移动
//         console.log('isDialogActive:', overworld.isDialogActive);
//         // isDialogActive.value = false; // 允许角色移动
//         if (nextRoute.value) {
//           router.push(nextRoute.value);
//           console.log('nextRoute:', nextRoute.value);
//         } else {
//           console.log('noNextRoute:', nextRoute.value);
//         }

//       }
//     }
//   }
// }

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



onMounted(async () => {
  overworld = new Overworld('pixi-canvas');
  // const overworld = new Overworld();
  const lowerMap = await overworld.loadLowerMap('/rpg/maps/DemoLower.png', 0, -1);

  const hero = await overworld.loadSprite('/rpg/characters/hero/hero.json', true, 10, 3);
  // const hero = await overworld.loadSprite('/rpg/characters/hero/hero.json', true, 0, 0);
  const hero2 = await overworld.loadSprite('/rpg/characters/hero/hero.json', false, 6, 6);
  const hero3 = await overworld.loadSprite('/rpg/characters/hero/hero.json', false, 9, 9);
  const upperMap = await overworld.loadUpperMap('/rpg/maps/DemoUpper.png', 0, -1);
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

  overworld.addTrigger(-5, 6, ['這裡前往校園地圖'], '/map');
  // overworld.ts
  overworld.addTrigger(-9, 5, ['這看起來是個瓶子', 'teststestesteststetstest', '它看起來什麼都沒有 成功浪費了你幾秒']);


  // await overworld.addImage('/rpg/characters/hero/hero_back.png', 5, 5);
  await overworld.addImage('/rpg/characters/hero/bottle_test3.png', -9, 5);

  // await overworld.addImage('/rpg/characters/hero/hero_back.png', 6, 6);
  // await overworld.addImage('/rpg/characters/hero/hero_back.png', 9, 9);

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
  // window.addEventListener('click', handleScreenClick);
  // eventBus.on('trigger-dialog', (text: string) => {
  //   dialog.setText(text);
  //   showDialog.value = true;
  // });

  eventBus.on('navigate', (route: string) => {
    nextRoute.value = route;
  });


  scaleCanvas();
  window.addEventListener('resize', scaleCanvas);
});

onUnmounted(() => {
  eventBus.off('leave-trigger-area', handleLeaveTriggerArea);
  window.removeEventListener('resize', scaleCanvas);
  // window.removeEventListener('click', handleScreenClick)
});
</script>

<style lang="scss">
#canvas-container {
  position: relative;
  transform-origin: center !important;
  //transform: scale(calc(100% / 1920px));
  //overflow: hidden;
  //transform-origin: top left;
  /* Ensure that the canvas-container can position children absolutely */
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
  grid-template-columns: 30px 30px 30px;
  grid-template-rows: 30px 30px 30px;
  gap: 5px;
  z-index: 10;
}

.control-btn {
  width: 30px;
  height: 30px;
  background-color: #555;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
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