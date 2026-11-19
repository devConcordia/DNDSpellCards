<script setup>

import { ref, computed } from 'vue';

import DNDSpellPreviewModal from './DNDSpellPreviewModal.vue';

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

const emit = defineEmits(['reorder']);

const previewModal = ref(null);

const selectedSpells = computed(() =>
    props.spells.filter(spell => spell.printOut)
);

let dragSpell = null;

function onDragStart(spell) {

    dragSpell = spell;

}

function onDrop(targetSpell) {

    if (!dragSpell || dragSpell === targetSpell) return;

    emit('reorder', dragSpell, targetSpell);

    dragSpell = null;

}

function previewSpell(spell) {

    previewModal.value.open(spell);

}

</script>

<template>

    <div>

        <ul class="list-unstyled">

            <li
                v-for="spell in selectedSpells"
                :key="spell.name"
                class="d-flex align-items-center justify-content-between border-bottom py-2"
                draggable="true"
                @dragstart="onDragStart(spell)"
                @dragover.prevent
                @drop="onDrop(spell)">

                <span class="text-truncate w-50">

                    <i class="bi bi-grip-vertical mx-1"></i>

                    {{ spell.name }}

                </span>

                <div class="d-flex align-items-center justify-content-between gap-2 w-50">

                    <span>{{ spell.level }}</span>

                    <span>{{ spell.type }}</span>

                    <span
                        class="text-truncate d-none d-lg-block"
                        style="max-width: 7em">

                        {{ spell.classes.join(', ') }}

                    </span>

                    <!-- Preview -->
                    <button
                        class="btn btn-sm btn-outline-primary"
                        title="Visualizar carta"
                        @click.stop="previewSpell(spell)"
                        @dragstart.stop.prevent>

                        <i class="bi bi-eye"></i>

                    </button>

                </div>

            </li>

        </ul>

        <!-- Modal -->
        <DNDSpellPreviewModal
            ref="previewModal"
            :spells="selectedSpells"
            :renderer="renderer" />

    </div>

</template>
