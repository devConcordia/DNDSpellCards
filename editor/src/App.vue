<script setup>
import DNDSpellCards from './DNDSpellCards.vue';
</script>

<template>
<div class="container">

	<div class="m-1 d-flex justify-content-between align-items-center">
		<h1 class="fs-2">D&D Spell Cards</h1>
		<a class="btn btn-primary" href="https://github.com/devConcordia/DNDSpellCards" target="_blank" rel="noopener noreferrer"><i class="bi bi-github"></i> Open Source</a>
	</div>

	<DNDSpellCards ></DNDSpellCards>

	<div class="container mt-3 text-center">
		<p>Powered by <a href="https://github.com/devConcordia" target="_blank" rel="noopener noreferrer"><i class="bi bi-github"></i> devConcordia</a></p>
	</div>

</div>
</template>

<style scoped>

a { text-decoration:none; }

</style>
