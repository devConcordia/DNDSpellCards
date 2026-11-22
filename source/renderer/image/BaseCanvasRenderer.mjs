import { RendererOptions } from "../RendererOptions.mjs";
import { RendererContext } from "../RendererContext.mjs";
import { measureText } from "../common/measureText.mjs";
import { Paragraph } from "../common/Paragraph.mjs";
import { fonts, toCanvasY } from "./utils.mjs";

export class BaseCanvasRenderer {

	constructor(options, scale = 10) {
		this.options = (options instanceof RendererOptions) ? options : new RendererOptions(options);
		this.scale = scale;
		this.context = new RendererContext();
		this.cursorY = 0;
	}

	clearContext() {
		this.context = new RendererContext();
	}

	getRemaingSpace() {
		return this.cursorY / this.options.bound.height;
	}

	beginCard() {
		const canvas = document.createElement('canvas');
		canvas.width = this.options.width * this.scale;
		canvas.height = this.options.height * this.scale;

		const ctx = canvas.getContext('2d');
		ctx.scale(this.scale, this.scale);

		// Configurações padrão de traço e texto
		ctx.lineWidth = 0.25;
		ctx.strokeStyle = '#000000';
		ctx.fillStyle = '#000000';
		ctx.textBaseline = 'alphabetic';

		// Fundo branco da carta
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, this.options.width, this.options.height);
		ctx.fillStyle = '#000000';

		// Armazena o canvas no context.streams (mantendo compatibilidade com sua estrutura)
		this.context.append(canvas);

		const bound = this.options.bound;
		this.cursorY = bound.height + bound.y - 2;
	}

	get currentCtx() {
		return this.context.currentStream.getContext('2d');
	}

	skipLines(value = 1) {
		this.cursorY -= value * this.options.fontSize;
	}

	_y(y) {
		return toCanvasY(y, this.options.height);
	}

	_fillText(ctx, text, x, y, fontSize, fontStyle = fonts.NORMAL) {
		ctx.save();
		ctx.font = `${fontStyle} ${fontSize}px Helvetica, Arial, sans-serif`;
		ctx.fillText(String(text), x, this._y(y));
		ctx.restore();
	}

	drawLayout() {
		const ctx = this.currentCtx;
		const bound = this.options.bound;

		let w = this.options.width,
			h = this.options.height;

		let p = 2.5;
		let q = 1.5;
		let t = 6;

		ctx.beginPath();
		ctx.moveTo(0, this._y(0));
		ctx.lineTo(w, this._y(0));
		ctx.lineTo(w, this._y(h));
		ctx.lineTo(0, this._y(h));
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(p, this._y(p));
		ctx.lineTo(w - p, this._y(p));
		ctx.lineTo(w - p, this._y(h - p));
		ctx.lineTo(p, this._y(h - p));
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(t, this._y(q));
		ctx.lineTo(w - t, this._y(q));
		ctx.lineTo(w - q, this._y(t));
		ctx.lineTo(w - q, this._y(h - t));
		ctx.lineTo(w - t, this._y(h - q));
		ctx.lineTo(t, this._y(h - q));
		ctx.lineTo(q, this._y(h - t));
		ctx.lineTo(q, this._y(t));
		ctx.closePath();
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(bound.x + 3, this._y(bound.y + bound.height));
		ctx.lineTo(bound.x + bound.width - 3, this._y(bound.y + bound.height));
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(bound.x, this._y(bound.y));
		ctx.lineTo(bound.x + bound.width, this._y(bound.y));
		ctx.stroke();
	}

	drawTitle(text) {
		const ctx = this.currentCtx;
		const bound = this.options.bound;

		let tw = measureText(text, '30px Arial').width / 10;
		let fontSize = (tw >= (bound.width - 4)) ? 2.5 : 3;

		this._fillText(ctx, text, 6, 78.5, fontSize, fonts.BOLD);
	}

	drawSubtitle(text) {
		const ctx = this.currentCtx;
		const bound = this.options.bound;

		let tw = measureText(text, '20px Arial').width / 10;
		let fontSize = (tw >= (bound.width - 8)) ? 2 : 2.5;

		this._fillText(ctx, text, 6, 75, fontSize, fonts.ITALIC);
	}

	drawFooter(text) {
		const ctx = this.currentCtx;
		const bound = this.options.bound;

		let tw = measureText(text, '20px Arial').width / 10;
		let fontSize = (tw >= (bound.width - 8)) ? 1.5 : 2;

		this._fillText(ctx, text, 6, 4, fontSize, fonts.NORMAL);
	}

	drawCardNumber() {
		const bound = this.options.bound;
		const canvases = this.context.streams;

		for (let i = 0; i < canvases.length; i++) {
			const ctx = canvases[i].getContext('2d');
			const text = (i + 1) + '/' + canvases.length;

			this._fillText(ctx, text, bound.width + 3, 4, 2, fonts.BOLD);
		}
	}

	drawSeparator(full = false) {
		const ctx = this.currentCtx;
		const bound = this.options.bound;

		ctx.beginPath();
		if (full) {
			ctx.moveTo(bound.x, this._y(this.cursorY));
			ctx.lineTo(bound.x + bound.width, this._y(this.cursorY));
		} else {
			ctx.moveTo(bound.x + 3, this._y(this.cursorY));
			ctx.lineTo(bound.x + bound.width - 3, this._y(this.cursorY));
		}
		ctx.stroke();

		this.cursorY -= 2.5;
	}

	drawParagraph(paragraph) {
		const ctx = this.currentCtx;
		const bound = this.options.bound;

		while (paragraph.length > 0) {

			if (paragraph[0].y <= bound.y)
				return paragraph;

			const word = paragraph.shift();

			this._fillText(ctx, word.content, word.x, word.y, word.fontSize, fonts[word.type]);

			if (paragraph.length == 0)
				this.cursorY = word.y - word.fontSize * 1.5;
		}

		return null;
	}

	drawTable(data, sizes, fontSize = 2, space = .75) {
		const bound = this.options.bound;

		let x = bound.x;
		let output = [];
		let dx = [0];

		for (let sz of sizes)
			dx.push(dx.at(-1) + sz);

		for (let line of data) {
			let y = this.cursorY;

			for (let i = 0; i < line.length; i++) {
				let columnWidth = bound.width * sizes[i];
				let p = Paragraph.Create(x + bound.width * dx[i], y, line[i], columnWidth, { space, fontSize });

				if (p.length == 0) continue;

				this.drawParagraph(p);
			}
		}

		return output;
	}
}
