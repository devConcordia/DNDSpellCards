
<script setup>

import { defineProps, watch } from 'vue';

const props = defineProps({
	name: String,
	options: Array,
	filters: Array
});

//watch(props.filters,()=> console.log("watch filter"));

function onChangeCheckbox( event ) {
	
	const input = event.target;

	if( input.checked ) {
		
		if( !props.filters.includes( input.value ) )
			props.filters.push( input.value );
		
		props.filters.sort();
	
	} else {
		
		const i = props.filters.indexOf( input.value );
		
		props.filters.splice( i, 1 );
		
	}
	
}

</script>

<template>
	
	<div class="mb-3">
		<label class="form-label fw-bold">{{ props.name }}</label><br>
		<div class="d-flex flex-wrap gap-2">
			
			<label  v-for="item in props.options" class="form-check-label">
				<input type="checkbox" class="form-check-input" 
					:value="item" :checked="filters.includes(item)"
					@change="onChangeCheckbox( $event )" />
				<span class="p-2">{{ item }}</span>
			</label>
			
		</div>
	</div>

</template>

<style scoped></style>
