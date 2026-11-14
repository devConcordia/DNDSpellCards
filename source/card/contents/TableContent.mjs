
export class TableContent {

	title = '';

	// column dimensions
	sizes = [];

	header = [];
	body = [];

	constructor( data ) {

		if (data.title) this.title = data.title;
		if (data.sizes) this.sizes = data.sizes;
		if (data.header) this.header = data.header;
		if (data.body) this.body = data.body;

	}

}
