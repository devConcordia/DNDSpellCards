
import Card from './Card.mjs'

/** Spell
 *	
 *	
 */
export default class Spell {
	
	constructor( data ) {
		
		Object.assign( this, data );
		
		if( !this.fontSize ) this.fontSize = 2;
		
	}
	
	getCards() {
		
		let spell = this;
		let output = [];
		
		/// 
		/// Main
		/// 
		let card = new Card();
			card.layout();
			card.title( spell.name );
			card.subtitle( spell.level +' - '+ spell.type );
		
		output.push( card );
		
		card.table([
			[ "#Casting Time#", spell.casting ],
			[ "#Range#", spell.range ],
			[ "#Components#", spell.components ],
			[ "#Duration#", spell.duration ]
		], [ .35, .65 ] );
		
		card.line();
		
		for( let p of spell.content ) {
			
			let remeaing = card.write( p, spell.fontSize );
			
			if( remeaing ) {
				
				card = new Card();
				card.layout();
				card.title( spell.name );
				card.subtitle( spell.level +' - '+ spell.type );
				card.breakLine( 3 );
				
				remeaing.translate( 0, card.box.height - 4 );
				
				card.writeParagraphy( remeaing );
				
				output.push( card );
			}
			
		}
		
		/// 
		/// Tables
		/// 
		if( spell.tables ) {
			for( let tb of spell.tables ) {
				
				if( card.getRemaingSpace() < .5 ) {
					
					card = new Card();
					card.layout();
					card.title( spell.name );
					card.subtitle( spell.level +' - '+ spell.type );
					
					output.push( card );
					
				}
				
				card.breakLine( 1 );
				
				if( tb.title ) {
					card.write( '#'+ tb.title +'#', spell.fontSize + .5 );
					card.breakLine( -2.5 );
					card.line(true);
				}
				
				card.table( tb.header.map(e=>e.map(t=>'#'+t+'#')), tb.sizes );
				card.breakLine( -1 );
				card.line(true);
				card.table( tb.body, tb.sizes );
				card.breakLine( 2 );
				
			}
		}
		
		/// 
		/// statblock
		/// 
		if( spell.statblock ) {
			
			let statblock = spell.statblock;
			
			card = new Card();
			card.layout();
			card.title( statblock.title );
			card.subtitle( statblock.subtitle );
			card.footer( spell.name +' | '+ spell.level +' - '+ spell.type );
			
			output.push( card );
			
			card.table([
				[ "#AC#", statblock.AC ],
				[ "#HP#", statblock.HP ],
				[ "#Speed#", statblock.Speed ]
			], [ .25, .75 ], 2, .75 );
			
			card.breakLine( 1 );
			card.line(true);
			
			let { STR,DEX,CON,INT,WIS,CHA } = statblock.attributes;
			
			card.table([
				[ '', '', 'MOD', 'SAVE', '', '', 'MOD', 'SAVE' ], 
				[ '#STR#', ...STR, '#DEX#', ...DEX ], 
				[ '#CON#', ...CON, '#INT#', ...INT ],
				[ '#WIS#', ...WIS, '#CHA#', ...CHA ]
			], new Float32Array(8).fill(0.125), 1.75, 0 );
			
			card.breakLine( 1 );
			card.line(true);
			
			let tbaddons = [];
			
			for( let k in statblock.addons )
				tbaddons.push([ '#'+ k +'#', statblock.addons[k] ]);
			
			///
			card.table( tbaddons, [ .28, .72 ], 2 );
			
			
			let index = ['Traits', 'Actions', 'Bonus Actions', 'Reaction'];
			
			for( let key of index ) {
				if( !(key in statblock) ) continue;
				
				if( card.getRemaingSpace() < .35 ) {
				
					card = new Card();
					card.layout();
					card.title( statblock.title );
					card.subtitle( statblock.subtitle );
					card.footer( spell.name +' | '+ spell.level +' - '+ spell.type );
					
					output.push( card );
					
				} else {
					
					card.line(true);
					
				}
				
				card.breakLine( 1 );
				card.write( '#'+ key +'#', spell.fontSize + .5 );
				
				let content = statblock[key];
				
				for( let p of content ) {
					
					let remeaing = card.write( p, spell.fontSize );
					
					if( remeaing ) {
						
						card = new Card();
						card.layout();
						card.title( statblock.title );
						card.subtitle( statblock.subtitle );
						card.footer( spell.name +' | '+ spell.level +' - '+ spell.type );
						
						remeaing.translate( 0, card.box.height - 3 );
						
						card.writeParagraphy( remeaing );
						
						output.push( card );
					}
					
				}
				
			}
			
			
		}
		
		/// 
		/// Footer
		/// 
		for( let i = 0; i < output.length; i++ ) {
			
			if( i == 0 )
				output[i].footer( spell.classes.join(' | ') );
			
			output[i].page( (i+1) +'/'+ output.length );
		
		}
		
		return output;
		
	}
	
}
