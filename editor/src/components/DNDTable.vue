<script setup>

import { defineProps, ref } from 'vue';
import DNDSpellPreviewModal from './DNDSpellPreviewModal.vue';

const props = defineProps({
	spells: Array,
	renderer: {
        type: Object,
        required: true
    }
});

const previewModal = ref(null);

const sortName = ref(0);
const sortType = ref(0);
const sortLevel = ref(0);
const sortClasses = ref(0);

function sort( key, dir ) {

	if( key == 'classes' ) {
		if( dir&1 ) {

			props.spells.sort((a, b) => b.classes.length - a.classes.length);

		} else {

			props.spells.sort((a, b) => a.classes.length - b.classes.length);

		}
	} else {
		if( dir&1 ) {

			props.spells.sort((a, b) => b[key].localeCompare(a[key]));

		} else {

			props.spells.sort((a, b) => a[key].localeCompare(b[key]));

		}
	}

}

function toggle( spell ) {

	spell.printOut = !spell.printOut;

}

function previewSpell(spell) {

    previewModal.value.open(spell);

}

</script>

<template>
	<div>
	  <table class="table table-bordered table-hover align-middle text-center">
		<thead class="table-secondary">
		  <tr>
			<th>#</th>
			<th></th>
			<th @click="sort('name',sortName++)">Nome</th>
			<th @click="sort('level',sortLevel++)">Level</th>
			<th @click="sort('type',sortType++)">Type</th>
			<th @click="sort('classes',sortClasses++)">Class</th>
		  </tr>
		</thead>
		<tbody>
			<tr v-for="spell in props.spells"
				:class="spell.printOut? '' : 'tr-disabled'"
				@click.stop="toggle( spell )" >
				<td>
					<input type="checkbox" :checked="spell.printOut" @click.stop="toggle( spell )" />
				</td>
				<td>
					<button class="btn btn-sm btn-outline-primary" title="Visualizar"
                        @click.stop="previewSpell(spell)">
                        <i class="bi bi-card-image"></i>
                    </button>
				</td>
				<td class="justify-content-between">
					{{ spell.name }}
				</td>
				<td>{{ spell.level }}</td>
				<td>{{ spell.type }}</td>
				<td>{{ spell.classes.join(' ') }}</td>
			</tr>
		</tbody>
	  </table>

	  <DNDSpellPreviewModal
	      ref="previewModal"
	      :renderer="renderer" />
	</div>
</template>

<style scoped>

.tr-disabled {
	text-decoration: line-through;
	opacity:.75;
}

</style>
