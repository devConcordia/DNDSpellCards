import { BaseCanvasRenderer } from "./BaseCanvasRenderer.mjs";
import { Paragraph } from "../common/Paragraph.mjs";
import { STATBLOCK_FEATURES } from "../common/constants.mjs";

export class SpellStatblockCardCanvasRenderer extends BaseCanvasRenderer {

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

		const ctx = this.currentCtx;

		let w = this.options.width,
			h = this.options.height;

		let p = 2.5;
		let q = 1.5;
		let t = 6;

		ctx.save();
		ctx.beginPath();
		ctx.moveTo(p, this._y(p));
		ctx.lineTo(w - p, this._y(p));
		ctx.lineTo(w - p, this._y(h - p));
		ctx.lineTo(p, this._y(h - p));
		ctx.closePath();

		ctx.moveTo(t, this._y(q));
		ctx.lineTo(w - t, this._y(q));
		ctx.lineTo(w - q, this._y(t));
		ctx.lineTo(w - q, this._y(h - t));
		ctx.lineTo(w - t, this._y(h - q));
		ctx.lineTo(t, this._y(h - q));
		ctx.lineTo(q, this._y(h - t));
		ctx.lineTo(q, this._y(t));
		ctx.closePath();

		ctx.fillStyle = '#000000';
		ctx.fill('evenodd');
		ctx.restore();
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

			const paragraph = Paragraph.Create(bound.x, this.cursorY, '**' + key + '**', bound.width, { space, fontSize: fontSize + .25 });
			this.drawParagraph(paragraph);

			let content = statblock[key];

			for (const text of content) {
				const paragraph = Paragraph.Create(bound.x, this.cursorY, text, bound.width, { space, fontSize, justify:true });
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
