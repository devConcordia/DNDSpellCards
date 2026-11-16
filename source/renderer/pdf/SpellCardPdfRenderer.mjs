import { BasePdfRenderer } from "./BasePdfRenderer.mjs";
import { Paragraph } from "../common/Paragraph.mjs";

export class SpellCardPdfRenderer extends BasePdfRenderer {

	startNewSpellCard(spell) {

		this.resetCardContext();

		this.drawLayout();
		// this.context.currentStream.stroke();

		this.drawTitle(spell.name);
		this.drawSubtitle(spell.level + ' - ' + spell.type);

		if (this.context.streams.length == 1)
			this.drawFooter(spell.classes.join(' | '));

	}

	render(spell) {

		this.startNewSpellCard(spell);

		this.skipLines(.5);
		this.drawDetails(spell);
		this.drawContent(spell);
		this.drawReferences(spell);
		this.drawCardNumber();

		return this.context.streams;

	}

	drawDetails(spell) {

		this.drawTable([
			["**Casting Time**", spell.casting],
			["**Range**", spell.range],
			["**Components**", spell.components],
			["**Duration**", spell.duration]
		], [.27, .73]);

		this.skipLines(-.5);
		this.drawSeparator(true);

	}

	drawContent(spell) {

		const { bound, fontSize, space } = this.options;

		for (const text of spell.content) {

			const paragraph = Paragraph.Create(bound.x, this.cursorY, text, bound.width, space, fontSize);
			const remaining = this.drawParagraph(paragraph);

			if (remaining) {
				this.startNewSpellCard(spell);
				this.skipLines(2);

				remaining.translate(0, bound.height - 2);
				this.drawParagraph(remaining);
			}

		}

	}

	drawReferences(spell) {

		if (!Array.isArray(spell.tables))
			return;

		const { bound, fontSize, space } = this.options;

		for (const tb of spell.tables) {

			if (this.getRemaingSpace() < .5)
				this.startNewSpellCard(spell);

			this.skipLines(1);

			if (tb.title) {

				const paragraph = Paragraph.Create(bound.x, this.cursorY, '**' + tb.title + '**', bound.width, space, fontSize + .5);

				this.drawParagraph(paragraph);
				this.skipLines(-1);
				this.drawSeparator(true);

			}

			this.drawTable(tb.header.map(e => e.map(t => '**' + t + '**')), tb.sizes);

			this.skipLines(-.5);

			this.drawSeparator(true);
			this.drawTable(tb.body, tb.sizes);
			this.skipLines(1.5);

		}

	}

}
