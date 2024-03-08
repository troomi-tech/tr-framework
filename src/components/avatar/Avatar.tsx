import React, { useEffect, useState, CSSProperties } from 'react';
import './Avatar.scss';
import { DEFAULT_AVATAR_BLACK_CDN_URL } from '../../utils/constants';

const AVATAR_BOX_SHADOW =
	'0 1px 3px 0px rgba(0,0,0, 0.2), 0 2px 1px -1px rgba(0,0,0, 0.12), 0 1px 1px 0 rgba(0,0,0,0.14)';

export interface AvatarProps {
	/* ~~~~ Basic ~~~~ */

	/** The onClick event handler */
	onClick?: () => void;
	/** The className of the avatar. Will always contain `rsAvatar` */
	className?: string;

	/* ~~~~ Advanced ~~~~ */

	/** The name of the avatar */
	name?: string;
	/** The image url of the avatar, if not provided, the initials for name will be used */
	image?: string;
	/** The width and height of the avatar in pixels */
	widthHeight: number;
	/** Whether or not to show a box shadow  @default false */
	enableBoxShadow?: boolean;

	/* ~~~~ Styling ~~~~ */

	/** The color for the name text */
	textColor?: CSSProperties['color'];
	/** The background color of the avatar */
	backgroundColor?: CSSProperties['backgroundColor'];
}

const Avatar: React.FC<AvatarProps> = (props) => {
	const { enableBoxShadow = false, name, image, className, widthHeight, textColor, backgroundColor, onClick } = props;

	const [avatarImage, setAvatarImage] = useState(image);

	useEffect(() => {
		setAvatarImage(image);
	}, [image]);

	function getStyle() {
		const styles: CSSProperties = {};
		if (!!widthHeight) styles.height = `${widthHeight}px`;
		if (!!widthHeight) styles.width = `${widthHeight}px`;
		if (!!widthHeight) styles.fontSize = `calc(${widthHeight}px * .50)`;
		if (!!textColor) styles.color = textColor;
		if (!!backgroundColor) styles.backgroundColor = backgroundColor;
		if (!!enableBoxShadow) styles.boxShadow = AVATAR_BOX_SHADOW;

		return styles;
	}

	function getClassName() {
		const classes = ['rsAvatar'];
		if (!!className) classes.push(className);

		return classes.join(' ');
	}

	function formatName() {
		if (!name) return '';
		const filteredName = name.split(' ').filter(({ length }) => length > 0);

		if (filteredName.length > 1) return filteredName[0][0].toLowerCase() + filteredName[1][0].toUpperCase();
		else if (filteredName.length === 1) return filteredName[0][0].toLowerCase();
		else return '';
	}

	function handleImgError() {
		if (!!name) setAvatarImage(undefined);
		else setAvatarImage(DEFAULT_AVATAR_BLACK_CDN_URL);
	}

	return (
		<div className={getClassName()} style={getStyle()} onClick={onClick}>
			{!!avatarImage && <img src={avatarImage} onError={() => handleImgError()} alt={name ?? ''} />}
			{!avatarImage && name && <div className={'nameInitial'}>{formatName()}</div>}
		</div>
	);
};

export default Avatar;
