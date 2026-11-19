import { ref, computed, watch } from 'vue';

import spells from '../../../data/dnd-players-handbook-spells.json';

export function useSpellCards() {

    // Prepara os dados sem modificar o JSON original.
    const allSpells = spells.map(spell => ({
        ...spell,
        classes: [...spell.classes],
        printOut: true
    }));

    // Opções disponíveis.
    const classOptions = [...new Set(
        allSpells.flatMap(spell => spell.classes)
    )].sort();

    const levelOptions = [...new Set(
        allSpells.map(spell => spell.level)
    )].sort((a, b) => a - b);

    const typeOptions = [...new Set(
        allSpells.map(spell => spell.type)
    )].sort();

    // Filtros.
    const classesFilters = ref([]); //ref(classOptions.slice());
    const levelFilters = ref(levelOptions.slice());
    const typeFilters = ref(typeOptions.slice());

    // Cartas disponíveis.
    const outputSpells = ref(allSpells);

    // Cartas selecionadas para impressão.
    const selectedSpells = computed(() =>
        outputSpells.value.filter(spell => spell.printOut)
    );

    const selectedCount = computed(() =>
        selectedSpells.value.length
    );

    // Aplicação dos filtros.
    function onOptionsChange() {

        outputSpells.value = allSpells
            .filter(spell => {

                const classMatch = spell.classes.some(nclass =>
                    classesFilters.value.includes(nclass)
                );

                const levelMatch = levelFilters.value.includes(spell.level);

                const typeMatch = typeFilters.value.includes(spell.type);

                return classMatch && levelMatch && typeMatch;

            })
            .map(spell => ({
                ...spell,
                printOut: true
            }));

    }

    watch(
        [classesFilters, levelFilters, typeFilters],
        onOptionsChange,
        { deep: true }
    );

    // Reordenação das cartas.
    function moveSpell(sourceSpell, targetSpell) {

        const sourceIndex = outputSpells.value.indexOf(sourceSpell);
        const targetIndex = outputSpells.value.indexOf(targetSpell);

        if (sourceIndex < 0 || targetIndex < 0) return;

        const [movedSpell] = outputSpells.value.splice(sourceIndex, 1);

        outputSpells.value.splice(targetIndex, 0, movedSpell);

    }

    return {
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
    };

}
