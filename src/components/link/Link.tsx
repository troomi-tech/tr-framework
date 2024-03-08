import React, { CSSProperties } from 'react';
import './Link.scss';
import TooltipWrapper, { TooltipProperties } from '../tooltip/tooltipWrapper/TooltipWrapper';

export interface LinkProps extends React.PropsWithChildren<unknown> {
	/* ~~~~~~ Required ~~~~~~ */

	/** The path the link will navigate to. */
	path: string | URL;

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name of the link. Will always contain 'rsLink'. */
	className?: string;
	/** The id of the link. */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** The router object is used instead of window.location.assign() to navigate to the path.
	 * This is useful when using a virtual router like the TrRouter. If the router object is not provided,
	 * the component will try to use the following functions in order to navigate to the path:
	 * @default [`window.globalFunctions.router.navigate`,`window.router.navigate`,`window.navigate`,`window.location.assign`] */
	router?: unknown & { navigate: (path: string) => void };
	/** If onClick is provided, the component will not navigate to the path.
	 * @param path The path the link was going to navigate to. */
	onClick?: (path: LinkProps['path']) => void;
	/** Whether or not the link should have a cursor pointer. @default true */
	hasCursorPointer?: boolean;
	/** If true, the link will use `window.open()` and `window.location.assign()` to navigate to the path.
	 * Instead of using the router object. @default false */
	isExternal?: boolean;
	/** The target attribute of the link. @default 'self' */
	target?: 'blank' | 'self';
	/** If true, the link will have a blue text color. @default false */
	highlightBlue?: boolean;

	/* ~~~~~~ Styling ~~~~~~ */

	/** The CSS text-decoration property. @default 'none' */
	textDecoration?: CSSProperties['textDecoration'];
	/** The CSS background-color property. */
	backgroundColor?: CSSProperties['backgroundColor'];
	/** The CSS color property. */
	textColor?: CSSProperties['color'];

	/* ~~~~~~ Tooltip ~~~~~~ */

	/** If tooltipProperties are provided, the link will be wrapped in a `TooltipWrapper` component.
	 * @default {label: `${props.path}`, ariaLabel: `navigate to ${props.path}`, position: 'bottom', transition: 'fade'} */
	tooltipProperties?: TooltipProperties;
}

const Link: React.FC<LinkProps> = (props) => {
	const {
		tooltipProperties = getDefaultTooltipProperties(),
		hasCursorPointer = true,
		textDecoration = 'none',
		textColor = 'inherit',
		isExternal = false,
		target = 'self',
		backgroundColor,
		highlightBlue,
		className,
		router,
		path,
		id,
		onClick
	} = props;

	function getDefaultTooltipProperties(): TooltipProperties {
		return {
			label: `${path}`,
			ariaLabel: `navigate to ${path}`,
			position: 'bottom',
			transition: 'fade'
		};
	}

	function getStyle() {
		const styles: CSSProperties = {};
		if (!!hasCursorPointer) styles.cursor = 'pointer';
		if (!!backgroundColor) styles.backgroundColor = backgroundColor;
		if (!!textDecoration) styles.textDecoration = textDecoration;
		if (!!textColor) styles.color = textColor;

		return styles;
	}

	function getClassName() {
		const classes = ['rsLink'];
		if (!!className) classes.push(className);
		if (!!isExternal) classes.push('external');
		if (!!highlightBlue) classes.push('highlightBlue');

		return classes.join(' ');
	}

	function handleClick(e: React.MouseEvent) {
		e.preventDefault();

		if (!!onClick) return onClick(path);
		if (!isExternal) return navigateWithRouter(path.toString());
		if (target === 'blank') return window.open(path, '_blank');
		window.location.assign(path);
	}

	function navigateWithRouter(path: string): unknown {
		if (router?.navigate) return router.navigate?.(path);

		// Check if the window object has globalFunctions.router.navigate function
		const windowGlobalFunctions = Object.getPrototypeOf(window)?.globalFunctions;
		const windowGlobalFunctionsRouter = Object.getPrototypeOf(windowGlobalFunctions)?.router;
		const windowGlobalFunctionsRouterNavigate = Object.getPrototypeOf(windowGlobalFunctionsRouter)?.navigate;
		if (!!windowGlobalFunctionsRouterNavigate) return windowGlobalFunctionsRouterNavigate(path);

		// Check if the window object has router.navigate function
		const windowRouter = Object.getPrototypeOf(window)?.router;
		const windowRouterNavigate = Object.getPrototypeOf(windowRouter)?.navigate;
		if (!!windowRouterNavigate) return windowRouterNavigate(path);

		// Check if the window object has navigate function
		const windowNavigate = Object.getPrototypeOf(window)?.navigate;
		if (!!windowNavigate) return windowNavigate(path);

		// If none of the above functions exist, use window.location.assign()
		if (target === 'blank') return window.open(path, '_blank');
		window.location.assign(path);
	}

	function renderSingleLink(children: React.ReactNode) {
		return (
			<a id={id} className={getClassName()} style={getStyle()} href={path.toString()} onClick={handleClick}>
				{children}
			</a>
		);
	}

	function renderLink() {
		if (!tooltipProperties) return renderSingleLink(props.children);
		if (tooltipProperties.wrapContents)
			return renderSingleLink(<TooltipWrapper {...tooltipProperties}>{props.children}</TooltipWrapper>);
		else return <TooltipWrapper {...tooltipProperties}>{renderSingleLink(props.children)}</TooltipWrapper>;
	}

	return renderLink();
};

export default Link;
