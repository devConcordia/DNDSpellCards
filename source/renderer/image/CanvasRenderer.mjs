import { SpellCardCanvasRenderer } from "./SpellCardCanvasRenderer.mjs";
import { SpellStatblockCardCanvasRenderer } from "./SpellStatblockCardCanvasRenderer.mjs";

export class CanvasRenderer {

	constructor(options, scale = 10) {
		this.spellRenderer = new SpellCardCanvasRenderer(options, scale);
		this.spellStatblockCardCanvasRenderer = new SpellStatblockCardCanvasRenderer(options, scale);
	}

	clearContext() {
		this.spellRenderer.clearContext();
		this.spellStatblockCardCanvasRenderer.clearContext();
	}

	/**
	 * @param {SpellCard} spell
	 * @return {HTMLCanvasElement[]}
	 */
	render(spell) {

		const output = [...this.spellRenderer.render(spell)];

		if (spell.statblock)
			output.push(...this.spellStatblockCardCanvasRenderer.render(spell));

		return output;

	}
}
