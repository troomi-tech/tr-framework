import React, { CSSProperties, forwardRef } from 'react';
import './Chip.scss';
import './ChipLooks.scss';
import Icon, { IconProps } from '../icon/Icon';
import Avatar, { AvatarProps } from '../avatar/Avatar';
import Label from '../label/Label';

type ChipLooks = 'standard' | 'outlined' | 'error' | 'success' | 'warning' | 'none';

export interface ChipProps {
	/* ~~~~~~ Required ~~~~~~ */

	/** The text of the chip */
	label: string;

	/* ~~~~~~ Basic ~~~~~~ */

	/** The className of the chip. Will always contain `rsChip` */
	className?: string;
	/** The id of the chip */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** The look of the chip @default 'standard' */
	look?: ChipLooks;
	/** Whether the chip is disabled @default false */
	disabled?: boolean;
	/** If specified, the chip will use an icon the left of the text */
	iconImg?: IconProps['iconImg'];
	/** If specified, the chip will use an avatar the left of the text */
	avatarImg?: AvatarProps['image'];
	/** If specified, the chip will have an avatar with initials the left of the text if no avatarImg is specified */
	avatarName?: AvatarProps['name'];
	/** Handler for when the avatar is clicked */
	onAvatarClick?: AvatarProps['onClick'];
	/** If specified, the chip will have a delete icon on the right */
	onDelete?: () => void;
	/** If specified, the chip will have a ripple effect on click */
	onClick?: () => void;

	/* ~~~~~~ Styling ~~~~~~ */

	/** The background color of the chip */
	backgroundColor?: CSSProperties['backgroundColor'];
	/** The text color of the chip */
	textColor?: CSSProperties['color'];
}

const Chip = forwardRef<HTMLSpanElement, ChipProps>((props, ref) => {
	const {
		look = 'standard',
		disabled = false,
		backgroundColor,
		avatarName,
		className,
		avatarImg,
		textColor,
		iconImg,
		label,
		id,
		onAvatarClick,
		onDelete,
		onClick
	} = props;

	function triggerRippleEffect(event: React.MouseEvent<HTMLElement>) {
		const targetBoundingRect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - targetBoundingRect.x;
		const y = event.clientY - targetBoundingRect.y;
		const ripples = document.createElement('span');
		ripples.style.left = `${x}px`;
		ripples.style.top = `${y}px`;
		ripples.classList.add('ripple');
		event.currentTarget.appendChild(ripples);
		setTimeout(() => ripples.remove(), 600);
	}

	function getClassName() {
		const classes = ['rsChip', look];
		if (!!iconImg || !!avatarImg || !!avatarName) classes.push('withIcon');
		if (!!onDelete) classes.push('deletable');
		if (!!onClick) classes.push('clickable');
		if (!!disabled) classes.push('disabled');
		if (!!className) classes.push(className);

		return classes.join(' ');
	}

	function getStyle() {
		const styles: CSSProperties = {};
		if (!!backgroundColor) styles.backgroundColor = backgroundColor;
		if (!!textColor) styles.color = textColor;

		return styles;
	}

	function handleClick(e: React.MouseEvent<HTMLElement>) {
		if (!onClick || !!disabled) return;
		triggerRippleEffect(e);
		onClick();
	}

	function renderLeftIcons() {
		const shouldRenderCustomIcon = !!iconImg;
		const shouldRenderAvatar = !!avatarImg || !!avatarName;

		return (
			<>
				{shouldRenderAvatar && (
					<Avatar
						className="rsChipAvatar"
						onClick={onAvatarClick}
						name={avatarName}
						image={avatarImg}
						widthHeight={26}
					/>
				)}
				{shouldRenderCustomIcon && <Icon className="rsChipCustomIcon" iconImg={iconImg} />}
			</>
		);
	}

	function renderRightIcons() {
		if (!onDelete) return null;
		return <Icon className="rsChipDelete" iconImg={'icon-x'} size={8} onClick={onDelete} />;
	}

	return (
		<span className={getClassName()} style={getStyle()} onClick={handleClick} id={id} ref={ref}>
			{renderLeftIcons()}
			<Label className="rsChipLabel" variant="none">
				{label}
			</Label>
			{renderRightIcons()}
		</span>
	);
});

export default Chip;
