<script setup>

import { ref, watch, nextTick } from 'vue';
import * as bootstrap from 'bootstrap';

const props = defineProps({
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

function download() {

	const firstCanvas = canvases.value[0];

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	canvas.width = canvases.value.length * firstCanvas.width;
	canvas.height = firstCanvas.height;

	let dx = 0;

	for (const e of canvases.value) {
		ctx.drawImage(e, dx, 0);
		dx += e.width;
	}

	const a = document.createElement('a');
	a.download = `${activeSpell.value.name}.png`;
	a.href = canvas.toDataURL();
	a.click();

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

                        <div class="preview-image">
	                        <canvas class="preview-canvas"
	                            v-if="canvases[activeIndex]"
	                            :ref="el => {
	                                if (el) {
	                                    const canvas = canvases[activeIndex];
	                                    el.width = canvas.width;
	                                    el.height = canvas.height;
	                                    el.getContext('2d').drawImage(canvas, 0, 0);
	                                }
	                            }"></canvas>
                        </div>


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

                <div class="modal-footer justify-content-between">
                	<div>

                 		<button class="btn btn-primary mx-1"
							@click="download">
		                    <i class="bi bi-download"></i>
		                </button>
                 	</div>

                	<div>
	                 	<button v-if="canvases.length > 1" class="btn btn-outline-secondary mx-1"
							@click="previous">
		                    <i class="bi bi-chevron-left"></i>
		                </button>

		                <button v-if="canvases.length > 1" class="btn btn-outline-secondary mx-1"
		                    @click="next">
		                    <i class="bi bi-chevron-right"></i>
		                </button>
                 	</div>

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
