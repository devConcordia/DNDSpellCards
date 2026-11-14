import { TableContent } from './contents/TableContent.mjs';

/**
 *
 */
export class SpellCard {

	name = '';
	level = '';
	type = '';
	casting = '';
	range = '';
	components = '';
	duration = '';
	classes = [];
	content = [];
	tables = null;
	statclock = null;

	constructor( data ) {

		if (data.name) this.name = data.name;
		if (data.level) this.level = data.level;
		if (data.type) this.type = data.type;
		if (data.casting) this.casting = data.casting;
		if (data.range) this.range = data.range;
		if (data.components) this.components = data.components;
		if (data.duration) this.duration = data.duration;

		if (Array.isArray(data.classes))
			this.classes = data.classes;

		if (Array.isArray(data.content))
			this.content = data.content;

		if (Array.isArray(data.tables)) {
			for (const tb of data.tables)
				this.tables.push( new TableContent(tb) );
		}

		if (data.statclock)
			this.statclock = new StatblockCard( data.statclock );

	}

	get title() { return this.name }

	get subtitle() { return this.level +' - '+ this.type }

	get footer() { return this.classes.join(' | ') }

}
