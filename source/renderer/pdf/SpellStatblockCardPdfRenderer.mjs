import { BasePdfRenderer } from "./BasePdfRenderer.mjs";
import { Paragraph } from "../common/Paragraph.mjs";
import { STATBLOCK_FEATURES } from "../common/constants.mjs";

export class SpellStatblockCardPdfRenderer extends BasePdfRenderer {

	beginCard(spell, statblock) {

		super.beginCard();

		this.drawLayout();
		this.drawTitle(statblock.title);
		this.drawSubtitle(statblock.subtitle);
		this.drawFooter(spell.name + ' | ' + spell.level + ' - ' + spell.type);

	}

	render(spell) {

		const statblock = spell.statblock;

		if (!statblock)
			return this.context.streams;

		this.beginCard(spell, statblock);

		this.drawStatblockDetails(statblock);
		this.drawAddons(statblock);
		this.drawFeatures(spell, statblock);
		this.drawCardNumber();

		return this.context.streams;

	}

	drawLayout() {

		super.drawLayout();

		const stream = this.context.currentStream;

		let w = this.options.width,
			h = this.options.height;

		let p = 2.5;
		let q = 1.5;
		let t = 6;

		stream.save();
		stream.moveTo(p, p);
		stream.lineTo(w - p, p);
		stream.lineTo(w - p, h - p);
		stream.lineTo(p, h - p);

		stream.moveTo(t, q);
		stream.lineTo(w - t, q);
		stream.lineTo(w - q, t);
		stream.lineTo(w - q, h - t);
		stream.lineTo(w - t, h - q);
		stream.lineTo(t, h - q);
		stream.lineTo(q, h - t);
		stream.lineTo(q, t);
		stream.both(true, true);
		stream.restore();

	}

	drawStatblockDetails(statblock) {

		this.skipLines(.5);

		this.drawTable([
			["**AC**", statblock.AC],
			["**HP**", statblock.HP],
			["**Speed**", statblock.Speed]
		], [.25, .75], 2, .75);

		this.skipLines(-.5);
		this.drawSeparator(true);

		let { STR, DEX, CON, INT, WIS, CHA } = statblock.attributes;

		this.drawTable([
			['', '', 'MOD', 'SAVE', '', '', 'MOD', 'SAVE'],
			['**STR**', ...STR, '**DEX**', ...DEX],
			['**CON**', ...CON, '**INT**', ...INT],
			['**WIS**', ...WIS, '**CHA**', ...CHA]
		], new Float32Array(8).fill(0.125), 1.75, 0);

		this.drawSeparator(true);

	}

	drawAddons(statblock) {

		const addons = [];

		for (let k in statblock.addons)
			addons.push(['**' + k + '**', statblock.addons[k]]);

		this.drawTable(addons, [.28, .72], 2);

	}

	drawFeatures(spell, statblock) {

		const { bound, fontSize, space } = this.options;

		for (const key of STATBLOCK_FEATURES) {

			if (!(key in statblock))
				continue;

			if (this.getRemaingSpace() < .25) {

				this.beginCard(spell, statblock);

			} else {

				this.drawSeparator(true);

			}

			// this.skipLines(1);

			const paragraph = Paragraph.Create(bound.x, this.cursorY, '**' + key + '**', bound.width, { space, fontSize: fontSize + .25 });
			this.drawParagraph(paragraph);

			let content = statblock[key];

			for (const text of content) {

				const paragraph = Paragraph.Create(bound.x, this.cursorY, text, bound.width, { space, fontSize, justify: true });
				const remaining = this.drawParagraph(paragraph);

				if (remaining) {
					this.beginCard(spell, statblock);
					remaining.translate(0, bound.height - 2);
					this.drawParagraph(remaining);
				}

			}
		}

	}

}
