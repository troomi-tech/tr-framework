// Takes the icomoon.svg file and generates type definitions for the glyph names and unicodes.
import { promises as fs } from 'fs';
import * as prettier from 'prettier';
import * as path from 'path';

const INPUT_FILE_PATH = path.resolve(__dirname, '../icons/fonts/icomoon.svg');
const OUTPUT_FILE_PATH = path.resolve(__dirname, '../types/icomoon.ts');

function extractTypes(svgContent: string): {
	unicodes: string[];
	glyphNames: string[];
} {
	const regex = /<glyph\s+unicode="([^"]+)"\s+glyph-name="([^"]+)"/g;
	const glyphNames: string[] = [];
	const unicodes: string[] = [];
	let match;

	while ((match = regex.exec(svgContent))) {
		const unicode = match[1];
		const glyphName = match[2];
		glyphNames.push(glyphName);
		unicodes.push(unicode);
	}

	return {
		glyphNames,
		unicodes
	};
}

async function generateTypeDefinition(glyphNames: string[], unicodes: string[]): Promise<string> {
	const glyphNamesType = `export type GlyphNames = '${glyphNames.join("' | '")}';`;
	const unicodeTypes = `export type Unicodes = '${unicodes.join("' | '")}';`;

	let typeDefinition = `${glyphNamesType}\n\n${unicodeTypes}`;
	typeDefinition = await prettier.format(typeDefinition, { parser: 'typescript' });

	return typeDefinition;
}

async function buildIcomoonTypes(inputFilePath: string, outpuFilePath: string) {
	const svg = await fs.readFile(inputFilePath, 'utf-8');
	const { glyphNames, unicodes } = extractTypes(svg);
	const typeDefinition = await generateTypeDefinition(glyphNames, unicodes);
	await fs.writeFile(outpuFilePath, typeDefinition);
}

buildIcomoonTypes(INPUT_FILE_PATH, OUTPUT_FILE_PATH).catch(console.error);
