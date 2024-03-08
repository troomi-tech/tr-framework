import React, { CSSProperties } from 'react';
import * as Icomoon from '../../icomoon/types/Icomoon';

export interface IconProps {
	/* ~~~~~~ Required ~~~~~~ */

	/** The icon to use */
	iconImg: `icon-${Icomoon.GlyphNames}`;

	/* ~~~~~~ Basic ~~~~~~ */

	/** The className of the icon. Will always contain `rsIcon` */
	className?: string;
	/** The id of the icon */
	id?: string;
	/** Handler for when the icon is clicked */
	onClick?: () => void;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** The size of the icon @default 16 */
	size?: number;
	/** Whether the icon has a cursor pointer @default false */
	cursorPointer?: boolean;

	/* ~~~~~~ Styling ~~~~~~ */

	/** The color of the icon */
	color?: CSSProperties['color'];
}

const Icon: React.FC<IconProps> = (props) => {
	const { cursorPointer = false, size = 16, id, className, iconImg, color, onClick } = props;

	function getStyle() {
		const styles: CSSProperties = {};
		if (!!color) styles.color = color;
		if (!!size) styles.fontSize = `${size}px`;
		if (!!cursorPointer) styles.cursor = 'pointer';

		return styles;
	}

	function getClassName() {
		const classes = ['rsIcon', iconImg];
		if (!!className) classes.push(className);

		return classes.join(' ');
	}

	return <span id={id} className={getClassName()} style={getStyle()} onClick={onClick} />;
};

export default Icon;
