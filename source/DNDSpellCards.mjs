
import { PDF, PDFPage, PDFStream, PDFFont } from "./PDFLibrary.mjs";

import { fonts } from './util/common.mjs';

import Spell from './Spell.mjs';


/// millimiters scale
const MM = 2.8346;




/** DNDSpellCards
 *	
 */
export default class DNDSpellCards {
	
	/** CreatePDF
	 *	
	 */
	static CreatePDF( spells, parentNode ) {
		
		///
		const doc = PDF.Create();
		
		let stream;
		let index = 0;
		
		for( let spell of spells ) {
			
			///
			let cards = new Spell( spell ).getCards();
			
			for( let card of cards ) {
				
				if( index%9 == 0 ) {
					
					let page = new PDFPage( MM * 210, MM * 297 );
						page.use( fonts.NORMAL, fonts.BOLD, fonts.ITALIC, fonts.BOLD_ITALIC );
					
					stream = new PDF.Path2D();
					stream.scale( MM, MM );
					stream.lineWidth( .01 );
					
					page.append(new PDFStream( stream ));
					doc.attach( page );
					
					index = 0;
					
				}
			
				let x = index%3;
				let y = Math.floor(index/3)+1;
				
				stream.save();
				stream.translate( 8 + x + x*card.width, 297 - 8 - y - y*card.height );
				
				stream.push( ...card.stream );
				
				stream.restore();
				
				index++;
				
			}
			
		//	break;
			
		}
		
		///
		doc.preview( parentNode, 210, 297 );
		
		///
		return doc;
		
	}
	
	
}

