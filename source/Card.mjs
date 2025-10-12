
//import { PDF } from "./PDFLibrary/index.mjs";
import { PDF } from "./PDFLibrary.mjs";

import Rect from './util/Rect.mjs';
import Paragraph from './util/Paragraph.mjs';
import { fonts, measureText, getBuffer } from './util/common.mjs';

/** 
 *	
 */
export default class Card {
	
	constructor() {
		
		this.width = 63;
		this.height = 85;
		
		let box = new Rect( 6, 7.5, 63 - 12, 73 - 7 );
		
		this.box = box;
		
		this.cursorY = box.height + box.y - 3;
		
		this.stream = new PDF.Path2D();
		
	}
	
	getRemaingSpace() { return this.cursorY/this.box.height }
	
	breakLine( value = 1 ) {
		
		this.cursorY -= value;
		
	}
	
	layout() {
		
		let { box, stream } = this;
		
		///
		let w = this.width,
			h = this.height;
		
		let p = 2.5;
		let q = 1.5;
		let t = 6;
		
		stream.moveTo( 0, 0 );
		stream.lineTo( w, 0 );
		stream.lineTo( w, h );
		stream.lineTo( 0, h );
		stream.stroke( true );
		
		stream.moveTo( p, p );
		stream.lineTo( w-p, p );
		stream.lineTo( w-p, h-p );
		stream.lineTo( p, h-p );
		stream.stroke( true );
		
		stream.moveTo( t, q );
		stream.lineTo( w-t, q );
		stream.lineTo( w-q, t );
		stream.lineTo( w-q, h-t );
		stream.lineTo( w-t, h-q );
		stream.lineTo( t, h-q );
		stream.lineTo( q, h-t );
		stream.lineTo( q, t );
		stream.stroke( true );
		
		///
		stream.moveTo( box.x + 3, box.y + box.height );
		stream.lineTo( box.x + box.width - 3, box.y + box.height );
		stream.stroke();
		
		stream.moveTo( box.x, box.y );
		stream.lineTo( box.x + box.width, box.y );
		stream.stroke();
		
		
	}
	
	title( text ) {
		
		let { box, stream } = this;
		
		let tw = measureText( text, '30px Arial' ).width/10;
		
		let fontSize = ( tw >= (box.width-4) )? 2.5 : 3;
		
		//stream.fillText( text, 6, 78.5, fontSize, fonts.BOLD );
		stream.fillText( getBuffer(text), 6, 78.5, fontSize, fonts.BOLD );
		
	}
	
	subtitle( text ) {
		
		let { box, stream } = this;
		
		let tw = measureText( text, '20px Arial' ).width/10;
		
		let fontSize = ( tw >= (box.width-8) )? 2 : 2.5;
		
		//stream.fillText( text, 6, 75, fontSize, fonts.ITALIC );
		stream.fillText( getBuffer(text), 6, 75, fontSize, fonts.ITALIC );
		
	}
	
	footer( text ) {
		
		let { box, stream } = this;
		
		let tw = measureText( text, '20px Arial' ).width/10;
		
		let fontSize = ( tw >= (box.width-8) )? 1.5 : 2;
		
		//stream.fillText( text, 6, 4, fontSize, fonts.NORMAL );
		stream.fillText( getBuffer(text), 6, 4, fontSize, fonts.NORMAL );
		
	}
	
	page( text ) {
		
		let { box, stream } = this;
		
		//stream.fillText( text, box.width+3, 4, 2, fonts.BOLD );
		stream.fillText( getBuffer(text), box.width+3, 4, 2, fonts.BOLD );
		
	}
	
	line( full = false ) {
		
		///
		let { box, stream } = this;
		
		if( full ) {
			
			stream.moveTo( box.x,             this.cursorY );
			stream.lineTo( box.x + box.width, this.cursorY );
			stream.stroke();
			
		} else {
						
			stream.moveTo( box.x + 3,             this.cursorY );
			stream.lineTo( box.x + box.width - 3, this.cursorY );
			stream.stroke();
			

		}
		
		this.cursorY -= 3;
		
	}
	
	
	
	write( data, fontSize = 2, space = .75 ) {
		
		let { box, stream } = this;
		
		let x = box.x,
			y = this.cursorY;
		
		let p = Paragraph.Create( x, y, data, box.width, space, fontSize );
		
		while( p.length > 0 ) {
			
			if( (p[0].y - fontSize/2) <= box.y ) return p;
			
			let w = p.shift();
			
			//stream.fillText( w.content, w.x, w.y, w.fontSize, fonts[ w.type ]);
			stream.fillText( getBuffer(w.content), w.x, w.y, w.fontSize, fonts[ w.type ]);
			
			if( p.length == 0 )
				this.cursorY = w.y - fontSize * 1.5;
			
		}
		
		return null;
		
	}
	
	writeParagraph( p ) {
		
		let { box, stream } = this;
		
		while( p.length > 0 ) {
			
			if( p[0].y <= box.y ) return p;
			
			let w = p.shift();
			
			//stream.fillText( w.content, w.x, w.y, w.fontSize, fonts[ w.type ]);
			stream.fillText( getBuffer(w.content), w.x, w.y, w.fontSize, fonts[ w.type ]);
			
			if( p.length == 0 )
				this.cursorY = w.y - w.fontSize * 1.5;
			
		}
		
		return null;
		
	}
	
	
	table( data, sizes, fontSize = 2, space = .75 ) {
		
		let { box, stream } = this;
		
		let x = box.x,
			y = this.cursorY;
		
		let output = [];
		
		let dx = [ 0 ];
		
		for( let x of sizes ) 
			dx.push( dx.at(-1) + x );
		
		
		///
		for( let line of data ) {
			
			let outLine = [];
			let y = this.cursorY;
			
			let skip = false;
			
			for( let i = 0; i < line.length; i++ ) {
				
				let item = line[i];
				
				let columnWidth = box.width * sizes[i];
				
				let p = Paragraph.Create( x + box.width * dx[i], y, line[i], columnWidth, space, fontSize );
				
				if( p.length == 0 ) continue;
				
				let y0 = p[0].y;
				
				for( let w of p ) {
					if( w.y != y0 ) {
						skip = true;
						break;
					}
				}
				
				this.writeParagraph( p );
				
			}
			
		//	if( skip )
		//		this.cursorY -= 1;
			
		}
		
		///
		this.cursorY += 1;
			
		return output;
		
	}
	
}

