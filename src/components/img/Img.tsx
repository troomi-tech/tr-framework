import React, { CSSProperties, ImgHTMLAttributes, MouseEvent, useCallback, useEffect, useRef } from 'react';
import './Img.scss';
import { WebUtils } from '../../utils/Utils';
import { MISSING_IMAGE_DATA, MISSING_VIDEO_DATA } from '../../utils/constants';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

export interface ImgProps {
	/* ~~~~~~ Required ~~~~~~ */

	/** The source of the image */
	src: ImgHTMLAttributes<HTMLImageElement>['src'];
	/** The alt text of the image */
	alt: ImgHTMLAttributes<HTMLImageElement>['alt'];
	/** The width of the image */
	width: ImgHTMLAttributes<HTMLImageElement>['width'] | number;
	/** The height of the image */
	height: ImgHTMLAttributes<HTMLImageElement>['height'] | number;

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name of the image. Will always contain 'rsImg' */
	className?: string;
	/** The id of the image */
	id?: string;
	/** The onClick handler of the image */
	onClick?: (event: MouseEvent) => void;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** The srcSet sizes of the image. Will be used to generate the srcSet attribute */
	srcSetSizes?: number[];
	/** Whether the image should be lazy loaded or not @default false */
	isLazy?: boolean;
	/** The options passed to the {@link useIntersectionObserver} hook. */
	intersectionObserverOptions?: IntersectionObserverInit;
	/** Whether to disable imageKit or not @default false */
	shouldDisableImageKit?: boolean;
	/** The missing image data to be used when the image fails to load.
	 * @default MISSING_IMAGE_DATA @see{@link MISSING_IMAGE_DATA} */
	missingImageData?: string;
	/** The missing video data to be used when the video fails to load.
	 * @default MISSING_VIDEO_DATA @see{@link MISSING_VIDEO_DATA} */
	missingVideoData?: string;
	/** Called when the image fails to load. @returns {string} A string to be used for the new src */
	onError?: () => string;

	/* ~~~~~~ Styling ~~~~~~ */

	/** The style of the image */
	style?: CSSProperties;
	/** The CSS objectFit of the image */
	objectFit?: CSSProperties['objectFit'];
	/** The CSS objectPosition of the image */
	objectPosition?: CSSProperties['objectPosition'];
}

const Img: React.FC<ImgProps> = (props) => {
	const {
		missingImageData = MISSING_IMAGE_DATA,
		missingVideoData = MISSING_VIDEO_DATA,
		shouldDisableImageKit = false,
		isLazy = false,
		intersectionObserverOptions,
		objectPosition,
		srcSetSizes,
		objectFit,
		className,
		height,
		width,
		style,
		src,
		alt,
		id,
		onClick,
		onError
	} = props;

	const imgRef = useRef<HTMLImageElement>(null);
	const isImageInView = useIntersectionObserver(imgRef, intersectionObserverOptions);
	const [currentSrcSet, setCurrentSrcSet] = React.useState<string | undefined>(undefined);
	const [currentSrc, setCurrentSrc] = React.useState<string | undefined>(undefined);

	const checkForExistingQuery = useCallback(
		(src?: string) => {
			if (!src) return '';
			if (shouldDisableImageKit) return '';
			if (src.includes('?')) return '&';
			else return '?';
		},
		[shouldDisableImageKit]
	);

	const buildSrcSet = useCallback(() => {
		if (!srcSetSizes) return '';

		// TODO: Find out if this is still being used or wanted
		const srcSetUrl = srcSetSizes.map((item) => {
			const imageKitPostfix = shouldDisableImageKit ? '' : `tr=w-${item} ${item}w`;
			return src + `${checkForExistingQuery(src)}${imageKitPostfix}`;
		});

		const imageKitPostfix = shouldDisableImageKit ? '' : `tr=w-${width} ${width}w`;
		srcSetUrl.unshift(src + `${checkForExistingQuery(src)}${imageKitPostfix}`);
		return srcSetUrl.join(', ');
	}, [src, srcSetSizes, width, shouldDisableImageKit, checkForExistingQuery]);

	useEffect(() => {
		let imageKitPostfix = '';
		if (!shouldDisableImageKit) {
			imageKitPostfix = `tr=w-${width}`;
			if (typeof height === 'number') imageKitPostfix += `,h-${height}`;
		}
		if (isLazy) {
			if (!isImageInView) return;
			setCurrentSrc(`${src}${checkForExistingQuery(src)}${imageKitPostfix}`);
			if (!!srcSetSizes) setCurrentSrcSet(buildSrcSet());
		} else {
			if (!!src) setCurrentSrc(`${src}${checkForExistingQuery(src)}${imageKitPostfix}`);
			if (!!srcSetSizes) setCurrentSrcSet(buildSrcSet());
		}
	}, [
		src,
		isImageInView,
		height,
		width,
		srcSetSizes,
		shouldDisableImageKit,
		isLazy,
		buildSrcSet,
		checkForExistingQuery
	]);

	function renderSize(size: ImgProps['width'] & ImgProps['height']): string | undefined {
		if (typeof size === 'number') return size + 'px';
		else return size;
	}

	function getStyle() {
		const styles: React.CSSProperties = {};
		if (!!objectFit) styles.objectFit = objectFit;
		if (!!objectPosition) styles.objectPosition = objectPosition;

		return { ...styles, ...style };
	}

	function getClassName() {
		const classes = ['rsImg'];
		if (!!className) classes.push(className);
		if (!!isLazy) classes.push('lazy');

		return classes.join(' ');
	}

	function handleError() {
		const hasVideoExtension = WebUtils.hasVideoExtension(src ?? '');
		let newSrc = hasVideoExtension ? missingVideoData : missingImageData;
		if (onError) newSrc = onError();
		setCurrentSrc(newSrc);
	}

	return (
		<img
			height={renderSize(height)}
			width={renderSize(width)}
			className={getClassName()}
			style={getStyle()}
			onError={handleError}
			onClick={onClick}
			srcSet={currentSrcSet}
			src={currentSrc}
			ref={imgRef}
			alt={alt}
			id={id}
		/>
	);
};

export default Img;
