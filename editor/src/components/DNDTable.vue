<script setup>

import { defineProps, ref } from 'vue';

const props = defineProps({
	spells: Array
});

const sortName = ref(0);
const sortType = ref(0);
const sortLevel = ref(0);
const sortClasses = ref(0);

function sort( key, dir ) {
	
	/// if is classes, sort by quantity
	if( key == 'classes' ) {
		
		/// dir is a counter
		/// dir&1 → 00000000 & 1 = 0 (false)
		/// dir&1 → 00000001 & 1 = 1 (true)
		/// dir&1 → 00000010 & 1 = 0 (false)
		if( dir&1 ) {
			
			props.spells.sort((a, b) => b.classes.length - a.classes.length);
			
		} else {
			
			props.spells.sort((a, b) => a.classes.length - b.classes.length);
			
		}
	} else {
		/// dir is a counter
		/// dir&1 → 00000000 & 1 = 0 (false)
		/// dir&1 → 00000001 & 1 = 1 (true)
		/// dir&1 → 00000010 & 1 = 0 (false)
		if( dir&1 ) {
			
			props.spells.sort((a, b) => b[key].localeCompare(a[key]));
			
		} else {
			
			props.spells.sort((a, b) => a[key].localeCompare(b[key]));
			
		}
	}
	
}

function remove( spell ) {

	const i = props.spells.indexOf( spell );
	
	props.spells.splice( i, 1 );
	
}

</script>

<template>
  
  <table class="table table-bordered table-hover align-middle text-center">
	<thead class="table-secondary">
	  <tr>
		<!-- 
		<th @click="sort('name',sortName++)">Nome <span style="display:inline" :class="(sortName%3 == 1)? 'bi bi-chevron-down' : (sortName%3 == 2)? 'bi bi-chevron-up' : ''" ></span></th>
		<th @click="sort('level',sortLevel++)">Level <span style="display:inline" :class="(sortLevel%3 == 1)? 'bi bi-chevron-down' : (sortLevel%3 == 2)? 'bi bi-chevron-up' : ''" ></span></th>
		<th @click="sort('type',sortType++)">Type <span style="display:inline" :class="(sortType%3 == 1)? 'bi bi-chevron-down' : (sortType%3 == 2)? 'bi bi-chevron-up' : ''" ></span></th>
		<th @click="sort('classes',sortClasses++)">Class <span style="display:inline" :class="(sortClasses%3 == 1)? 'bi bi-chevron-down' : (sortClasses%3 == 2)? 'bi bi-chevron-up' : ''" ></span></th>
		-->
		<th>X</th>
		<th @click="sort('name',sortName++)">Nome</th>
		<th @click="sort('level',sortLevel++)">Level</th>
		<th @click="sort('type',sortType++)">Type</th>
		<th @click="sort('classes',sortClasses++)">Class</th>
	  </tr>
	</thead>
	<tbody>
		<tr v-for="spell in props.spells" >
			<td>
				<button class="btn btn-transparent text-danger p-0" 
					    @click="remove(spell)" >
					<span class="bi bi-x text-danger p-0"></span>
				</button>
			</td>
			<td>{{ spell.name }}</td>
			<td>{{ spell.level }}</td>
			<td>{{ spell.type }}</td>
			<td>{{ spell.classes.join(' ') }}</td>
		</tr>
	</tbody>
  </table>
  
</template>

<style scoped></style>
