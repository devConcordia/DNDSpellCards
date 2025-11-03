<script setup>
import { ref, watch, nextTick, computed } from 'vue';

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
	
	spell.printOut = false;
	
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
const CONFIRM = 'CONFIRM';
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
		
		if( addFlag ) {
			spell.printOut = true;
			outputSpells.value.push( spell );
		}
		
	}
	
}

///
const classesFilters = ref([]); // classOptions.slice() to all classes selected
const levelFilters = ref( levelOptions.slice() );
const typeFilters = ref( typeOptions.slice() );

///
watch([ classesFilters, levelFilters, typeFilters ], onOptionsChange, { deep: true });

let doc = null;

///
watch(step, async function() {
	
	if( step.value == FILTER ) {
		for( let spell of spells )
			spell.printOut = true;
	}
	
	if( step.value == PRINT ) {
		
		/// wait dom is ready
		await nextTick();
		
		let target = document.getElementById('divOutput');
		
		while( target.firstChild ) target.firstChild.remove();
		
		let onlyPrintOut = outputSpells.value.filter(e => e.printOut);
		
		doc = DNDSpellCards.CreatePDF( onlyPrintOut, target );
		
		let iframe = target.querySelector('iframe');
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

function countPrintOut( target ) {
	
	let out = 0;
	
	for( let e of target )
		if( e.printOut ) out++;
	
	return out;
	
}


let dragIndex = null;

function onDragStart(index) {
	
	dragIndex = index;
	
}

function onDrop(dropIndex) {
	
	const movedItem = outputSpells.value.splice(dragIndex, 1)[0];
	outputSpells.value.splice(dropIndex, 0, movedItem);
	dragIndex = null;
	
}

</script>

<template>
<div class="container">
	
	<div class="m-1 d-flex justify-content-between align-items-center">
		<h1 class="fs-2">D&D Spell Cards</h1>
		<a class="btn btn-primary" href="https://github.com/devConcordia/DNDSpellCards" target="_blank" rel="noopener noreferrer"><i class="bi bi-github"></i> Open Source</a>
	</div>
	
	<div class="m-1">
	
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
					@click="step = SELECTION" :disabled="countPrintOut( outputSpells ) == 0">
				<span class="p-2" >Next ({{ countPrintOut( outputSpells ) }})</span>
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
					@click="step = CONFIRM" :disabled="countPrintOut( outputSpells ) == 0">
				<span class="p-2" >Next ({{ countPrintOut( outputSpells ) }})</span>
				<span class="bi bi-chevron-right" ></span>
			</button>
		</div>
		
		<div v-else-if="step == CONFIRM" 
			 class="card shadow-sm" style="height: 85vh;">
			<div class="card-header bg-dark text-light d-flex align-items-center">
				<button class="btn btn-transparent text-light" style="padding: 0 .25em;"
						@click="step = SELECTION">
					<span class="bi bi-chevron-left" ></span>
				</button>
				<h5 class="mb-0">Spells</h5>
			</div>
			
			<div class="card-body" style="overflow-y: auto;">
				<div class="table-responsive">
					<ul class="list-unstyled">
						<template v-for="(spell, index) of outputSpells">
							<li v-if="spell.printOut" 
								class="d-flex flex-nowarp align-items-center justify-content-between"
								draggable="true"
								@dragstart="onDragStart(index)"
								@dragover.prevent
								@drop="onDrop(index)" >
								<span class="text-truncate w-50">
									<span class="mx-1 bi bi-grip-horizontal"></span> 
									{{ spell.name }}
								</span>
								<div class="d-flex align-items-center justify-content-between w-50">
									<span class="text-truncate w-auto">{{ spell.level }}</span>
									<span class="text-truncate w-auto">{{ spell.type }}</span>
									<span class="text-truncate w-50 d-none d-lg-block" style="max-width:7em">{{ spell.classes.join(', ') }}</span>
								</div>
							</li>						
						</template>
					</ul>
				</div>
			</div>
			
			<button class="btn btn-primary"
					@click="step = PRINT" :disabled="outputSpells.length == 0">
				<span class="p-2" >Next ({{ countPrintOut( outputSpells ) }})</span>
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
					<h5 class="mb-0">{{ countPrintOut( outputSpells ) }} Spell Cards</h5>
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
	
	<div class="container mt-3 text-center">
		<p>Powered by <a href="https://github.com/devConcordia" target="_blank" rel="noopener noreferrer"><i class="bi bi-github"></i> devConcordia</a> <small>(v1.0.2)</small></p>
	</div>
	
</div>
</template>

<style scoped>

a { text-decoration:none; }

.w-10 { width:10% }
.w-20 { width:20% }
.w-30 { width:30% }
.w-40 { width:40% }
.w-60 { width:60% }
.w-70 { width:70% }
.w-80 { width:80% }
.w-90 { width:90% }

</style>


