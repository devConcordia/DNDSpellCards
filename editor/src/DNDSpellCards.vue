<script setup>

import { ref, watch, nextTick } from 'vue';

import DNDFilter from './components/DNDFilter.vue';
import DNDTable from './components/DNDTable.vue';
import DNDSpellConfirmation from './components/DNDSpellConfirmation.vue';

import { useSpellCards } from './composables/useSpellCards';

import { SpellCardsRenderer } from 'dnd-spell-cards';

// --------------------------------------------------
// Renderer
// --------------------------------------------------

const dndRenderer = new SpellCardsRenderer({});

// --------------------------------------------------
// Spell data and filters
// --------------------------------------------------

const {
    classOptions,
    levelOptions,
    typeOptions,

    classesFilters,
    levelFilters,
    typeFilters,

    outputSpells,
    selectedSpells,
    selectedCount,

    moveSpell

} = useSpellCards();

// --------------------------------------------------
// Workflow
// --------------------------------------------------

const FILTER = 'FILTER';
const SELECTION = 'SELECTION';
const CONFIRM = 'CONFIRM';
const PRINT = 'PRINT';

const step = ref(FILTER);

// --------------------------------------------------
// PDF
// --------------------------------------------------

let doc = null;

watch(step, async (newStep) => {

    if (newStep !== PRINT) return;

    await nextTick();

    const target = document.getElementById('divOutput');

    if (!target) return;

    target.replaceChildren();

    try {

        doc = dndRenderer.generatePdf(
            selectedSpells.value,
            target
        );

        const iframe = target.querySelector('iframe');

        if (iframe) {

            iframe.style.height = '100%';

            iframe.onload = () => {

                document.getElementById('divWarnMessage')?.remove();

            };

        }

    } catch (error) {

        console.error('Erro ao gerar PDF:', error);

        alert('Não foi possível gerar o PDF.');

    }

});

function openPdf() {

    if (doc) {

        doc.open();

    } else {

        alert('Ops... não foi possível gerar o PDF.');

    }

}

function downloadPdf() {

    if (doc) {

        doc.download(
            'dnd-spell-cards-' +
            Date.now().toString(16).toUpperCase()
        );

    } else {

        alert('Ops... não foi possível gerar o PDF.');

    }

}

</script>

<template>

    <div class="m-1">

        <!-- ====================================== -->
        <!-- FILTER -->
        <!-- ====================================== -->

        <div
            v-if="step === FILTER"
            class="card shadow-sm"
            style="height: 85vh">

            <div class="card-header bg-dark text-light">

                <h5 class="mb-0">Filters</h5>

            </div>

            <div class="card-body overflow-auto">

                <DNDFilter
                    name="Class"
                    :options="classOptions"
                    :filters="classesFilters" />

                <DNDFilter
                    name="Level"
                    :options="levelOptions"
                    :filters="levelFilters" />

                <DNDFilter
                    name="Type"
                    :options="typeOptions"
                    :filters="typeFilters" />

            </div>

            <button
                class="btn btn-primary"
                @click="step = SELECTION"
                :disabled="selectedCount === 0">

                <span class="p-2">
                    Next ({{ selectedCount }})
                </span>

                <i class="bi bi-chevron-right"></i>

            </button>

        </div>

        <!-- ====================================== -->
        <!-- SELECTION -->
        <!-- ====================================== -->

        <div
            v-else-if="step === SELECTION"
            class="card shadow-sm"
            style="height: 85vh">

            <div class="card-header bg-dark text-light d-flex align-items-center">

                <button
                    class="btn btn-transparent text-light"
                    @click="step = FILTER">

                    <i class="bi bi-chevron-left"></i>

                </button>

                <h5 class="mb-0">Spells</h5>

            </div>

            <div class="card-body overflow-auto">

                <div class="table-responsive">

                    <DNDTable :spells="outputSpells" />

                </div>

            </div>

            <button
                class="btn btn-primary"
                @click="step = CONFIRM"
                :disabled="selectedCount === 0">

                <span class="p-2">
                    Next ({{ selectedCount }})
                </span>

                <i class="bi bi-chevron-right"></i>

            </button>

        </div>

        <!-- ====================================== -->
        <!-- CONFIRM -->
        <!-- ====================================== -->

        <div
            v-else-if="step === CONFIRM"
            class="card shadow-sm"
            style="height: 85vh">

            <div class="card-header bg-dark text-light d-flex align-items-center">

                <button
                    class="btn btn-transparent text-light"
                    @click="step = SELECTION">

                    <i class="bi bi-chevron-left"></i>

                </button>

                <h5 class="mb-0">
                    Confirmation ({{ selectedCount }})
                </h5>

            </div>

            <div class="card-body overflow-auto">

                <DNDSpellConfirmation
                    :spells="outputSpells"
                    :renderer="dndRenderer"
                    @reorder="moveSpell" />

            </div>

            <button
                class="btn btn-primary"
                @click="step = PRINT"
                :disabled="selectedCount === 0">

                <span class="p-2">
                    Next ({{ selectedCount }})
                </span>

                <i class="bi bi-chevron-right"></i>

            </button>

        </div>

        <!-- ====================================== -->
        <!-- PRINT -->
        <!-- ====================================== -->

        <div
            v-else-if="step === PRINT"
            class="card shadow-sm"
            style="height: 85vh">

            <div class="card-header bg-dark text-light d-flex justify-content-between">

                <div class="d-flex align-items-center">

                    <button
                        class="btn btn-transparent text-light"
                        @click="step = CONFIRM">

                        <i class="bi bi-chevron-left"></i>

                    </button>

                    <h5 class="mb-0">
                        {{ selectedCount }} Spell Cards
                    </h5>

                </div>

                <button
                    class="btn btn-transparent text-light"
                    @click="downloadPdf">

                    <i class="bi bi-download"></i>

                </button>

            </div>

            <div
                class="card-body"
                style="overflow-y: hidden; padding: 0">

                <div id="divWarnMessage" class="p-3">

                    <p>
                        Se você não estiver visualizando o PDF,
                        pode tentar abri-lo em outra janela.
                    </p>

                    <button
                        class="btn btn-primary rounded-pill"
                        @click="openPdf">

                        Abrir em outra janela

                    </button>

                </div>

                <div
                    id="divOutput"
                    style="padding: 0; height: 100%">

                </div>

            </div>

        </div>

    </div>

</template>

<style scoped>

a {
    text-decoration: none;
}

</style>
