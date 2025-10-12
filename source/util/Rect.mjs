/** Rect
 *	
 *	@param {Number} x, y, w, h
 */
export default class Rect extends Int16Array {
		
	constructor( x, y, w, h ) {
		
		super([ x, y, w, h ]);
		
	}
	
	get x() { return this[0] }
	get y() { return this[1] }
	
	get width() { return this[2] }
	get height() { return this[3] }
	
	set x( n ) { this[0] = n }
	set y( n ) { this[1] = n }
	
	set width( n ) { this[2] = n }
	set height( n ) { this[3] = n }
	
	toJSON() {
		
		return Array.from( this )
		
	}
	
}
