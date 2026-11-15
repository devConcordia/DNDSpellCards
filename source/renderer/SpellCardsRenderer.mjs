import { RendererOptions } from "./RendererOptions.mjs";
import { PdfRenderer } from "./pdf/PdfRenderer.mjs";
import { PDF, PDFPage, PDFStream } from "./pdf/PDFLibrary.mjs";
import { fonts } from "./pdf/utils.mjs";

/// millimiters scale
const MM = 2.8346;

export class SpellCardsRenderer {

	constructor(options) {

		this.options = new RendererOptions(options);

		this.pdfRenderer = new PdfRenderer(this.options);
		// this.imageRenderer = imageRenderer;

	}

	/**
	 *
	 * @param {SpellCard[]} spells
	 */
	generatePdf(spells, parentNode) {

		const options = this.options;
		// const bound = this.options.bound;

		///
		const doc = PDF.Create();

		let stream;
		let index = 0;

		for (const spell of spells) {

			this.pdfRenderer.clearContext();

			let cards = this.pdfRenderer.render( spell );

			for( const card of cards ) {

				if( index%9 == 0 ) {

					const page = new PDFPage( MM * 210, MM * 297 );

					page.use( ...Object.values(fonts) )

					stream = new PDF.Path2D();
					stream.scale( MM, MM );
					stream.lineWidth( .01 );

					page.append(new PDFStream( stream ));
					doc.attach( page );

					index = 0;

				}

				const x = index%3;
				const y = Math.floor(index/3)+1;

				stream.save();
				stream.translate(
					8 + x + x*options.width,
					297 - 8 - y - y*options.height );

				stream.push( ...card );

				stream.restore();

				index++;

			}

		//	break;

		}

		///
		if (parentNode)
			doc.preview( parentNode, 210, 297 );

		///
		return doc;

	}

}
