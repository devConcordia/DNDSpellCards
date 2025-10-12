
/** 
 *	
 *	@ref https://github.com/devConcordia/pdf-javascript
 *	
 */

///
const VOID = '';
const LF = String.fromCharCode( 0x0A );
const CR = String.fromCharCode( 0x0D );
const SP = String.fromCharCode( 0x20 );
const CRLF = CR + LF;

///
let UID_COUNT = 0;

/** getUID( type )
 *
 *	@param {String} type
 *	@return {String}
 */
function getUID( type ) {
	
	return (type.slice(3,5) + (UID_COUNT++).toString(16).toUpperCase());

}

/** toPostScript
 *	
 *	@param {*} input
 *	@return {String}
 */
function toPostScript( input ) {
	
	if( input === undefined ) return VOID;
	if( input === null ) return "null";
	
	/// if is an instance of a any basic PDF object
//	if( (/^PDF/).test( input.constructor.name ) ) {
	if( input instanceof PDFDictionary ) {
		
		return input.getObjectR();
		
	} else if( input instanceof Array ) {
		
		return arrayToPostScript( input );
		
	} else if( typeof input == "object" ) {
		
		return objectToPostScript( input );
		
	} else {
		
		switch( typeof input ) {
			
			case 'number':
					return input.toString();
				
			case 'boolean':
					return ( input === true )? 'true' : 'false';
				
			case 'string':
					
					let e = input.charAt(0);
					
					if( e != '<' && e != '(' )
						return (input === '')? '' : '/'+ input;
					
					return input;
			
		}
		
	}
	
	return VOID
	
}

/** arrayToPostScript
 *	
 *	@param {Array} input
 *	@return {String}
 */
function arrayToPostScript( input ) {
	
	let output = [];
	
	for( let value of input ) {
		
		if( value === undefined ) continue;
		
		output.push( toPostScript( value ) );
		
	}
	
	return "["+ output.join( SP ) +"]"
	
}

/** objectToPostScript
 *
 *	@param {Object} object
 *	@return {String}
 */
function objectToPostScript( object ) {

	let output = [];

	for( let key in object ) {
		
		let value = object[ key ];
		
		if( value === undefined ) continue;
		
		output.push( '/' + key + SP + toPostScript( value ) );
	
	}


	return "<<"+ output.join(SP) +">>"

}

/** PDFObject
 *	
 *	@param {*} primitive	Number | Boolean | String | Array | Object
 */
function PDFObject( primitive ) {
	
	return class PDFObject extends primitive {
		
		#name = null;
		#objectNumber = 0;
		#generationNumber = 0;
	
		constructor() {
			
			super( ...arguments );
			
			this.#name = getUID( this.constructor.name );
			
		}
		
		getObjectHeader() {
			
			return this.#objectNumber + SP + this.#generationNumber + SP + 'obj'

		}

		getObjectName() {
			
			return this.#name

		}
		
		getObjectR() {
			
			return this.#objectNumber + SP + this.#generationNumber + SP + 'R'

		}
		
		setObjectR( objectNumber, generationNumber = 0 ) {
			
			this.#objectNumber = objectNumber;
			this.#generationNumber = generationNumber;
			
		}
	
	}
	
}

/** PDFDictionary
 *	
 *	@ref 7.3.7 Dictionary Objects
 *	
 */
export class PDFDictionary extends PDFObject(Object) {
	
	constructor( object ) {
		
		super();
		
		if( typeof object == "object" )
			Object.assign(this, object);
		
	}
	
	toString() {
		
		return this.getObjectHeader() + CRLF + objectToPostScript( this ) + CRLF +'endobj'
		
	}
	
}

/** PDFArray
 *		
 *	@ref 7.3.6 Array Objects
 *	
 */
export class PDFArray extends PDFObject(Array) {
	
	toString() {
		
		return this.getObjectHeader() + CRLF + arrayToPostScript( this ) + CRLF +'endobj'
		
	}
	
}

///
const decoder = new TextDecoder();

/** PDFStream
 *
 */
export class PDFStream extends PDFDictionary {
	
	#data = '';
	
	constructor( data = '', object ) {

		super( object );
		
		this.#data = data;
		
		if( !('Length' in this) )
			this.Length = 0;
		
	}
	
	get stream() {
		
		return this.#data;
		
	}

	set stream( values ) {
		
		this.#data = values;
		
	}

	toString() {
		
		let stream = this.#data;
		
		if( stream instanceof Uint8Array )
			stream = decoder.decode( stream );
		
		this.Length = stream.length;
		
		return this.getObjectHeader() + CRLF + objectToPostScript( this ) + CRLF + 
				'stream'+ CRLF + stream + CRLF +'endstream'+ CRLF +'endobj';
		
	}
	
}

/** PDFString
 *	
 *	@ref 7.3.4 String Objects
 *	
 *		7.3.4.2 Literal Strings
 *		7.3.4.3 Hexadecimal Strings
 *	
 */
export class PDFString extends PDFObject(String) {
	
	toString() {
		
		return this.getObjectHeader() + CRLF +"/"+ this.valueOf() + CRLF +'endobj'
		
	}
	
	static HexadecimalEncode( input, fill = '00' ) {
		
		var output = '',
			length = fill.length;
		
		if( !(typeof input == 'string') )
			input = input.toString();
		
		for( var e of input ) output += ( fill + e.charCodeAt().toString( 16 ) ).slice( -length );
		
		return output;

	}
	
	static HexadecimalDecode( input ) {

		if( !(typeof input == 'string') )
			input = input.toString();
		
		input = input.replace( /[<>]/g, '' );
		
		var output = '';
		
		for( var i = 0; i < input.length; i += 2 ) {
			
			var code = input.charAt( i ) + input.charAt( i+1 );
			
			output += String.fromCharCode( parseInt( code, 16 ) );
			
		}
		
		return output;
		
	}
	
}

/**	PDFAction
 *
 *	Table 198 - Subtype
 *		Launch		Launch an application, usually to open a file.
 *		Thread		Begin reading an article thread.
 *		URI			Resolve a uniform resource identifier.
 *		Sound		(PDF 1.2) Play a sound.
 *		Movie		(PDF 1.2) Play a movie.
 *		Hide		(PDF 1.2) Set an annotation’s Hidden flag.
 *		Named		(PDF 1.2) Execute an action predefined by the conforming reader.
 *		SubmitForm	(PDF 1.2) Send data to a uniform resource locator.
 *		ResetForm	(PDF 1.2) Set fields to their default values.
 *		ImportData	(PDF 1.2) Import field values from a file.
 *		JavaScript	(PDF 1.3) Execute a JavaScript script.
 *		SetOCGState	(PDF 1.5) Set the states of optional content groups.
 *		Rendition	(PDF 1.5) Controls the playing of multimedia content.
 *		Trans		(PDF 1.5) Updates the display of a document, using a transition dictionary.
 *		GoTo3DView	(PDF 1.6) Set the current view of a 3D annotation
 *	
 */
export class PDFAction extends PDFDictionary {

	/** constructor
	 *
	 * 	@param {String} data
	 *	@param {String} subtype
	 */
	constructor( data, subtype ) {

		super();

		this.Type = 'Action';
		this.S = subtype;

		switch( subtype ) {

			case PDFAction.JS:

					this.JS = '<' + PDFString.HexadecimalEncode( data ) + '>';

				break;

			case PDFAction.URI:

					this.URI = '('+ data +')';

				break;
		}

	}

	static URI = 'URI';

	static JS = 'JavaScript';

}

/** PDFAnnot
 *	
 *	Subtypes:
 *
 *		Text			Caret				Underline
 *		Link            Ink                 Squiggly 
 *		FreeText        Popup               StrikeOut
 *		Line            FileAttachment      Stamp
 *		Square          Sound				TrapNet
 *		Circle          Movie               Watermark
 *		Polygon         Widget              3D
 *		PolyLine        Screen              Redact
 *		Highlight       PrinterMark
 *	
 *	@param (PDFAction) action
 *	@param (String) subtype
 *	@param (Number) x, y, w, h
 */
export class PDFAnnot extends PDFDictionary {

	static LINK = 'Link';
	
	constructor( action, subtype, x, y, w, h ) {
		
		super();
		
		this.Type = 'Annot';
		
		this.Rect = [ x, y, (x + w), (y + h) ];
		
		this.Border = [ 0, 0, 0 ];
		
		this.A = action;
		
		this.Subtype = subtype;
		
	}
	
}

/** Catalog
 *
 */
export class PDFCatalog extends PDFDictionary {
	
	constructor() {
		
		super();
		
		this.Type = 'Catalog';
		this.Pages = undefined;
		
	}
	
}

/** PDFFont
 *	
 *	Base:
 *		Helvetica
 *		Helvetica-Bold
 *		Helvetica-Oblique
 *		Helvetica-BoldOblique
 *		Times-Roman
 *		Times-Bold
 *		Times-Italic
 *		Times-BoldItalic
 *		Courier
 *		Courier-Bold
 *		Courier-Oblique
 *		Courier-BoldOblique
 *		Symbol
 *	
 */
export class PDFFont extends PDFDictionary {
	
	/** constructor
	 *	
	 *	@param {String} base
	 *	@param {String} subtype
	 *	@param {String} encode
	 */
	constructor( base = 'Helvetica', subtype = 'Type1', encode = 'WinAnsiEncoding' ) {
		
		super();
		
		this.Type = 'Font';
		this.Subtype = subtype;
		this.BaseFont = base;
		
		if( typeof encode == 'string' )
			this.Encoding = encode;
		
	}
	
}

/** PDFXObject
 *
 */
export class PDFXObject extends PDFStream {
	
	constructor() {
		
		super();
		
		this.Type = 'XObject';
		this.Name = this.getObjectName();
		
	}
	
}

var imageCanvas = document.createElement('canvas'),
	imageContext = imageCanvas.getContext('2d');

/** image_get_jpeg_base64
 *
 *	@param {HTMLImageElmenet} image
 *	@return {String}
 */
function image_get_jpeg_base64( image ) {

	var w = image.naturalWidth,
		h = image.naturalHeight;

	imageCanvas.width = w;
	imageCanvas.height = h;

	imageContext.fillStyle = '#ffffff';
	imageContext.fillRect( 0, 0, w, h );

	imageContext.drawImage( image, 0, 0, w, h );

	return imageCanvas.toDataURL( 'image/jpeg' )

}

/** image_get_jpeg_stats
 *
 *		device === 1		DeviceGray
 *		device === 3		DeviceRGB
 *		device === 4		DeviceCMYK
 *
 *	@param {String} data		atob( <string>.replace( /data\:image\/jpeg;base64,/, '' ) )
 *	@return {Object}
 */
function image_get_jpeg_stats( data ) {

	var i = 4,
		width = 0,
		height = 0,
		device = 0,
		bits = 0,
		block = data.charCodeAt( 4 ) * 256 + data.charCodeAt( 5 );

	while( i < data.length ) {

		i += block;

		if( data.charCodeAt( i+1 ) === 0xc0 ) {

			height = data.charCodeAt( i+5 ) * 256 + data.charCodeAt( i+6 );
			width = data.charCodeAt( i+7 ) * 256 + data.charCodeAt( i+8 );

			bits = data.charCodeAt( i+4 );	/// BitsPerComponent???
			device = data.charCodeAt( i+9 );

			break;

		} else {

			i += 2;
			block = data.charCodeAt( i ) * 256 + data.charCodeAt( i+1 );

		}
	}

	return { width, height, bits, device }

}

/** image_create_jpeg
 *
 *	@param {String} color
 *	@return {String}
 */
function image_create_jpeg( color = '#000' ) {

	imageCanvas.width = 1;
	imageCanvas.height = 1;

	imageContext.fillStyle = color;
	imageContext.fillRect( 0, 0, 1, 1 );

	return imageCanvas.toDataURL( 'image/jpeg' )

}


/** PDFImage
 *
 *	@ref https://blog.idrsolutions.com/2010/04/understanding-the-pdf-file-format-how-are-images-stored/
 *	
 *	@param {String} image
 *	@param {Number} width, height
 */
export class PDFImage extends PDFXObject {
	
	constructor( image, width = 0, height = 0 ) {
		
		if( width == 0 && height == 0 ) {

			var istats = image_get_jpeg_stats( image );

			width = istats.width;
			height = istats.height;

		}

		super();

		this.Subtype = 'Image';
		this.Filter = 'DCTDecode';
		this.ColorSpace = 'DeviceRGB';
		this.BitsPerComponent = 8;

		this.Width = width;
		this.Height = height;

		this.stream = image;
		
	}
	
	/**
	 *
	 *	@param {Image | HTMLCanvasElement | String} image
	 */
	static From( image ) {

		var width = 0,
			height = 0;

		if( image instanceof HTMLElement ) {

			if( image instanceof HTMLCanvasElement ) {

				width = image.width;
				height = image.height;

				image = image.toDataURL( 'image/jpeg' );

			} else if( image instanceof HTMLImageElement || image instanceof Image ) {

				width = image.naturalWidth;
				height = image.naturalHeight;

				if( image.complete ) {

					image = image_get_jpeg_base64( image );

				} else {

					console.warn('PDFImage: @param \'image\' wasn\'t loaded', image);

					image = image_create_jpeg();

				}

			}

		}

		if( !(/data\:image\/jpeg/.test( image )) ) {

			console.warn('PDFImage: @param \'image\' isn\'t JPEG', image);

			image = image_create_jpeg();

		}

		image = image.replace( /data\:image\/jpeg;base64,/, '' );
		image = window.atob( image );

		return new PDFImage( image, width, height );

	}

}

/** PDFResources
 *	
 */
export class PDFResources extends PDFDictionary {
	
	/**	add
	 *
	 *	@param {PDFColorSpace} arguments
	 *		or {PDFImage} arguments
	 *		or {PDFState} arguments
	 *		or {PDFFont} arguments
	 */
	add() {
		
		for( let object of arguments ) {

			let name = object.getObjectName();
				
			switch( object.constructor.name ) {
				
				case PDFColorSpace.name:
						
						if( !('ColorSpace' in this) )
							this.ColorSpace = new Object;
						
						this.ColorSpace[ name ] = object;
					
					break;
				
				case PDFImage.name:
				
						if( !('XObject' in this) )
							this.XObject = new Object;
						
						this.XObject[ name ] = object;
				
					break;
				
				case PDFExtGState.name:
					
						if( !('ExtGState' in this) )
							this.ExtGState = new Object;
						
						this.ExtGState[ name ] = object;
					
					break;
				
				case PDFFont.name:
				
						if( !('Font' in this) )
							this.Font = new Object;
						
						this.Font[ name ] = object;
						
					break;
				
				default: 
						console.log( object );
						throw 'PDFResources.add: @param can\'t add to resources';
				
			}

		}
		
	}
	
}

/** PDFPage
 *	
 *	
 */
export class PDFPage extends PDFDictionary {
	
	constructor( w = 210, h = 297, x = 0, y = 0 ) {
		
		super();
		
		this.Type = 'Page';
		this.Parent = undefined;
		this.Contents = new Array();
		
		this.Annots = new Array();
		
	//	var viewport = [ x * MM, y * MM, w * MM, h * MM ];
		var viewport = [ x, y, w, h ];
		
		this.MediaBox = viewport;
		this.CropBox = viewport;
		this.TrimBox = viewport;
		
		// 
		
	}
	
	/**	append
	 *
	 *	@param (PDFStream) arguments
	 *		or (PDFAnnotation) arguments
	 */
	append() {
		
		for( var object of arguments ) {

			switch( object.constructor.name ) {
				
				case PDFStream.name:
						
						this.Contents.push( object );
						
						if( object.using ) this.use( ...Object.values( object.using ) );
						
					break;
				
				case PDFAnnot.name:
						
						this.Annots.push( object );
						
					break;
				
				default:
				
						console.warn( 'PDFPage.append: @param is\'t PDFStream or PDFAnnot', object );
				
					break;
				
			}
		
		}

	}
	
	/**	use
	 *
	 *	@param (PDFColorSpace) arguments
	 *		or (PDFImage) arguments
	 *		or (PDFState) arguments
	 *		or (PDFFont) arguments
	 */
	use() {

		if( !('Resources' in this) ) this.Resources = new PDFResources();
		
		this.Resources.add( ...arguments );
		
	}
	
	/** setViewport
	 *	
	 */
	setViewport( w, h, x = 0, y = 0 ) {
		
		var viewport = [ x, y, w, h ];
		
		this.MediaBox = viewport;
		this.CropBox = viewport;
		this.TrimBox = viewport;
		
	}
	
}

/** PDFState
 *
 */
export class PDFExtGState extends PDFDictionary {
	
	constructor() {
		
		super();
		
		this.Type = 'ExtGState';
		
	}
	
}

/** PDFColorSpace
 *
 */
export default class PDFColorSpace extends PDFArray {}

/** PDFPages
 *
 */
export class PDFPages extends PDFDictionary {

	constructor() {

		super();

		this.Type = 'Pages';
		this.Kids = new Array();
		this.Count = 0;

	}

	/**	append
	 *
	 *	@param {PDFPage} 
	 */
	append() {

		for( var object of arguments ) {

			if( object instanceof PDFPage ) {

				this.Count = this.Kids.push( object );

				object.Parent = this;

			} else {

				console.warn( 'PDFPages.append: @param is\'t a PDFPage', object );

			}

		}

	}

}

/** PDFTrailer
 *	
 */
export class PDFTrailer {

	constructor( data ) {
		
		this.Root = undefined;
		this.Size = 1;
		
		for( let key in data ) 
			this[key] = data[key];
		
	}
	
	toString() {
		
		return 'trailer'+ CRLF + objectToPostScript( this ) + CRLF
		
	}

}

/**	PDFDocument
 *
 *	@param {String}	name
 *	@param {Number} version
 */
export class PDFDocument {
	
	#name = 'pdf-document';
	#version = '1.6';
	
	#blob = null;
	#url = null;
	
	#cache = null;
	
	constructor( name = 'pdf-document', version = '1.6' ) {
		
		this.#name = name;
		this.#version = version;
		
		///
		this.trailer = new PDFTrailer();
		
	}
	
	get Pages() {
		
		if( this.trailer )
			return this.trailer.Root.Pages;
		
		return null;
		
	}
	
	get blob() {
		
		return this.#blob || this.createBlob()
		
	}

	get URL() {
		
		if( this.#url == null )
			this.createBlob();

		return this.#url

	}

	updateXRef() {
		
		let i = 1;
		
		for( let key in this ) {
			
			if( key != 'trailer' )
				this[ key ].setObjectR( i++, 0 );
		
		}
		
	}
	
	/**	attach
	 *
	 *	@param {PDFDictionary} arguments
	 */
	attach() {

		for( let object of arguments ) {
			
			if( object instanceof PDFDictionary || object instanceof PDFArray ) {

				let name = object.getObjectName();

				if( object instanceof PDFPage ) this.Pages.append( object );

				if( this[ name ] === undefined )
					this[ name ] = object;
				
				/// procura por child objects
				/// e attach caso não existam nesse contexto
				attach_object( this, object );

			} else {

				console.warn( 'PDFDocument.attach: @param is\'t a PDFDictionary', object );

			}

		}

	}

	/**	open
	 *
	 *	@param {Number} width
	 *	@param {Number} height
	 *	@return {Window}
	 */
	open( width = 420, height = 594 ) {

		var x = (innerWidth - width)/2,
			y = (innerHeight - height)/2;

		return window.open( this.URL, '_blank', 'width='+ width +',height='+ height +',top='+ y +',left='+ x );

	}

	/**	open
	 *
	 *	@param {HTMLElement} parentNode
	 *	@param {Number} width
	 *	@param {Number} height
	 *	@param {Object} data				Optional
	 *	@return {HTMLElementIframe}
	 */
	preview( parentNode, w, h, data ) {

		let string = '';

		if( data ) {

			string += '#';

			for( let key in data ) 
				string += ((string == '')? '' : '&') + key +'='+ data[ key ];

		}
		
		let iframe = document.createElement( 'iframe' );
			iframe.src = this.URL + string;
			iframe.width = w || parentNode.clientWidth;
			iframe.height = h || parentNode.clientHeight;
			iframe.style.border = 'none';

		if( parentNode instanceof HTMLElement )
			parentNode.appendChild( iframe );

		return iframe

	}

	/**	open
	 *
	 *	@param {String} filename		Optional
	 */
	download( filename = this.name ) {

		let link = document.createElement('a');

		document.body.appendChild( link );

		link.download = filename + '.pdf';
		link.href = this.URL;
		link.click();
		link.remove();

	}

	/** createBlob
	 *
	 * 	@ref https://stackoverflow.com/questions/32510273/javascript-blob-encoding-as-utf-8-instead-of-ansi
	 *
	 *	@return {Blob}
	 */
	createBlob() {

		if( this.#url != null )
			URL.revokeObjectURL( this.#url );

		let blob = new Blob([ this.toBuffer() ], { type:'application/pdf' });
		
		this.#blob = blob;
		this.#url = URL.createObjectURL( blob );

		return blob;

	}

	toDataURL() {
		
		return 'data:application/pdf;base64,'+ btoa(this.toString());
		
	}
	
	/** toBuffer
	 *	
	 *	@return {Uint8Array}
	 */
	toBuffer() {
		
		let source = this.toString(),
			length = source.length,
			buffer = new Uint8Array( length );
	
		for( let i = 0; i < length; i++ )
			buffer[ i ] = source.charCodeAt( i );
		
		return buffer
		
	}
	
	/** toString
	 *
	 *	@return {String}
	 */
	toString( force = false ) {

		if( force || this.#cache != null ) return this.#cache;

		let output = '%PDF-' + this.#version + CRLF;
		//	output += "%âãÏÓ" + CRLF;
		//	output += "\u0025\u00e2\u00e3\u00cf\u00d3" + CRLF;
		
		
		///
		this.updateXRef();
		
		///
		this.trailer.Size = Object.keys( this ).length + 1;
		
		for( let key in this ) {
			if( key != 'trailer' )
				output += this[ key ].toString() + CRLF;
		}
		
		/// cross-reference table - xref
		output += 'xref'+ CRLF
				+'0'+ SP + this.trailer.Size + CRLF
				+'0000000000 65535 f'+ CRLF;

		for( let key in this ) {

			if( key == 'trailer' ) continue;
				
			let offset = output.indexOf( this[ key ].getObjectHeader() );

			output += ( '0000000000'+ offset ).slice( -10 ) +' 00000 n'+ CRLF;

		}

		output += this.trailer.toString();
		
		return output +'startxref'+ CRLF + output.indexOf( 'xref' ) + CRLF +'%%EOF';

	}
	
}


/** attach_array
 *
 *	@param {PDFDocument} target
 *	@param {Array} array
 */
function attach_array( target, array ) {

	for( let item of array ) {

		if( item instanceof PDFDictionary || item instanceof PDFArray ) {

			if( target[ item.getObjectName() ] === undefined ) {

				target.attach( item );

			}

		} else if( typeof value == 'object' ) {

			attach_object( target, value );

		}

	}

}
/** attach_object
 *
 *	@param {PDFDocument} target
 *	@param {Object} object
 */
function attach_object( target, object ) {

	for( let key in object ) {

		if( object.hasOwnProperty( key ) === false ) continue;

		let value = object[ key ];

		if( value instanceof PDFDictionary || value instanceof PDFArray ) {
		
			if( target[ value.getObjectName() ] === undefined ) {

				target.attach( value );

			}

		} else if( Array.isArray( value ) ) {

			attach_array( target, value );

		} else if( typeof value == 'object' ) {

			attach_object( target, value );

		}

	}

}

/** CMap
 *	
 *	9.7.6.2 CMap Mapping (p. 288)
 *	
 *	
 *	A sequence of one or more bytes shall be extracted from the string and matched against the codespace ranges
 *	in the CMap. That is, the first byte shall be matched against 1-byte codespace ranges; if no match is found, a
 *	second byte shall be extracted, and the 2-byte code shall be matched against 2-byte codespace ranges. This
 *	process continues for successively longer codes until a match is found or all codespace ranges have been
 *	tested. There will be at most one match because codespace ranges shall not overlap. 
 *
 *
 *
 *	The code extracted from the string shall be looked up in the
 *	character code mappings for codes of that length (These are
 * 	the mappings defined by beginbfchar, endbfchar, begincidchar, 
 *	endcidchar, and corresponding operators for ranges.).
 *	Failing that, it shall be looked up in the notdef mappings, 
 *	as described in the next subclause. 
 *	
 *	The beginbfchar and endbfchar shall not appear in a CMap 
 *	that is used as the Encoding entry of a Type 0 font; 
 *	however, they may appear in the definition of a ToUnicode CMap.
 *	
 *	
 */
class CMap {
	
	/** 
	 *	
	 *	beginbfchar, endbfchar, 
	 *	begincidchar, endcidchar
	 *	
	 *	
	 */
	constructor( input ) {
		
		this.range = getRanges( input );
		
		this.unicodes = getTables( input );
		
	}
	
	decode( input ) {
		
		let output = [];
		
		for( let code of input ) {
			
			output.push( this.unicodes.get( code ) );
			
		}
		
		return output;
		
	}
	
	encode( input ) {
		
		throw new Error("CMap.encode: not impletede yet");
		
	/*	let output = [];
		
		for( let code in input ) {
			
			output.push( this.unicodes.get( code ) );
			
		}
		
		return output;
	/**/
	
	}
	
}

/*
function fromHex( input ) {
	
	return input.split(' ').map(function() {
		return parseInt( e.replace(/[\<\>]/, ''), 16 );
	});
	
}
/**/

//	1 begincodespacerange
//	<00> <FF>
//	endcodespacerange
	
//	4 begincodespacerange
//	<00> <80>
//	<8140> <9FFC>
//	<A0> <DF>
//	<E040> <FCFC>
//	endcodespacerange
	
function getRanges( input ) {
	
	let output = new Map();
	
	let i = 0;
	
	while( i < input.length ) {
		
		let a = input.indexOf('begincodespacerange', i);
		
		if( a == -1 ) break;
		
		let b = input.indexOf('endcodespacerange', a);
		
		if( b == -1 ) break;
		
		let lines = input.substring( a, b ).split('\n');
		
		for( let line of lines ) {
			
			let [ code, value ] = line.split(/\s/).map(function(e) {
				return parseInt( e.replace(/[\<\>]/, ''), 16 );
			});
			
			output.set( code, value );
			
		}
		
		i = b + 18;
		
	}
	
	return output;
	
}


// 88 beginbfchar
// <01> <0020>
// <02> <0043>
// ...
// <56> <0028>
// <57> <0029>
// <58> <00C0>
// endbfchar


/// 100 begincidrange
/// <20> <7D> 231
/// ...
/// <81C8> <81CE> 749
/// ...
/// <FB40> <FB7E> 8518
/// <FB80> <FBFC> 8581
/// <FC40> <FC4B> 8706
/// endcidrange

function getTables( input ) {
	
	let output = new Map();
	
	let i = 0;
	
	while( i < input.length ) {
		
		let a = input.indexOf('beginbfchar', i);
		
		if( a == -1 ) break;
		
		let b = input.indexOf('endbfchar', a);
		
		if( b == -1 ) break;
		
		let lines = input.substring( a, b ).split('\n');
		
		for( let line of lines ) {
			
			let [ code, value ] = line.split(/\s/).map(function(e) {
				return parseInt( e.replace(/[\<\>]/, ''), 16 );
			});
			
			output.set( code, value );
			
		}
		
		
		i = b + 18;
		
	}
	
	i = 0;
	
	while( i < input.length ) {
		
		let a = input.indexOf('begincidchar', i);
		
		if( a == -1 ) break;
		
		let b = input.indexOf('endcidchar', a);
		
		if( b == -1 ) break;
		
		let lines = input.substring( a, b ).split('\n');
		
		for( let line of lines ) {
			
			let [ code, value, id ] = line.split(/\s/).map(function(e) {
				
				if( e.charAt(0) == '<' ) {
					
					return parseInt( e.replace(/[\<\>]/, ''), 16 );
					
				} else {
					
					return parseInt( e );
					
				}
				
			});
			
			output.set( code, value );
			
		}
		
		i = b + 18;
		
	}
	
	return output;
	
}



/* 

/CIDInit/ProcSet findresource begin
12 dict begin
begincmap
/CIDSystemInfo<<
/Registry (Adobe)
/Ordering (UCS)
/Supplement 0
>> def
/CMapName/Adobe-Identity-UCS def
/CMapType 2 def
1 begincodespacerange
<00> <FF>
endcodespacerange
88 beginbfchar
<01> <0020>
<02> <0043>
<03> <0061>
<04> <0073>
<05> <0056>
<06> <0065>
<07> <006C>
<08> <0068>
<09> <0054>
<0A> <0078>
<0B> <0074>
<0C> <006F>
<0D> <002D>
<0E> <0066>
<0F> <006E>
<10> <003A>
<11> <004F>
<12> <0062>
<13> <0072>
<14> <006D>
<15> <0070>
<16> <002C>
<17> <004D>
<18> <0063>
<19> <0064>
<1A> <0041>
<1B> <0069>
<1C> <0076>
<1D> <002E>
<1E> <0049>
<1F> <004E>
<20> <0067>
<21> <0075>
<22> <0052>
<23> <004A>
<24> <0031>
<25> <0039>
<26> <0034>
<27> <0050>
<28> <0045>
<29> <00E7>
<2A> <00E3>
<2B> <0035>
<2C> <002F>
<2D> <0030>
<2E> <0038>
<2F> <0032>
<30> <0036>
<31> <00CD>
<32> <0055>
<33> <004C>
<34> <0053>
<35> <0044>
<36> <0071>
<37> <00E1>
<38> <00F4>
<39> <2014>
<3A> <006A>
<3B> <00EA>
<3C> <0033>
<3D> <00ED>
<3E> <00F3>
<3F> <00E9>
<40> <00F5>
<41> <00FA>
<42> <0047>
<43> <007A>
<44> <0046>
<45> <003B>
<46> <003F>
<47> <00C9>
<48> <00660069>
<49> <00E0>
<4A> <00E2>
<4B> <00FC>
<4C> <0051>
<4D> <00AA>
<4E> <0066006C>
<4F> <0037>
<50> <0021>
<51> <0022>
<52> <0048>
<53> <0042>
<54> <0058>
<55> <2019>
<56> <0028>
<57> <0029>
<58> <00C0>
endbfchar
endcmap
CMapName currentdict /CMap defineresource pop
end
end

*/

let FLOAT_PRECISION$1 = 4;

/** precision
 *	
 */
function precision$1( n ) { 
	
	return n.toFixed( FLOAT_PRECISION$1 );

}

/** parser
 *
 *	@param {Number} n
 *	@param {Number} max = 255
 *	@return {Number}
 */
function parser( n, max = 255 ) {

	if( Number.isInteger( n ) && n > 1 ) n /= max;

	return precision$1( Math.max( 0, Math.min( n, 1 ) ) )

}

/** Color
 *	
 */
class Color extends Float32Array {
	
	/** constructor
	 *
	 *	@param {Number} bytes	0xrrggbb
	 *	or
	 *	@param {Number} r
	 *	@param {Number} g
	 *	@param {Number} b
	 */
	constructor( r, g, b ) {

		if( arguments.length < 3 ) {
			
			let n = arguments[0] || 0;
			
			r = ( n >> 16 ) & 255;
			g = ( n >>  8 ) & 255;
			b = n & 255;
			
		}

		r = parser( r );
		g = parser( g );
		b = parser( b );

		super([ r, g, b ]);

	}

	get r() { return this[ 0 ] }
	get g() { return this[ 1 ] }
	get b() { return this[ 2 ] }

	set r( v ) { this[ 0 ] = parser( v ); }
	set g( v ) { this[ 1 ] = parser( v ); }
	set b( v ) { this[ 2 ] = parser( v ); }
	
	get hex() {
		
		let [ r, g, b ] = this;
		
		r = Math.floor(r*256);
		g = Math.floor(g*256);
		b = Math.floor(b*256);
		
		return b | g << 8 | r << 16;
		
	}

	get cmyk() {
		
		let [ r, g, b ] = this;
		
		let c = 0, 
			m = 0, 
			y = 0,
			k = 1 - Math.max( r, g, b );

		if( k != 1 ) {
			
			c = ( 1-r-k )/( 1-k );
			m = ( 1-g-k )/( 1-k );
			y = ( 1-b-k )/( 1-k );

		}

		return [ c, m, y, k ].map( precision$1 );

	}
	
	toString() {
		
		return '#'+ ('000000' + this.hex).slice( -6 ).toUpperCase()
		
	}
	
}

const DEG_TO_RAD = Math.PI/180;

let FLOAT_PRECISION = 4;

/** precision
 *	
 */
function precision( n ) { 
	
	return n.toFixed( FLOAT_PRECISION );

}


/** Path2D
 *
 */
class Path2D extends Array {
	
	static set PRECISION( v ) { 
		
		PRECISION = v;
	
	}
	
	constructor() {
		
		super();
		
		this.using = new Object;
		
	}
	
	///
	
	/** save
	 *
	 *	@return {Path2D} this
	 */
	save() {

		this.push('q');

		return this;

	}
	
	/** restore
	 *
	 *	@return {Path2D} this
	 */
	restore() {

		this.push('Q');

		return this;

	}
	
	do( object ) {
		
		var name = object.getObjectName();
		
		this.push( '/'+ name + SP +'Do' );

	}
	
	/// Matrix Transform
	
	transform( data, x, y ) {
		
		let d = '';
		
		for( let n of data ) 
			d += precision( parseFloat(n) ) + SP;
		
		this.push( d + SP + precision( x ) + SP + precision( y ) + SP + 'cm' );
		
		return this;

	}
	
	/** translate
	 *	
	 *	@param {Number} x, y
	 *	@return {Path2D} this
	 */
	translate( x, y = x ) {

		return this.transform([ 1, 0, 0, 1 ], x, y );

	}

	/** rotate
	 *	
	 *	@param {Number} angle
	 *	@return {Path2D} this
	 */
	rotate( angle = 0 ) {
		
		let c = Math.cos( angle ),
			s = Math.sin( angle );

		return this.transform([ c, -s, s, c ], 0, 0 );

	}

	/** scale
	 *	
	 *	@param {Number} sx, sy
	 *	@return {Path2D} this
	 */
	scale( sx, sy = sx ) {

		return this.transform([ sx, 0, 0, sy ], 0, 0 );

	}
	
	/** skew
	 *	
	 *	@param {Number} ax, ay
	 *	@return {Path2D} this
	 */
	skew( ax, ay ) {

		this.push( path2d_transform([ 1, ax, ay, 1 ], 0, 0 ) );

		return this;

	}
	
	/// colors
	
	/** strokeColor
	 *
	 *	@param {PDFColorSpace | TypedArray} color
	 *	@return {Path2D} this
	 */
	strokeColor( color ) {

		if( color.constructor.name == PDFColorSpace.name ) {

			let name = color.getObjectName();
		
			this.push( '/' + name + SP + 'CS 1.0000 SCN' );
			
			if( !(name in this.using) ) this.using[ name ] = color;
			
		} else {

			switch( color.length ) {

				case 3:
						this.push( color.join( SP ) + SP + 'RG' );
					break;

				case 4:
						this.push( color.join( SP ) + SP + 'K' );
					break;

				default:
						console.warn('PDFStream.strokeColor: @param \'color\' is incompatible', color);
					break;
			}

		}

		return this;

	}
	
	/** fillColor
	 *
	 *	@param {PDFColorSpace | Array} color
	 *	@return {Path2D} this
	 */
	fillColor( color ) {

		if( color.constructor.name == PDFColorSpace.name ) {

			var name = color.getObjectName();

			this.push( '/' + name + SP + 'cs 1.0000 scn' );

			if( !(name in this.using) ) this.using[ name ] = color;

		} else {

			switch( color.length ) {

				case 3:
						this.push( color.join( SP ) + SP + 'rg' );
					break;

				case 4:
						this.push( color.join( SP ) + SP + 'k' );
					break;

				default:
						console.warn('PDFStream.fillColor: @param \'color\' is incompatible', color);
					break;
			}

		}

		return this;

	}
	
	/** lineWidth
	 *	
	 *	@param {Number} w
	 *	@return {Path2D} this
	 */
	lineWidth( w ) {

		this.push( precision( w ) + SP + 'w' );

		return this;

	}
	
	/** miter
	 *	
	 *	@param {Number} w
	 *	@return {Path2D} this
	 */
	miter( w ) {

		this.push( w + SP +'M' );

		return this;

	}
	
	/** lineDashPattern
	 *	
	 *	@param {Array} array
	 *	@param {Number} phase
	 *	@return {Path2D} this
	 */
	lineDashPattern( data, phase = 0 ) {
		
		let d = '';
	
		for( let n of data ) 
			d += precision( n ) + SP;
		
		this.push('['+ d +']'+ SP + precision( phase ) + SP +'d');

		return this;

	}
	
	///
	
	/** stroke
	 *	
	 *	S false
	 *	s true
	 *	
	 *	@param {Boolean} closed
	 *	@return {Path2D} this
	 */
	stroke( closed = false ) {

		this.push( (closed == true)? 's' : 'S' );

		return this;

	}
	
	/** fill
	 *
	 *	@param {Boolean} rule
	 *	@return {Path2D} this
	 */
	fill( rule = false ) {

		this.push( 'f'+ (rule == true? '*' : '') );

		return this;

	}
	
	/** both
	 *
	 *	@param {Boolean} closed, rule
	 *	@return {Path2D} this
	 */
	both( closed = false, rule = false ) {

		this.push( ((closed == true)? 'b' : 'B') + (rule == true? '*' : '') );

		return this;

	}
	
	/** 
	 *	
	 */
	clip( rule = false ) {
		
		this.push( rule? 'W*' : 'W' );

		return this;

	}
	
	///
	
	/** moveTo
	 *
	 *	@param {Number} x, y
	 *	@return {Path2D} this
	 */
	moveTo( x, y ) {

		this.push( precision( x ) + SP + precision( y ) + SP + 'm' );

		return this;

	}

	/** lineTo
	 *
	 *	@param {Number} x, y
	 *	@return {Path2D} this
	 */
	lineTo( x, y ) {

		this.push( precision( x ) + SP + precision( y ) + SP + 'l' );

		return this;

	}

	/** close
	 *
	 *	@param {Number} x, y
	 *	@return {Path2D} this
	 */
	close( x, y ) {

		this.push( 'h' );

		return this;

	}

	/** rect
	 *
	 *	@param {Number} x, y, w, h, rh, rv, points
	 *	@return {Path2D} this
	 */
	rect( x, y, w, h ) {

		this.push( 
			precision( x ) + SP +
			precision( y ) + SP +
			precision( w ) + SP +
			precision( h ) + SP + 're' );

		return this;

	}

	/** curve
	 *
	 *	@param {Number} ax, ay, bx, by, cx, cy
	 *	@return {Path2D} this
	 */
	curve( ax, ay, bx, by, cx, cy ) {

		this.push( precision( ax ) + SP + precision( ay ) + SP +
			precision( bx ) + SP + precision( by ) + SP +
			precision( cx ) + SP + precision( cy ) + SP + 'c' );

		return this;

	}
	
	/** circle
	 *
	 *	@param {Number} x, y, radius, points
	 *	@return {Path2D} this
	 */
	circle( px, py, radius, points = 36 ) {
		
		this.ellipse( px, py, radius, radius, points );
		
		return this;

	}
	
	/** ellipse
	 *	
	 *	@param {Number} x, y, rv, rh, points
	 *	@return {Path2D} this
	 */
	ellipse( px, py, rh, rv = rh, points = 36 ) {

		let step = Math.floor( 360 / points );
		
		this.moveTo( px + rh * Math.cos(0), py + rv * Math.sin(0) );
		
		for( let i = step; i < 360; i += step ) {
			
			let n = i * DEG_TO_RAD;
			
			this.lineTo( px + rh * Math.cos(n), py + rv * Math.sin(n) );
		
		}
		
		return this;

	}

	/** polygon
	 *
	 *	@param {Array} nodes [[x, y], [x, y], [ax,ay,bx,by,cx,cy],... ]
	 *	@return {Path2D} this
	 */
	polygon( input ) {
		
		this.moveTo( ...input[0] );
		
		///
		for( let i = 1; i < input.length; i++ ) {
			
			let e = input[i];
			
			if( e.length == 2 ) {
				
				this.lineTo( ...e );
				
			} else if( e.length == 6 ) {
				
				this.curve( ...e );
				
			} else {
				
				console.warn( 'Path2D.polygon: bad data', input );
				
			}
			
		}

		return this;

	}

	///

	/** fillText
	 *
	 *	@param {String} content
	 *	@param {Number} x
	 *	@param {Number} y
	 *	@param {Number} size
	 *	@param {PDFFont} font
	 *	@param {Object} options
	 *	@return {Path2D} this
	 */
	fillText( content, x, y, size, font, options = null ) {
		
		let name = font.getObjectName();
		
		if( !(name in this.using) ) 
			this.using[ name ] = font;
		
		
		let output = 'BT'+ CRLF;
			output += '/'+ font.getObjectName() + SP + precision( size ) + SP +'Tf'+ CRLF;
			output += precision( x ) + SP + precision( y ) + SP +'Td'+ CRLF;
			
		for( let key in options )
			output += options[ key ] + SP + key + CRLF;	
		
		///
		if( typeof content == 'string' ) {
			
			content = '('+ content +')';
			
		} else {
			
			content = '<'+ Array.from(content).map(e=>e.toString(16).padStart(2, '0')).join('') +'>';
			
		}
		
		this.push( output + content + SP +'Tj'+ CRLF +'ET');
		
		return this;
		
	}
	
	/** strokeText
	 *
	 *	@param {String} content
	 *	@param {Number} x
	 *	@param {Number} y
	 *	@param {Number} size
	 *	@param {PDFFont} font
	 *	@param {Object} options
	 *	@return {Path2D} this
	 */
	strokeText( content, x, y, size, font, options = null ) {
		
		let name = font.getObjectName();
		
		if( !(name in this.using) ) 
			this.using[ name ] = font;
		
		if( !options.hasOwnProperty('Tr') ) 
			options.Tr = 1;
		
		let output = 'BT'+ CRLF;
			output += '/'+ font.getObjectName() + SP + precision( size ) + SP +'Tf'+ CRLF;
			output += precision( x ) + SP + precision( y ) + SP +'Td'+ CRLF;
			
		for( let key in options )
			output += options[ key ] + SP + key + CRLF;	
		
		///
		if( typeof content == 'string' ) {
			
			content = '('+ content +')';
			
		} else {
			
			content = '<'+ Array.from(content).map(e=>e.toString(16).padStart(2, '0')).join('') +'>';
			
		}
		
		this.push( output + content + SP +'Tj'+ CRLF +'ET');
		
		return this;

	}
	
	///
	
	/** drawImage
	 *
	 *  @param {PDFImage} object
	 *  @param {Number} x, y, w, h, r
	 *	@return {Path2D} this
	 */
	drawImage( object, x, y, w, h, r = 0 ) {

		this.push( 'q' );

		this.translate( x, y );
		
		if( r != 0 ) 
			this.rotate( r );
		
		this.scale( w, h );
		
		let name = object.getObjectName();
		
		if( !(name in this.using) ) 
			this.using[ name ] = object;
		
		this.push( '/'+ name + SP +'Do' );
		this.push( 'Q' );

		return this;

	}

	toString() {
		
		let output = '';
		
		for( let line of this ) 
			output += line + CRLF;
		
		return output;
		
	}
	
}

/** PDFNumber
 *	
 *	@ref 7.3.3 Numeric Objects
 *	
 */
export class PDFNumber extends PDFObject(Number) {

	toString() {
		
		return this.getObjectHeader() + CRLF + this.valueOf() + CRLF +'endobj'
		
	}
	
}

/** isNumeric
 *	
 *	@ref https://stackoverflow.com/questions/175739/how-can-i-check-if-a-string-is-a-valid-number
 *	
 *	@param {String} input
 */
function isNumeric( input ) {
	
	if( typeof input != "string" ) return false;
	
	return !isNaN( input ) && !isNaN( parseFloat(input) )
	
}


function parseDictionary( input ) {
	
	input = input.replace(/\\\r/gm, " ");
	input = input.replace(/\\\r\n/gm, " ");
	input = input.replace(/\r\n|\n/gm, " ");
	input = input.replace( /^\d+\s\d+\sobj/g, "" );
	input = input.replace( /endobj$/g, "" );
	
	input = input.replace( /\//g, " /" );
	
//	input = input.replace( /\(/g, " (" );
//	input = input.replace( /\)/g, ") " );
	
	input = input.replace( /\<\>/g, "< >" );
	input = input.replace( /\>\</g, "> <" );
	
	input = input.replace( /\<\<\<\</g, " << <<" );
	input = input.replace( /\>\>\>\>/g, ">> >> " );
	
	input = input.replace( /\<\<\</g, " << <" );
	input = input.replace( /\>\>\>/g, "> >> " );
	
	input = input.replace( /\<\</g, " << " );
	input = input.replace( /\>\>/g, " >> " );
	
	input = input.replace( /\[/g, " [ " );
	input = input.replace( /\]/g, " ] " );
	
	input = input.replace(/\s+/gm, " ");
	
	input = input.replace(/\d+\s\d+\sR/gm, function(e) { return e.replace(/\s/gm, "_") });
				
	return input.trim();
	
}


function splitDictionary( input ) {
	
	let output = [];
	let current = "";
	
	let i = 0;
	
	while( i < input.length ) {
		
		let c0 = input.charAt(i);
		
		if( c0 == " " ) {
			
			output.push( current );
			current = "";
			
		} else if( c0 == "(" ) {
			
			output.push( current );
			
			current = c0;
			
			let j = i+1;
			
			while(true) {
				
				let c1 = input.charAt(j);
				
				current += c1;
				
				if( c1 == ")" && (input.charAt(j-1) != "\\") ) break;
				
				j++;
				
			}
			
			i = j+1;
			
			current = current.replace(/\s+\//gm, "/");
			
			output.push( current );
			current = "";
			
		} else {
			
			current += c0;
			
		}
		
		i++;
		
	}
	
	if( current != "" )
		output.push( current );
	
	return output;
	
}


function readUntil( input, charEnd ) {
	
	let output = [];
	
	while( input.length > 0 ) {
		
		let target = input.shift();
		
		if( target == charEnd ) {
			
			return output;
			
		} else {
			
			if( target == "[" ) {
				
				output.push( readUntil( input, "]" ) );
				
			} else if( target == "<<" ) {
				
				let data = readUntil( input, ">>" );
				
				let object = new Object;
				
				for( let i = 0; i < data.length; i+=2 )
					object[ data[i] ] = data[i+1];
				
				output.push( object );
				
			} else {
				
				if( target.charAt(0) == "/" ) {
					
					target = target.replace(/^\//, "");
					
				} else if( isNumeric(target) ) {
					
					target = parseFloat( target );
					
				} else if( target == "null" ) {
					
					target = null;
					
				}
				
				output.push( target );
				
			}
			
		}
		
	}
	
	return output[0];
	
}

function read( input ) {
	
	let data = splitDictionary( input );
	
	if( data[0] == "<<" ) {
		
		return readUntil( data, ">>" );
		
	} else if( data[0] == "[" ) {
		
		return readUntil( data, "]" );
		
	} else {
		
	//	console.log( input )
		
		return input;
		
	}
	
}

function replaceId( index, object ) {
	
	for( let key in object ) {
		
		let value = object[ key ];
		
		if( typeof value == "object" ) {
			
			replaceId( index, value );
			
		} else {
		
			if( (/^\d+\_\d+\_R$/).test( value ) ) {
				
				let id = value.replace(/\_/g, " ").replace(/R$/, "obj");
				
			//	console.log( id );
				
				object[ key ] = index[ id ];
				
			}
		
		}
		
	}
	
}


//new TextDecoder();

function ReadObjects( text, buffer ) {
	
	/// 
	let objects = new Object;
	
	text.match(/^\d+\s\d+\sobj/gm).forEach(function(e) {
		
		let i = text.indexOf( "\r\n"+ e );
		
		let CRLF_SIZE = 2;
		
		/// caso não seja crlf
		if( i == -1 ) {
			
			CRLF_SIZE = 1;
			i = text.indexOf( "\n"+ e ) + 1;
		
		} else {
			
			i += 2;
			
		}
		
		let j = text.indexOf( "endobj", i );
		
		let content = text.slice( i, j+6 );
		
		let n = content.indexOf( "stream" );
		
		if( n != -1 ) {
			
			let m = content.indexOf( "endstream", n );
			
			let data = parseDictionary( content.slice( 0, n ) );
				data = read( data );
			
			/// Há casos que pode ser somente LF(1)
			/// stream(6) + CRLF(2)
			/// CRLF(2) + endstream(9)
		//	let stream = buffer.slice( i + (n+6+CRLF_SIZE), i + (m - CRLF_SIZE) + 1 );
			let stream = buffer.slice( i + (n+6+CRLF_SIZE), i + (m - CRLF_SIZE) );
			
		//	console.log( stream.length, content.slice( n+8, m-2 ).length )
			
		//	console.log( decoder.decode(stream) )
		//	console.log( data )
			
			objects[ e ] = new PDFStream( stream, data );
			
		} else {
			
			content = parseDictionary( content );
			content = read( content );
			
			if( Array.isArray(content) ) {
				
				objects[ e ] = new PDFArray( content );
				
			} else if( typeof content == 'object' ) {
				
				objects[ e ] = new PDFDictionary( content );
				
			} else {
				
			//	console.log( content )
				
				if( /\d+/.test(content) ) {
					
					objects[ e ] = new PDFNumber( content );
					
				} else {
					
					objects[ e ] = new PDFString( content );
					
				}
				
			//	console.log( objects[ e ] )
			//	console.log( objects[ e ].toString() )
				
			}
			
		}
		
	});
	
//	console.log( objects );
	
	let trailer_i = text.indexOf( "trailer" ) + 7;
	let startxref_i = text.indexOf( "startxref" );
	
//	let trailer_i = text.lastIndexOf( "trailer" ) + 7;
//	let startxref_i = text.lastIndexOf( "startxref" );
	
	let trailer = parseDictionary( text.slice( trailer_i, startxref_i ) );
		trailer = new PDFTrailer( read( trailer ) );
	
	replaceId( objects, trailer );
	
	for( let key in objects ) {
		
		let [ on, gn, s ] = key.split(' ');
		
		let obj = objects[key];
			obj.setObjectR( on, gn );
		
		replaceId( objects, obj );
	
	}
	
	return { objects, trailer };
	
}

export class PDF {
	
	static Fonts = {
		HELVETICA: new PDFFont( 'Helvetica' ),
		TIMES: new PDFFont( 'Times-Roman' ),
		COURIER: new PDFFont( 'Courier' )
	};
	
	static CMap = CMap;
	static Color = Color;
	static Path2D = Path2D;
	
	static Create() {
		
		let doc = new PDFDocument();
			doc.trailer.Root = new PDFCatalog();
			doc.trailer.Root.Pages = new PDFPages();
		
		doc.attach( doc.trailer.Root );
		
		return doc;
		
	}
	
	/** 
	 *	
	 */
	static Load( input ) {
		
		if( !(input instanceof ArrayBuffer) )
			throw "PDF.Load: @param \'input\' isn\'t a {ArrayBuffer}";
		
		let buffer = new Uint8Array( input );
		let text = "";
		
		for( let i = 0; i < buffer.length; i++ )
			text += String.fromCharCode( buffer[i] );
		
		///
		let { objects, trailer } = ReadObjects( text, buffer );
		
		///
		let doc = new PDFDocument();
			doc.trailer = trailer;
		
		doc.attach( doc.trailer.Root );
		
		for( let key in objects )
			doc.attach( objects[key] );
		
		return doc;
	
	}
	
}
