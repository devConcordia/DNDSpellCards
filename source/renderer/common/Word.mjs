import { measureText } from './measureText.mjs';

/**
 * Supported styles:
 *   TEXT       -> NORMAL
 *   **TEXT**   -> BOLD
 *   *TEXT*     -> ITALIC
 *   ***TEXT*** -> BOLD_ITALIC
 */
export class Word {

	static NORMAL = 'NORMAL';
	static BOLD = 'BOLD';
	static ITALIC = 'ITALIC';
	static BOLD_ITALIC = 'BOLD_ITALIC';

	constructor(x, y, content, type = Word.NORMAL, fontSize = 2, fontFamily = 'Arial') {

		this.x = x;
		this.y = y;
		this.content = String(content);
		this.type = type;
		this.fontSize = fontSize;
		this.fontFamily = fontFamily;

		let fontStyle = '';

		switch (type) {
			case Word.BOLD:
				fontStyle = 'bold ';
				break;
			case Word.ITALIC:
				fontStyle = 'italic ';
				break;
			case Word.BOLD_ITALIC:
				fontStyle = 'italic bold ';
				break;
		}

		const font = `${fontStyle}${parseInt(fontSize * 10)}px ${fontFamily}`;

		this.width = measureText(this.content, font).width / 10;

	}

}
