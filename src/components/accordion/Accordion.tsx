import React, { MouseEvent, useEffect, useState, CSSProperties, useLayoutEffect, useCallback } from 'react';
import './Accordion.scss';
import Icon, { IconProps } from '../icon/Icon';
import Box from '../box/Box';
import Label from '../label/Label';
import { useTimeout } from '../../hooks';

export interface AccordionProps {
	/* ~~~~~~ Required ~~~~~~ */

	/** The button that toggles the accordion on click */
	title: React.ReactNode | string;
	/** The content to toggle in the accordion */
	children: React.ReactNode;

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name of the accordion always contains `rsAccordion` */
	className?: string;
	/** The id of the accordion */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** The duration of the transition animation in ms @default 400 */
	transitionDuration?: number;
	/** Whether or not to show the icon by the title @default false */
	disableIcon?: boolean;
	/** The icon to display on the right side of the title @default icon-chevron-up */
	iconImg?: IconProps['iconImg'];
	/** Whether or not the wripple effect is disabled @default false */
	disableRipple?: boolean;
	/** Whether or not the title should light up on hover @default false */
	hasHoverEffect?: boolean;
	/** Override whether or not the accordion is open.
	 * If undefined, the accordion will toggle on click @default undefined */
	isOpen?: boolean | undefined;
	/** Whether or not the accordion is open by default @default false */
	isInitiallyOpen?: boolean;
	/** Callback function when the accordion is clicked
	 * @param isOpen Whether or not the accordion is open */
	onClick?: (isOpen: boolean) => void;
	/** Callback function when the accordion is opened */
	onOpen?: () => void;
	/** Callback function when the accordion is closed */
	onClose?: () => void;

	/* ~~~~~~ Styling ~~~~~~ */

	/** The color of the title text */
	textColor?: string;
	/** The color of the icon @default textColor */
	iconColor?: string;
	/** The background color of the accordion */
	backgroundColor?: string;
	/** The background color of the accordion when it is open */
	openedBackgroundColor?: string;
}

const Accordion: React.FC<AccordionProps> = (props) => {
	const {
		iconImg = 'icon-chevron-up',
		transitionDuration = 400,
		isInitiallyOpen = false,
		hasHoverEffect = false,
		disableRipple = false,
		disableIcon = false,
		isOpen = undefined,
		textColor,
		iconColor = textColor,
		openedBackgroundColor,
		backgroundColor,
		className,
		title,
		id,
		onOpen,
		onClose,
		onClick
	} = props;

	const childrenRef = React.createRef<HTMLDivElement>();
	const [isOpened, setIsOpened] = useState<boolean>(isInitiallyOpen);
	const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
	const transitionTimeout = useTimeout(() => setIsTransitioning(false), transitionDuration);

	const handleOpen = useCallback(() => {
		setIsOpened(true);
		setIsTransitioning(true);
		transitionTimeout.clear();
		transitionTimeout.reset();
		if (!!onOpen) onOpen();
	}, [transitionTimeout, onOpen]);

	const handleClose = useCallback(() => {
		setIsOpened(false);
		setIsTransitioning(true);
		transitionTimeout.clear();
		transitionTimeout.reset();
		if (!!onClose) onClose();
	}, [transitionTimeout, onClose]);

	useEffect(() => {
		const panel = childrenRef.current;
		if (!panel) return;
		panel.style.transition = `height ${transitionDuration}ms ease-in-out`;
	}, [transitionDuration, childrenRef]);

	useEffect(() => {
		if (typeof isOpen !== 'boolean') return;
		if (isOpen) handleOpen();
		else handleClose();
	}, [isOpen, handleOpen, handleClose]);

	useEffect(() => {
		const panel = childrenRef.current;
		if (!panel) return;
		if (panel.style.height || !isOpened) panel.style.height = '0px';
		else panel.style.height = panel.scrollHeight + 'px';
	}, [isOpened, childrenRef]);

	useLayoutEffect(() => {
		const panel = childrenRef.current;
		if (!panel) return;

		const mutObserver = new MutationObserver(() => {
			if (panel.classList.contains('opened')) panel.style.height = panel.scrollHeight + 'px';
		});
		const observer = new ResizeObserver(() => {
			if (panel.classList.contains('opened')) panel.style.height = panel.scrollHeight + 'px';
		});

		mutObserver.observe(panel, { attributes: true, childList: true, subtree: true });
		for (let i = 0; i < panel.children.length; i++) {
			mutObserver.observe(panel.children[i], { attributes: true, childList: true, subtree: true });
			observer.observe(panel.children[i]);
		}

		return () => {
			mutObserver.disconnect();
			observer.disconnect();
		};
	}, [childrenRef]);

	function getStyle() {
		const styles: CSSProperties = {};
		if (!!openedBackgroundColor && isOpened) styles.backgroundColor = openedBackgroundColor;
		if (!!backgroundColor && !isOpened) styles.backgroundColor = backgroundColor;
		if (!!textColor) styles.color = textColor;

		return styles;
	}

	function triggerRippleEffect(event: MouseEvent) {
		if (disableRipple) return;
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

	function handleClick(e: MouseEvent) {
		triggerRippleEffect(e);
		if (!!onClick) onClick(isOpened);
		if (typeof isOpen === 'boolean') return;
		if (isOpened) handleClose();
		else handleOpen();
	}

	function getClassName() {
		const classes = ['rsAccordion'];
		if (!!className) classes.push(className);
		if (!!hasHoverEffect) classes.push('withHoverEffect');
		if (!!isOpened) classes.push('opened');
		else classes.push('closed');

		return classes.join(' ');
	}

	function renderTitle() {
		if (typeof title !== 'string') return title;
		return (
			<Label variant="none" className={'titleWrapper'} color={textColor}>
				{title}
			</Label>
		);
	}

	function renderIcon() {
		if (disableIcon) return null;
		return <Icon iconImg={iconImg} size={17} color={iconColor} />;
	}

	function renderChildren() {
		if (isOpened || isTransitioning) return props.children;
		return null;
	}

	return (
		<Box className={getClassName()} style={getStyle()} id={id}>
			<Box className="rsAccordionHeader" onClick={handleClick}>
				{renderTitle()}
				{renderIcon()}
			</Box>
			<Box className={`rsAccordionChildren ${isOpened ? 'opened' : 'closed'}`} ref={childrenRef}>
				{renderChildren()}
			</Box>
		</Box>
	);
};

export default Accordion;
