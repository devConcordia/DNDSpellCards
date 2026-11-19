<script setup>

import { ref, watch, nextTick } from 'vue';
import * as bootstrap from 'bootstrap';

import DNDSpellPreview from './DNDSpellPreview.vue';

const props = defineProps({

    spells: {
        type: Array,
        required: true
    },

    renderer: {
        type: Object,
        required: true
    }

});

const modalElement = ref(null);

const activeSpell = ref(null);
const activeIndex = ref(0);

const canvases = ref([]);

let modal = null;

function open(spell) {

    activeSpell.value = spell;
    activeIndex.value = 0;

    canvases.value = props.renderer.generateImage(spell);

    nextTick(() => {

        if (!modal) {

            modal = new bootstrap.Modal(modalElement.value);

        }

        modal.show();

    });

}

function close() {

    modal?.hide();

    activeSpell.value = null;
    canvases.value = [];

}

function previous() {

    if (!canvases.value.length) return;

    activeIndex.value =
        (activeIndex.value - 1 + canvases.value.length) %
        canvases.value.length;

}

function next() {

    if (!canvases.value.length) return;

    activeIndex.value =
        (activeIndex.value + 1) %
        canvases.value.length;

}

defineExpose({ open, close });

</script>

<template>

    <div
        ref="modalElement"
        class="modal fade"
        tabindex="-1"
        aria-hidden="true">

        <div class="modal-dialog modal-dialog-centered modal-lg">

            <div class="modal-content">

                <div class="modal-header">

                    <h5 class="modal-title">
                        {{ activeSpell?.name }}
                    </h5>

                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close">
                    </button>

                </div>

                <div class="modal-body">

                    <div v-if="canvases.length" class="preview-carousel">

                        <button
                            v-if="canvases.length > 1"
                            class="btn btn-outline-secondary"
                            @click="previous">

                            <i class="bi bi-chevron-left"></i>

                        </button>

                        <div class="preview-image">

	                        <canvas
	                            v-if="canvases[activeIndex]"
	                            :ref="el => {

	                                if (el) {

	                                    const canvas = canvases[activeIndex];

	                                    el.width = canvas.width;
	                                    el.height = canvas.height;

	                                    el.getContext('2d').drawImage(canvas, 0, 0);

	                                }

	                            }"
	                            class="preview-canvas">
	                        </canvas>
                            <!-- <DNDSpellPreview
                                v-if="activeSpell"
                                :spell="activeSpell"
                                :renderer="renderer"
                                :key="activeSpell.name + '-' + activeIndex" /> -->

                        </div>

                        <button
                            v-if="canvases.length > 1"
                            class="btn btn-outline-secondary"
                            @click="next">

                            <i class="bi bi-chevron-right"></i>

                        </button>

                    </div>

                    <div v-else class="text-center text-muted p-5">

                        Nenhuma imagem disponível.

                    </div>

                    <div
                        v-if="canvases.length > 1"
                        class="text-center mt-3">

                        {{ activeIndex + 1 }} / {{ canvases.length }}

                    </div>

                </div>

                <div class="modal-footer">

                    <button
                        class="btn btn-secondary"
                        data-bs-dismiss="modal">

                        Fechar

                    </button>

                </div>

            </div>

        </div>

    </div>

</template>

<style scoped>

.preview-carousel {

    display: flex;

    align-items: center;

    justify-content: space-between;

    gap: 1rem;

}

.preview-image {

    flex: 1;

    min-width: 0;

    display: flex;

    justify-content: center;

    align-items: center;

}

.preview-canvas {
    display: block;
    max-width: 100%;
    max-height: 65vh;
    width: auto;
    height: auto;
}

</style>
