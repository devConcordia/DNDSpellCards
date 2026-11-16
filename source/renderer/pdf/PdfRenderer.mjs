import { SpellCardPdfRenderer } from "./SpellCardPdfRenderer.mjs";
import { SpellStatblockCardPdfRenderer } from "./SpellStatblockCardPdfRenderer.mjs";

export class PdfRenderer {

	constructor(options) {
		this.spellRenderer = new SpellCardPdfRenderer(options);
		this.spellStatblockCardPdfRenderer = new SpellStatblockCardPdfRenderer(options);
	}

	clearContext() {
		this.spellRenderer.clearContext();
		this.spellStatblockCardPdfRenderer.clearContext();
	}

	/**
	 * @param {SpellCard} spell
	 * @return {PDF.Path2D[]}
	 */
	render(spell) {
		const output = this.spellRenderer.render(spell);

		if (spell.statblock)
			output.push( ...this.spellStatblockCardPdfRenderer.render(spell) );

		return output;
	}

}
