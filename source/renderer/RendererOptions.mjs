import { Rect } from './common/Rect.mjs'

export class RendererOptions {

	constructor( data ) {

		this.width = data.width || 63;
		this.height = data.height || 85;

		this.space = .75;
		this.fontSize = data.fontSize || 2;

		this.bound = new Rect( 6, 7.5, 63 - 12, 73 - 7 );

	}

}
