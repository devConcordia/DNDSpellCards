
import { PDFFont } from "./PDFLibrary.mjs";

/**
 *
 */
export const fonts = {
	NORMAL: new PDFFont( 'Helvetica' ),
	BOLD: new PDFFont( 'Helvetica-Bold' ),
	ITALIC: new PDFFont( 'Helvetica-Oblique' ),
	BOLD_ITALIC: new PDFFont( 'Helvetica-BoldOblique' )
};

/**
 *
 */
export function getBuffer( input ) {

	let output = new Array();

	if( !(typeof input == 'string') )
		input = input.toString();

	for( let e of input )
		output.push( e.charCodeAt() );

	return output;

}
