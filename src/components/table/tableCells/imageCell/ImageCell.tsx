import React from 'react';
import Img, { ImgProps } from '../../../img/Img';
import BaseCell, { BaseCellProps } from '../BaseCell';

export interface ImageCellProps extends BaseCellProps<ImgProps['src']> {
	/* ~~~~~~ Advanced ~~~~~~ */

	/** The alt text that will be passed to the image. */
	alt?: ImgProps['alt'];
	/** The loading strategy that will be used. @see {@link Img} */
	isLazy?: ImgProps['isLazy'];
	/** The function that will be called if the image fails to load. */
	onError?: ImgProps['onError'];

	/* ~~~~~~ Styling ~~~~~~ */

	/** The width of the image */
	width?: ImgProps['width'];
	/** The height of the image */
	height?: ImgProps['height'];
}

const ImageCell: React.FC<ImageCellProps> = (props) => {
	const { alt = '', height = 'auto', width = 'auto', isLazy, onError, ...baseCellProps } = props;

	function getClassName() {
		const classes = ['rsImageCell'];
		if (!!baseCellProps.className) classes.push(baseCellProps.className);
		return classes.join(' ');
	}

	return (
		<BaseCell {...baseCellProps} className={getClassName()}>
			<Img src={baseCellProps.data} alt={alt} height={height} isLazy={isLazy} width={width} onError={onError} />
		</BaseCell>
	);
};

export default ImageCell;
