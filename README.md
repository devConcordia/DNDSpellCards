# DND Spell Cards

This project is a simple D&D spell card generator.
The online editor is [here](https://devconcordia.github.io/DNDSpellCards/).

> :warning: There may be some text extraction errors, so please review them before using.

## PDF Generator

The [DNDSpellCards](source/DNDSpellCards.mjs) is the main class for generating spell cards. The `spells` are an `Array` following [spell structure](#spell-structure). `nodeElement` is the target DOM element where the PDF preview (iframe) will be added.

The function returns a [PDFDocument](https://github.com/devConcordia/pdf-javascript).

```javascript

const doc = DNDSpellCards.CreatePDF( spells, nodeElement );

/// open a new window - can be block popup
doc.open();

/// download pdf file
doc.download( "file-name" );

```

## Spell Structure

The [DNDSpellCards](#pdf-generator) accepts the following spell structure:

```json
{
    "name": "...",
		"type": "...",
		"casting": "...",
		"range": "...",
		"components": "...",
		"duration": "...",
		"level": "...",
		"classes": [
			"...",
			"..."
		],
		"content": [
			"Paragraph ...",
			"Paragraph ...",
			"Paragraph ... $Bold And Italic$ ..."
		],
		"tables":  [{
			"sizes": [ 0.25, 0.75 ],
			"header": [
				[ "#title#", "#title#" ]
			],
			"body": [
				["td ...", "td ..."],
				["td ...", "td ..."],
				["td ...", "td ..."]
			]
		}],
		"statblock": {
			"title": "...",
			"subtitle": "...",
			"AC": "..",
			"HP": "...",
			"Speed": "...",
			"attributes": {
				"STR": ["0", "+0", "+0"],
				"DEX": ["0", "+0", "+0"],
				"CON": ["0", "+0", "+0"],
				"INT": ["0", "-0", "-0"],
				"WIS": ["0", "-0", "-0"],
				"CHA": ["0", "-0", "-0"]
			},
			"addons": {
				"Immunities": "...",
				"Senses": "...",
				"Languages": "...",
				"CR": "..."
			},
			"Actions": [
				"Paragraph ..."
			]
		}
```

### Supported Text Styles

| Syntax   | Style         |
|----------|---------------|
|   TEXT   | Normal        |
| \#TEXT\# | Bold          |
| \_TEXT\_ | Italic        |
| \$TEXT\$ | Bold + Italic |


## Editor Setup

The editor has been built with [Vue.js](https://vuejs.org/guide/introduction).

```sh
cd editor/
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run build
```

### Running localhost

```sh
npm run preview
```
