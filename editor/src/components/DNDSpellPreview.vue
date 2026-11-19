<script setup>

import { ref, watch, nextTick } from 'vue';

const props = defineProps({

    spell: {
        type: Object,
        required: true
    },

    renderer: {
        type: Object,
        required: true
    }

});

const container = ref(null);

async function renderCard() {

    await nextTick();

    if (!container.value) return;

    container.value.replaceChildren();

    try {

        const canvases = props.renderer.generateImage(props.spell);

        for (const canvas of canvases) {

            if (!(canvas instanceof HTMLCanvasElement)) continue;

            canvas.classList.add('preview-canvas');

            container.value.appendChild(canvas);

        }

    } catch (error) {

        console.error('Erro ao renderizar carta:', error);

    }

}

watch(
    () => props.spell,
    renderCard,
    { immediate: true, flush: 'post' }
);

</script>

<template>

    <div ref="container" class="preview-container"></div>

</template>

<style scoped>

.preview-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 300px;
}

.preview-canvas {
    display: block;
    max-width: 100%;
    max-height: 65vh;
    width: auto;
    height: auto;
    object-fit: contain;
}

</style>
