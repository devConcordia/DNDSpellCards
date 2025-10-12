
import { measureText } from './common.mjs'

/** Word
 *		
 *		 TEXT 	NORMAL		
 *		#TEXT# 	BOLD 		
 *		_TEXT_ 	ITALIC		
 *		$TEXT$ 	BOLD - ITALIC
 *	
 */
export default class Word {
	
	static BOLD = 'BOLD';
	static ITALIC = 'ITALIC';
	static NORMAL = 'NORMAL';
	
	static BOLD_ITALIC = 'BOLD_ITALIC';
	
	constructor( x, y, content, type, fontSize = 2, fontFamily = 'Arial' ) {
		
		this.x = x;
		this.y = y;
		
		content = content.replace(/[\#\_]/gim, '').trim();
		content = content.replace(/[\#\_\$]/gim, '').trim();
		
		this.content = content;
		this.type = type;
		this.fontSize = fontSize;
		this.fontFamily = fontFamily;
		
		if( type != Word.NORMAL ) {
			
			this.width = measureText( content, 'bold '+ (fontSize*10) +'px '+ fontFamily ).width/10;
			
		} else {
			
			this.width = measureText( content, (fontSize*10) +'px '+ fontFamily ).width/10;
			
		}
		
	}
	
}
