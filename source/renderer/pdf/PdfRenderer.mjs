import { RendererOptions } from "../RendererOptions.mjs";
import { RendererContext } from "../RendererContext.mjs";
import { SpellCard } from "../../card/SpellCard.mjs";
import { measureText } from "../common/measureText.mjs";
import { Paragraph } from "../common/Paragraph.mjs";

import { PDF } from "./PDFLibrary.mjs";

import { fonts, getBuffer } from "./utils.mjs";
import {STATBLOCK_FEATURES} from "../common/constants.mjs";


export class PdfRenderer {

	constructor(options) {

		this.options = new RendererOptions(options);
		this.context = new RendererContext();

		this.cursorY = 0;

	}

	clearContext() {

		this.context = new RendererContext();

	}

	getRemaingSpace() {

		return this.cursorY / this.options.bound.height;

	}

	/**
	 *
	 * @param {SpellCard} card
	 * @return {PDF.Path2D[]}
	 */
	render( card ) {

		this.startNewCard(card);

		this.renderDetails(card);
		this.renderContent(card);
		this.renderReferences(card);
		this.renderStatblock(card) ;
		this.renderPageNumerator();

		return this.context.streams;

	}

	resetCardContext() {

		this.context.append(new PDF.Path2D());

		const bound = this.options.bound;

		this.cursorY = bound.height + bound.y - 3;

	}

	startNewCard(card) {

		this.resetCardContext();

		this.renderLayout();
		this.renderTitle( card.name );
		this.renderSubtitle( card.level +' - '+ card.type );

		if (this.context.streams.length == 1)
			this.renderFooter( card.classes.join(' | ') );

	}

	renderBreakLine( value = 1 ) {

		this.cursorY -= value;

	}

	renderLayout() {

		const stream = this.context.currentStream;
		const bound = this.options.bound;

		let w = this.options.width,
			h = this.options.height;

		let p = 2.5;
		let q = 1.5;
		let t = 6;

		stream.moveTo( 0, 0 );
		stream.lineTo( w, 0 );
		stream.lineTo( w, h );
		stream.lineTo( 0, h );
		stream.stroke( true );

		stream.moveTo( p, p );
		stream.lineTo( w-p, p );
		stream.lineTo( w-p, h-p );
		stream.lineTo( p, h-p );
		stream.stroke( true );

		stream.moveTo( t, q );
		stream.lineTo( w-t, q );
		stream.lineTo( w-q, t );
		stream.lineTo( w-q, h-t );
		stream.lineTo( w-t, h-q );
		stream.lineTo( t, h-q );
		stream.lineTo( q, h-t );
		stream.lineTo( q, t );
		stream.stroke( true );

		///
		stream.moveTo( bound.x + 3, bound.y + bound.height );
		stream.lineTo( bound.x + bound.width - 3, bound.y + bound.height );
		stream.stroke();

		stream.moveTo( bound.x, bound.y );
		stream.lineTo( bound.x + bound.width, bound.y );
		stream.stroke();

	}

	renderTitle( text ) {

		const stream = this.context.currentStream;
		const bound = this.options.bound;

		let tw = measureText( text, '30px Arial' ).width/10;

		let fontSize = ( tw >= (bound.width-4) )? 2.5 : 3;

		stream.fillText( getBuffer(text), 6, 78.5, fontSize, fonts.BOLD );

	}

	renderSubtitle( text ) {

		const stream = this.context.currentStream;
		const bound = this.options.bound;

		let tw = measureText( text, '20px Arial' ).width/10;

		let fontSize = ( tw >= (bound.width-8) )? 2 : 2.5;

		stream.fillText( getBuffer(text), 6, 75, fontSize, fonts.ITALIC );

	}

	renderFooter( text ) {

		const stream = this.context.currentStream;
		const bound = this.options.bound;

		let tw = measureText( text, '20px Arial' ).width/10;

		let fontSize = ( tw >= (bound.width-8) )? 1.5 : 2;

		stream.fillText( getBuffer(text), 6, 4, fontSize, fonts.NORMAL );

	}

	renderPageNumerator() {

		const bound = this.options.bound;
		const streams = this.context.streams;

		for( let i = 0; i < streams.length; i++ ) {

			const stream = this.context.streams[i];
			const text = (i+1) +'/'+ streams.length;

			stream.fillText( getBuffer(text), bound.width+3, 4, 2, fonts.BOLD );

		}

	}

	renderLine( full = false ) {

		const stream = this.context.currentStream;
		const bound = this.options.bound;

		if( full ) {

			stream.moveTo( bound.x,             this.cursorY );
			stream.lineTo( bound.x + bound.width, this.cursorY );
			stream.stroke();

		} else {

			stream.moveTo( bound.x + 3,             this.cursorY );
			stream.lineTo( bound.x + bound.width - 3, this.cursorY );
			stream.stroke();

		}

		this.cursorY -= 2.5;

	}

	/**
	 * @param {Paragraph} paragraph
	 */
	renderParagraph( paragraph ) {

		const stream = this.context.currentStream;
		const bound = this.options.bound;

		while (paragraph.length > 0) {

			if (paragraph[0].y <= (bound.y+1))
				return paragraph;

			const word = paragraph.shift();

			stream.fillText( getBuffer(word.content), word.x, word.y, word.fontSize, fonts[ word.type ]);

			if (paragraph.length == 0)
				this.cursorY = word.y - word.fontSize * 1.75;

		}

		return null;

	}

	renderTable( data, sizes, fontSize = 2, space = .75 ) {

		// const stream = this.context.currentStream;
		const bound = this.options.bound;

		let x = bound.x,
			y = this.cursorY;

		let output = [];

		let dx = [ 0 ];

		for( let x of sizes )
			dx.push( dx.at(-1) + x );

		///
		for( let line of data ) {

			let outLine = [];
			let y = this.cursorY;

			let skip = false;

			for( let i = 0; i < line.length; i++ ) {

				let item = line[i];

				let columnWidth = bound.width * sizes[i];

				let p = Paragraph.Create( x + bound.width * dx[i], y, line[i], columnWidth, space, fontSize );

				if( p.length == 0 ) continue;

				let y0 = p[0].y;

				for( let w of p ) {
					if( w.y != y0 ) {
						skip = true;
						break;
					}
				}

				this.renderParagraph( p );
			}
		}

		///
		this.cursorY += 1;

		return output;

	}

	/* ... */

	renderDetails(card) {

		this.renderTable([
			[ "**Casting Time**", card.casting ],
			[ "**Range**", card.range ],
			[ "**Components**", card.components ],
			[ "**Duration**", card.duration ]
		], [ .35, .65 ] );

		this.renderLine(true);

	}

	renderContent(spell) {

		const {bound,fontSize, space} = this.options;

		for( const text of spell.content ) {

			const paragraph = Paragraph.Create( bound.x, this.cursorY, text, bound.width, space, fontSize );

			const remeaing = this.renderParagraph( paragraph );

			if( remeaing ) {
				this.startNewCard(spell);
				this.renderBreakLine( 2 );
				remeaing.translate( 0, bound.height - 4 );
				this.renderParagraph( remeaing );
			}

		}

	}

	renderReferences(spell) {

		if (!Array.isArray(spell.tables))
			return;

		const {bound,fontSize, space} = this.options;

		for( const tb of spell.tables ) {

			if( this.getRemaingSpace() < .5 )
				this.startNewCard(spell);

			this.renderBreakLine( 1 );

			if( tb.title ) {
				const paragraph = Paragraph.Create( bound.x, this.cursorY, '**'+ tb.title +'**', bound.width, space, fontSize + .5 );

				this.renderParagraph( paragraph );
				this.renderBreakLine( -2.5 );
				this.renderLine(true);
			}

			this.renderTable( tb.header.map(e=>e.map(t=>'**'+t+'**')), tb.sizes );
			this.renderBreakLine( -1 );
			this.renderLine(true);
			this.renderTable( tb.body, tb.sizes );
			this.renderBreakLine( 2 );

		}

	}

	/* ... */

	renderStatblock(card) {

		const statblock = card.statblock;

		if( !card.statblock ) return;

		this.startNewStatblockCard(card, statblock);
		this.renderStatblockDetails( statblock );
		this.renderAddons( statblock );
		this.renderFeatures(card, statblock);

	}

	startNewStatblockCard(card, statblock) {

		this.resetCardContext();

		this.renderLayout();
		this.renderTitle( statblock.title );
		this.renderSubtitle( statblock.subtitle );

		this.renderFooter( card.name +' | '+ card.level +' - '+ card.type );

	}

	renderStatblockDetails( statblock ) {

		this.renderTable([
			[ "**AC**", statblock.AC ],
			[ "**HP**", statblock.HP ],
			[ "**Speed**", statblock.Speed ]
		], [ .25, .75 ], 2, .75 );

		// this.renderBreakLine( 1 );
		this.renderLine(true);

		let { STR,DEX,CON,INT,WIS,CHA } = statblock.attributes;

		this.renderTable([
			[ '', '', 'MOD', 'SAVE', '', '', 'MOD', 'SAVE' ],
			[ '**STR**', ...STR, '**DEX**', ...DEX ],
			[ '**CON**', ...CON, '**INT**', ...INT ],
			[ '**WIS**', ...WIS, '**CHA**', ...CHA ]
		], new Float32Array(8).fill(0.125), 1.75, 0 );

		// this.renderBreakLine( 1 );
		this.renderLine(true);

	}

	renderAddons(statblock) {

		const tbaddons = [];

		for( let k in statblock.addons )
			tbaddons.push([ '**'+ k +'**', statblock.addons[k] ]);

		this.renderTable( tbaddons, [ .28, .72 ], 2 );

	}

	renderFeatures(card, statblock) {

		const { bound, fontSize, space } = this.options;

		for( const key of STATBLOCK_FEATURES ) {

			if( !(key in statblock) )
				continue;

			if( this.getRemaingSpace() < .35 ) {

				this.startNewStatblockCard(card, statblock);

			} else {

				this.renderLine(true);

			}

			this.renderBreakLine( 1 );

			const paragraph = Paragraph.Create( bound.x, this.cursorY, '**'+ key +'**', bound.width, space, fontSize + .5 );

			this.renderParagraph( paragraph );


			let content = statblock[key];

			for (const text of content) {

				const paragraph = Paragraph.Create( bound.x, this.cursorY, text, bound.width, space, fontSize );

				const remeaing = this.renderParagraph( paragraph );

				if( remeaing ) {

					this.startNewStatblockCard(card, statblock);

					remeaing.translate( 0, bound.height - 3 );

					this.renderParagraph( remeaing );

				}

			}

		}

	}

}
