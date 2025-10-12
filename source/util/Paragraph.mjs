
import Word from './Word.mjs';

/** Paragraph
 *	
 */
export default class Paragraph extends Array { 

	static Create( px, py, text, maxWidth, space = .75, fontSize = 2, fontFamily = 'Arial' ) {
		
		let p = new Paragraph();
		
		let words = text.split(/\s/);
		let type = Word.NORMAL;
		
		let x = 0,
			y = 0;
		
		for( let content of words ) {
			
			if( content == '' ) continue;
			
			if( content.at(0) == '#' ) type = Word.BOLD;
			if( content.at(0) == '_' ) type = Word.ITALIC;
			if( content.at(0) == '$' ) type = Word.BOLD_ITALIC;
			
			let word = new Word( 0, 0, content, type, fontSize, fontFamily );
			
			if( (x + word.width) > maxWidth ) {
				x = 0;
				y -= fontSize + .15;
			}
			
			word.x = px + x;
			word.y = py + y;
			
			p.push( word );
			
			x += word.width + space;
			
			let last = content.at(-1);
			
			if( ['.', ',', ')'].includes( last ) ) last = content.at(-2);
			
			if( ['#', '_', '$'].includes( last ) ) type = Word.NORMAL;
			
		}
		
		return p;
		
	}
	
	countLines() {
		
		let count = 1;
		let y = this[0].y;
		
		for( let i = 1; i < this.length; i++ ) {
			if( this[i].y != y ) {
				y = this[i].y;
				count++;
			}
		}
		
		return count;
		
	}
	
	translate( tx, ty ) {
		
		for( let w of this ) {
			w.x += tx;
			w.y += ty;
		}
		
	}
	
}

