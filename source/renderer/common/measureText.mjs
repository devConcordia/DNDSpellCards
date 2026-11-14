
/**
 *
 */
export const measureText = (function() {

	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	/**
	 *	@param {string} text
	 *	@param {string} font
	 */
	return function( text, font ) {

		if( font ) context.font = font;

		return context.measureText( text );

	}

}).call();
