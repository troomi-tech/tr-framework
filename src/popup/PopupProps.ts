import React from 'react';

export default class PopupProps {
	opened?: boolean = true;
	className?: string;
	preventCloseByBackgroundClick?: boolean;
	preventCloseByEscapeKey?: boolean;
	popupId?: string;
	/** Called before the popup is about to be closed either by clicking on the background or pressing the escape key.
	 * If the function returns false the popup will not be closed. */
	onClose?: () => Promise<Boolean> | Boolean;
	children?: React.ReactNode;
}
