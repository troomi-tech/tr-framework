import { CSSProperties } from 'react';

type ChosenCSSProperties = Pick<
	CSSProperties,
	| 'display'
	| 'overflow'
	| 'textOverflow'
	| 'overflowWrap'
	| 'visibility'
	| 'whiteSpace'
	| 'borderColor'
	| 'justifyContent'
	| 'flexDirection'
	| 'alignContent'
	| 'alignItems'
	| 'flexWrap'
	| 'order'
	| 'flex'
	| 'flexGrow'
	| 'flexShrink'
	| 'alignSelf'
	| 'textAlign'
	| 'placeContent'
	| 'gridTemplateColumns'
	| 'gridTemplateRows'
	| 'gridTemplate'
	| 'color'
	| 'backgroundColor'
	| 'position'
	| 'cursor'
>;

type CSSPropertyOrNumberInPixels<T extends keyof CSSProperties> = CSSProperties[T] | number;
type SpacingBorder = number | CSSProperties['border'] | SpacingBorderObject;
type SpacingBorderObject = {
	/** The width of the border. @default '4px' */
	width?: CSSPropertyOrNumberInPixels<'borderWidth'>;
	/** The style of the border. @default 'solid' */
	style?: CSSProperties['borderStyle'];
	/** The color of the border. @default 'black' */
	color?: CSSProperties['borderColor'];
};

interface CustomCSSProperties {
	/* ~~~~ Margin ~~~~ */
	marginX?: CSSPropertyOrNumberInPixels<'marginLeft' | 'marginRight'>;
	marginY?: CSSPropertyOrNumberInPixels<'marginTop' | 'marginBottom'>;
	/* ~~~~ Padding ~~~~ */
	paddingX?: CSSPropertyOrNumberInPixels<'paddingLeft' | 'paddingRight'>;
	paddingY?: CSSPropertyOrNumberInPixels<'paddingTop' | 'paddingBottom'>;
	/* ~~~~ Cursor ~~~~ */
	cursorPointer?: boolean;
}

interface BorderProperties {
	border?: SpacingBorder;
	borderTop?: SpacingBorder;
	borderLeft?: SpacingBorder;
	borderRight?: SpacingBorder;
	borderBottom?: SpacingBorder;
}

interface PixelBasedSpacingProps extends CustomCSSProperties {
	/* ~~~~ Margin ~~~~ */
	margin?: CSSPropertyOrNumberInPixels<'margin'>;
	marginTop?: CSSPropertyOrNumberInPixels<'marginTop'>;
	marginLeft?: CSSPropertyOrNumberInPixels<'marginLeft'>;
	marginRight?: CSSPropertyOrNumberInPixels<'marginRight'>;
	marginBottom?: CSSPropertyOrNumberInPixels<'marginBottom'>;
	/* ~~~~ Padding ~~~~ */
	padding?: CSSPropertyOrNumberInPixels<'padding'>;
	paddingTop?: CSSPropertyOrNumberInPixels<'paddingTop'>;
	paddingLeft?: CSSPropertyOrNumberInPixels<'paddingLeft'>;
	paddingRight?: CSSPropertyOrNumberInPixels<'paddingRight'>;
	paddingBottom?: CSSPropertyOrNumberInPixels<'paddingBottom'>;
	/* ~~~~ Border ~~~~ */
	borderRadius?: CSSPropertyOrNumberInPixels<'borderRadius'>;
	/* ~~~~ Flex ~~~~ */
	gap?: CSSPropertyOrNumberInPixels<'gap'>;
	/* ~~~~ Demensions ~~~~ */
	width?: CSSPropertyOrNumberInPixels<'width'>;
	height?: CSSPropertyOrNumberInPixels<'height'>;
	minWidth?: CSSPropertyOrNumberInPixels<'minWidth'>;
	maxWidth?: CSSPropertyOrNumberInPixels<'maxWidth'>;
	minHeight?: CSSPropertyOrNumberInPixels<'minHeight'>;
	maxHeight?: CSSPropertyOrNumberInPixels<'maxHeight'>;
	/* ~~~~ Position ~~~~ */
	top?: CSSPropertyOrNumberInPixels<'top'>;
	left?: CSSPropertyOrNumberInPixels<'left'>;
	right?: CSSPropertyOrNumberInPixels<'right'>;
	bottom?: CSSPropertyOrNumberInPixels<'bottom'>;
}

interface SpacingAliases {
	/* ~~~~ `margin` aliases ~~~~ */
	m?: PixelBasedSpacingProps['margin'];
	mt?: PixelBasedSpacingProps['marginTop'];
	mr?: PixelBasedSpacingProps['marginRight'];
	mb?: PixelBasedSpacingProps['marginBottom'];
	ml?: PixelBasedSpacingProps['marginLeft'];
	mx?: PixelBasedSpacingProps['marginX'];
	my?: PixelBasedSpacingProps['marginY'];
	/* ~~~~ `padding` aliases ~~~~ */
	p?: PixelBasedSpacingProps['padding'];
	pt?: PixelBasedSpacingProps['paddingTop'];
	pr?: PixelBasedSpacingProps['paddingRight'];
	pb?: PixelBasedSpacingProps['paddingBottom'];
	pl?: PixelBasedSpacingProps['paddingLeft'];
	px?: PixelBasedSpacingProps['paddingX'];
	py?: PixelBasedSpacingProps['paddingY'];
}

interface LonghandSpacingProps extends PixelBasedSpacingProps, BorderProperties {}
export interface SpacingProps extends ChosenCSSProperties, LonghandSpacingProps, SpacingAliases {}

export default class SpacingUtils {
	private static aliases: { [key in keyof SpacingAliases]: keyof LonghandSpacingProps } = {
		m: 'margin',
		mt: 'marginTop',
		mr: 'marginRight',
		mb: 'marginBottom',
		ml: 'marginLeft',
		mx: 'marginX',
		my: 'marginY',
		p: 'padding',
		pt: 'paddingTop',
		pr: 'paddingRight',
		pb: 'paddingBottom',
		pl: 'paddingLeft',
		px: 'paddingX',
		py: 'paddingY'
	};
	private static customCSSKeys: (keyof CustomCSSProperties)[] = [
		'marginX',
		'marginY',
		'paddingX',
		'paddingY',
		'cursorPointer'
	];
	private static borderSpacingKeys: (keyof BorderProperties)[] = [
		'border',
		'borderTop',
		'borderLeft',
		'borderRight',
		'borderBottom'
	];
	private static pixelBasedSpacingKeys: (keyof PixelBasedSpacingProps)[] = [
		'margin',
		'marginTop',
		'marginLeft',
		'marginRight',
		'marginBottom',
		'padding',
		'paddingTop',
		'paddingLeft',
		'paddingRight',
		'paddingBottom',
		'borderRadius',
		'gap',
		'width',
		'height',
		'minWidth',
		'maxWidth',
		'minHeight',
		'maxHeight',
		'top',
		'left',
		'right',
		'bottom'
	];

	static stringOrNumberWithPixels(value: string | number): string {
		if (typeof value === 'number') return `${value}px`;
		return value;
	}

	/**
	 * Takes a spacing border value and returns the CSS border value.
	 * @param inputValue
	 */
	static getSpacingBorder(inputValue: SpacingBorder): string | undefined {
		if (typeof inputValue === 'number') return `${this.stringOrNumberWithPixels(inputValue)} solid`;
		if (typeof inputValue === 'string') return inputValue;
		if (typeof inputValue === 'object') {
			const { width = '4px', style = 'solid', color = 'black' } = inputValue;
			return `${this.stringOrNumberWithPixels(width)} ${style} ${color}`;
		}
	}

	/**
	 * Takes a object of component props and transforms any spacing props into their CSS equivalents.
	 * @param props
	 */
	static getCssProperties(props: SpacingProps): CSSProperties {
		const cssProperties: CSSProperties = {};

		Object.entries(props).forEach(([key, value]) => {
			if (key === 'children') return; // Don't add children to CSS properties in case they are include.
			if (key in this.aliases) {
				const aliasKey = this.aliases[key as keyof SpacingAliases];
				if (typeof aliasKey === 'string') key = aliasKey;
			}

			if (this.customCSSKeys.includes(key as keyof CustomCSSProperties)) {
				switch (key) {
					case 'marginX':
						cssProperties.marginLeft = this.stringOrNumberWithPixels(value);
						cssProperties.marginRight = this.stringOrNumberWithPixels(value);
						break;
					case 'marginY':
						cssProperties.marginTop = this.stringOrNumberWithPixels(value);
						cssProperties.marginBottom = this.stringOrNumberWithPixels(value);
						break;
					case 'paddingX':
						cssProperties.paddingLeft = this.stringOrNumberWithPixels(value);
						cssProperties.paddingRight = this.stringOrNumberWithPixels(value);
						break;
					case 'paddingY':
						cssProperties.paddingTop = this.stringOrNumberWithPixels(value);
						cssProperties.paddingBottom = this.stringOrNumberWithPixels(value);
						break;
					case 'cursorPointer':
						if (!!value) cssProperties.cursor = 'pointer';
						break;
				}
			} else if (this.pixelBasedSpacingKeys.includes(key as keyof PixelBasedSpacingProps))
				Object.assign(cssProperties, { [key]: this.stringOrNumberWithPixels(value) });
			else if (this.borderSpacingKeys.includes(key as keyof BorderProperties))
				Object.assign(cssProperties, { [key]: this.getSpacingBorder(value) });
			else Object.assign(cssProperties, { [key]: value });
		});

		return cssProperties;
	}
}
