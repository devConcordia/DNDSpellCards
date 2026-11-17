import { PDF } from "pdf-javascript";
import { RendererOptions } from "../RendererOptions.mjs";
import { RendererContext } from "../RendererContext.mjs";
import { measureText } from "../common/measureText.mjs";
import { Paragraph } from "../common/Paragraph.mjs";
import { fonts, getBuffer } from "./utils.mjs";

export class BasePdfRenderer {

	constructor(options) {

		this.options = (options instanceof RendererOptions)? options : new RendererOptions(options);

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

		this.context.append(new PDF.Path2D());

		const bound = this.options.bound;

		this.cursorY = bound.height + bound.y - 2;

	}

	skipLines(value = 1) {

		this.cursorY -= value * this.options.fontSize;

	}

	drawLayout() {

		const stream = this.context.currentStream;
		const bound = this.options.bound;

		let w = this.options.width,
			h = this.options.height;

		let p = 2.5;
		let q = 1.5;
		let t = 6;

		stream.moveTo(0, 0);
		stream.lineTo(w, 0);
		stream.lineTo(w, h);
		stream.lineTo(0, h);
		stream.stroke(true);

		stream.moveTo(p, p);
		stream.lineTo(w - p, p);
		stream.lineTo(w - p, h - p);
		stream.lineTo(p, h - p);
		stream.stroke(true);

		stream.moveTo(t, q);
		stream.lineTo(w - t, q);
		stream.lineTo(w - q, t);
		stream.lineTo(w - q, h - t);
		stream.lineTo(w - t, h - q);
		stream.lineTo(t, h - q);
		stream.lineTo(q, h - t);
		stream.lineTo(q, t);
		stream.stroke(true);

		stream.moveTo(bound.x + 3, bound.y + bound.height);
		stream.lineTo(bound.x + bound.width - 3, bound.y + bound.height);
		stream.stroke();

		stream.moveTo(bound.x, bound.y);
		stream.lineTo(bound.x + bound.width, bound.y);
		stream.stroke();

	}

	drawTitle(text) {

		const stream = this.context.currentStream;
		const bound = this.options.bound;

		let tw = measureText(text, '30px Arial').width / 10;
		let fontSize = (tw >= (bound.width - 4)) ? 2.5 : 3;

		stream.fillText(getBuffer(text), 6, 78.5, fontSize, fonts.BOLD);

	}

	drawSubtitle(text) {

		const stream = this.context.currentStream;
		const bound = this.options.bound;

		let tw = measureText(text, '20px Arial').width / 10;
		let fontSize = (tw >= (bound.width - 8)) ? 2 : 2.5;

		stream.fillText(getBuffer(text), 6, 75, fontSize, fonts.ITALIC);

	}

	drawFooter(text) {

		const stream = this.context.currentStream;
		const bound = this.options.bound;

		let tw = measureText(text, '20px Arial').width / 10;
		let fontSize = (tw >= (bound.width - 8)) ? 1.5 : 2;

		stream.fillText(getBuffer(text), 6, 4, fontSize, fonts.NORMAL);

	}

	drawCardNumber() {

		const bound = this.options.bound;
		const streams = this.context.streams;

		for (let i = 0; i < streams.length; i++) {

			const stream = streams[i];
			const text = (i + 1) + '/' + streams.length;

			stream.fillText(getBuffer(text), bound.width + 3, 4, 2, fonts.BOLD);

		}

	}

	drawSeparator(full = false) {

		const stream = this.context.currentStream;
		const bound = this.options.bound;

		if (full) {

			stream.moveTo(bound.x, this.cursorY);
			stream.lineTo(bound.x + bound.width, this.cursorY);
			stream.stroke();

		} else {

			stream.moveTo(bound.x + 3, this.cursorY);
			stream.lineTo(bound.x + bound.width - 3, this.cursorY);
			stream.stroke();

		}

		this.cursorY -= 2.5;

	}

	drawParagraph(paragraph) {

		const stream = this.context.currentStream;
		const bound = this.options.bound;


		while (paragraph.length > 0) {

			if (paragraph[0].y <= bound.y)
				return paragraph;

			const word = paragraph.shift();

			stream.fillText(getBuffer(word.content), word.x, word.y, word.fontSize, fonts[word.type]);

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
			let skip = false;

			for (let i = 0; i < line.length; i++) {

				let columnWidth = bound.width * sizes[i];
				let p = Paragraph.Create(x + bound.width * dx[i], y, line[i], columnWidth, space, fontSize);

				if (p.length == 0) continue;

				let y0 = p[0].y;

				for (let w of p) {
					if (w.y != y0) {
						skip = true;
						break;
					}
				}

				this.drawParagraph(p);

			}

		}

		// this.cursorY += 1;

		return output;

	}

}
