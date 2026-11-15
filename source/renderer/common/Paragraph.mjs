import { Word } from './Word.mjs';

const SPLITTER = /(\*\*\*[\s\S]+?\*\*\*|\*\*[\s\S]+?\*\*|\*[\s\S]+?\*)/g;

/** Paragraph
 *
 */
export class Paragraph extends Array {

	static Create(px, py, text, maxWidth, space = .75, fontSize = 2, fontFamily = 'Arial') {

		const paragraph = new Paragraph();
		const segments = String(text).split(SPLITTER);

		let x = 0;
		let y = 0;

		for (const segment of segments) {

			if (!segment) continue;

			let type = Word.NORMAL;
			let content = segment;

			if (segment.startsWith('***') && segment.endsWith('***')) {

				type = Word.BOLD_ITALIC;
				content = segment.slice(3, -3);

			} else if (segment.startsWith('**') && segment.endsWith('**')) {

				type = Word.BOLD;
				content = segment.slice(2, -2);

			} else if (segment.startsWith('*') && segment.endsWith('*')) {

				type = Word.ITALIC;
				content = segment.slice(1, -1);

			}

			for (const token of content.trim().split(/\s+/)) {

				if (!token) continue;

				const word = new Word(0, 0, token, type, fontSize, fontFamily);

				if (x > 0 && x + word.width > maxWidth) {
					x = 0;
					y -= fontSize + .15;
				}

				word.x = px + x;
				word.y = py + y;
				paragraph.push(word);

				x += word.width + space;
			}
		}

		return paragraph;

	}

	countLines() {

		if (this.length === 0)
			return 0;

		let count = 1;
		let y = this[0].y;

		for (let i = 1; i < this.length; i++) {

			if (this[i].y !== y) {
				y = this[i].y;
				count++;
			}

		}

		return count;

	}

	translate(tx, ty) {

		for (const word of this) {
			word.x += tx;
			word.y += ty;
		}

	}
}
