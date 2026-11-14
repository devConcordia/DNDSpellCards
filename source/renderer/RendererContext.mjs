
export class RendererContext {

	constructor() {

		this.streams = [];
		this.currentStream = null;

	}

	append( stream ) {

		this.streams.push( stream );
		this.currentStream = stream;

	}

}
