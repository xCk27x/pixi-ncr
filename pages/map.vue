<template>
    <div id="screen" class="h-screen w-screen flex justify-center items-center">
        <div class="a"></div>
        <div id="canvas-container" class="relative w-fit border-2">
            <!-- Original canvas element where Pixi.js will render -->
            <div id="pixi-canvas" class="canvas-entity portrait"></div>
            <!-- Dialog container within the canvas container -->
            <div v-if="showDialog" id="dialog-container"
                class="absolute bottom-0 w-full p-4 bg-gray-800 text-white z-10" @click="handleDialogClick">
                <p id="dialog-text">{{ dialogText }}</p>
                <p class="text-left">離開以取消</p>
                <p class="text-right">點擊對話框繼續</p>
            </div>
        </div>

        <div id="controls" class="absolute bottom-4 left-4 flex flex-col space-y-2 md:hidden">
            <button @mousedown="startMove('up')" @mouseup="stopMove('up')" @touchstart="startMove('up')"
                @touchend="stopMove('up')" class="control-btn">↑</button>
            <div class="flex space-x-2">
                <button @mousedown="startMove('left')" @mouseup="stopMove('left')" @touchstart="startMove('left')"
                    @touchend="stopMove('left')" class="control-btn">←</button>
                <button @mousedown="startMove('down')" @mouseup="stopMove('down')" @touchstart="startMove('down')"
                    @touchend="stopMove('down')" class="control-btn">↓</button>
                <button @mousedown="startMove('right')" @mouseup="stopMove('right')" @touchstart="startMove('right')"
                    @touchend="stopMove('right')" class="control-btn">→</button>
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

function handleDialogClick() {
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
function startMove(direction: string) {
    eventBus.emit('move-start', direction);
}

function stopMove(direction: string) {
    eventBus.emit('move-stop', direction);
}


onMounted(async () => {
    const overworld = new Overworld('pixi-canvas');
    // const overworld = new Overworld();
    // const lowerMap = await overworld.loadLowerMap('/rpg/maps/DemoLower.png', 0, -1);
    // const lowerMap = await overworld.loadLowerMap('/rpg/maps/map.png', 0, -1);
    const lowerMap = await overworld.loadLowerMap('/rpg/maps/wholeMap.png', -50, -50);
    const hero = await overworld.loadSprite('/rpg/characters/hero/hero.json', true, 10, 3);
    const hero2 = await overworld.loadSprite('/rpg/characters/hero/hero.json', false, 6, 6);
    const hero3 = await overworld.loadSprite('/rpg/characters/hero/hero.json', false, 9, 9);

    const controller = new Controller(overworld);

    // overworld.app.stage.addChild(lowerMap);
    // overworld.app.stage.addChild(hero);
    // overworld.app.stage.addChild(hero2);
    // overworld.app.stage.addChild(hero3);
    // overworld.app.stage.addChild(upperMap);
    // overworld.app.stage.setChildIndex(upperMap, overworld.app.stage.children.length - 1);

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

    overworld.addTrigger(-5, 6, '這裡是門口');

    eventBus.on('trigger-dialog', (text: string) => {
        dialog.setText(text);
        showDialog.value = true;
    });

    eventBus.on('leave-trigger-area', handleLeaveTriggerArea);


    overworld.sortChildren();
    // window.addEventListener('click', handleScreenClick);
    // eventBus.on('trigger-dialog', (text: string) => {
    //   dialog.setText(text);
    //   showDialog.value = true;
    // });

});

onUnmounted(() => {
    eventBus.off('leave-trigger-area', handleLeaveTriggerArea);

    // window.removeEventListener('click', handleScreenClick)
});
</script>

<style lang="scss">
#canvas-container {
    position: relative;
    /* Ensure that the canvas-container can position children absolutely */
}

@media (min-width: 1000px) {
    #canvas-container {
        transform: scale(2.5);
    }
}

@media (max-width: 1000px) {
    #canvas-container {
        transform: scale(1.5);
    }


}

@media (max-width: 700px) {
    #canvas-container {
        transform: scale(1.2);
    }


}

@media (oritation: portrait) {
    .portrait {
        display: none;
        transform: scale(0.0);
    }

}


#pixi-canvas {
    width: 100%;
    //height: 100%;
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
    //padding: 10px;

    /* Position it at the bottom of the container */
    text-align: left;
    font-family: 'Arial', sans-serif;
    font-size: 10px;
    font-weight: 800;
    z-index: 10;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    bottom: 20px;
    left: 20px;
    z-index: 10;


}

.control-btn {
    width: 50px;
    height: 50px;
    background-color: #555;
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    margin: 5px;
    cursor: pointer;
}

.control-btn:active {
    background-color: #333;
}
</style>