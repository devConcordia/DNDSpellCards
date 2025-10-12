<script setup>
import { ref, watch, nextTick } from 'vue';

import DNDFilter from './components/DNDFilter.vue';
import DNDTable from './components/DNDTable.vue';

import DNDSpellCards from '../../source/DNDSpellCards.mjs';

import spells from '../../data/dnd-players-handbook-spells.json';

//console.log( spells );

const classOptions = [];
const levelOptions = [];
const typeOptions = [];

///
for( let spell of spells ) {
	
	for( let nclass of spell.classes )
		if( !classOptions.includes( nclass ) ) classOptions.push( nclass );
	
	if( !levelOptions.includes( spell.level ) ) levelOptions.push( spell.level );
	if( !typeOptions.includes( spell.type ) ) typeOptions.push( spell.type );
	
}

classOptions.sort();
levelOptions.sort();
typeOptions.sort();

/// 
const FILTER = 'FILTER';
const SELECTION = 'SELECTION';
const PRINT = 'PRINT';

const step = ref( FILTER );

///
const outputSpells = ref( spells );

function onOptionsChange() {
	
	outputSpells.value = [];
	
	///
	for( let spell of spells ) {
		
		let addFlag = false;
		
		/// class: if there is at least one
		for( let nclass of spell.classes ) {
			if( classesFilters.value.includes( nclass ) ) {
				addFlag = true;
				break;
			}
		}
		
		if( !addFlag ) continue;
		
		/// level 
		addFlag = levelFilters.value.includes( spell.level );
		
		if( !addFlag ) continue;
		
		/// type 
		addFlag = typeFilters.value.includes( spell.type );
		
		if( addFlag ) 
			outputSpells.value.push( spell );
		
	}
	
}

///
const classesFilters = ref( classOptions.slice() );
const levelFilters = ref( levelOptions.slice() );
const typeFilters = ref( typeOptions.slice() );

///
watch([ classesFilters, levelFilters, typeFilters ], onOptionsChange, { deep: true });

let doc = null;

///
watch(step, async function() {
	
	if( step.value == 'PRINT' ) {
		
		/// wait dom is ready
		await nextTick();
		
		let target = document.getElementById('divOutput');
		
		while( target.firstChild ) target.firstChild.remove();
		
		doc = DNDSpellCards.CreatePDF( outputSpells.value, target );
		
		let iframe = target.querySelector('iframe');
		//iframe.style.height = '70vh';
		iframe.style.height = '100%';
		
		iframe.onload = function() {
			document.getElementById('divWarnMessage')?.remove();
		};
		
	}
	
});


function openPdf() {
	
	if( doc ) {
		
		doc.open();
	
	} else {
		
		alert('ops ... parece que não foi possivel gerar o pdf');
		
	}
	
}

function downloadPdf() {
	
	if( doc ) {
		
		doc.download( 'dnd-spell-cards-'+ Date.now().toString(16).toUpperCase() );
	
	} else {
		
		alert('ops ... parece que não foi possivel gerar o pdf');
		
	}
	
}

</script>

<template>
<div class="container">

	<h1 class="m-3">D&D Spell Cards</h1>
	
	<div class="m-3">
	
		<div v-if="step == FILTER" 
			 class="card shadow-sm" style="height: 85vh;">
			<div class="card-header bg-dark text-light" >
				<h5 class="mb-0">Filters</h5>
			</div>
			
			<div class="card-body" style="overflow-y: auto;">
				<DNDFilter name="Class" :options="classOptions" :filters="classesFilters" />
				<DNDFilter name="Level" :options="levelOptions" :filters="levelFilters" />
				<DNDFilter name="Type"  :options="typeOptions"  :filters="typeFilters" />
			</div>
			
			<button class="btn btn-primary"
					@click="step = SELECTION">
				<span class="p-2" >Next ({{ outputSpells.length }})</span>
				<span class="bi bi-chevron-right" ></span>
			</button>
		</div>
		
		<div v-else-if="step == SELECTION" 
			 class="card shadow-sm" style="height: 85vh;">
			<div class="card-header bg-dark text-light d-flex align-items-center">
				<button class="btn btn-transparent text-light" style="padding: 0 .25em;"
						@click="step = FILTER">
					<span class="bi bi-chevron-left" ></span>
				</button>
				<h5 class="mb-0">Spells</h5>
			</div>
			
			<div class="card-body" style="overflow-y: auto;">
				<div class="table-responsive">
					<DNDTable :spells="outputSpells" />
				</div>
			</div>
			
			<button class="btn btn-primary"
					@click="step = PRINT">
				<span class="p-2" >Next ({{ outputSpells.length }})</span>
				<span class="bi bi-chevron-right" ></span>
			</button>
		</div>
		
		<div v-else-if="step == PRINT" 
			 class="card shadow-sm" style="height: 85vh;">
			<div class="card-header bg-dark text-light d-flex justify-content-between">
				<div class="d-flex">
					<button class="btn btn-transparent text-light" style="padding: 0 .25em;"
							@click="step = SELECTION">
						<span class="bi bi-chevron-left" ></span>
					</button>
					<h5 class="mb-0">{{ outputSpells.length }} Spell Cards</h5>
				</div>
				<button class="btn btn-transparent text-light" style="padding: 0 .25em;"
						@click="downloadPdf()">
					<span class="bi bi-download" ></span>
				</button>
			</div>
			
			<div class="card-body" style="overflow-y: hidden; padding:0;">
				<div id="divWarnMessage" class="p-3">
					<p>Se você não estiver vizualizando o PDF pode tentar abrir em outra janela.</p>
					<button class="btn btn-primary rounded-pill" @click="openPdf()" >Abrir em outra janela</button>
				</div>
				<div id="divOutput" style="padding:0; height:100%"></div>
			</div>
		</div>
		
	</div>
</div>
</template>

<style scoped></style>


