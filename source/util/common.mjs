
//import { PDFFont } from "../PDFLibrary/index.mjs";
import { PDFFont } from "../PDFLibrary.mjs";

///
const fonts = {
	NORMAL: new PDFFont( 'Helvetica' ),
	BOLD: new PDFFont( 'Helvetica-Bold' ),
	ITALIC: new PDFFont( 'Helvetica-Oblique' ),
	BOLD_ITALIC: new PDFFont( 'Helvetica-BoldOblique' )
};


/** 
 *	
 */
function getBuffer( input ) {
	
	let output = new Array();
	
	if( !(typeof input == 'string') )
		input = input.toString();
	
	for( let e of input ) 
		output.push( e.charCodeAt() );
	
	return output;

}
	


///
const measureText = (function() {
	
	let canvas = document.createElement('canvas');
	let context = canvas.getContext('2d');
	
	return function( text, font ) {
		
		if( font ) context.font = font;
		
		return context.measureText( text );
		
	}
	
}).call();

///
export { measureText, getBuffer, fonts }
