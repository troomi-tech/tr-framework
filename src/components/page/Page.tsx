import React from 'react';
import './Page.scss';
export interface PageProps {
	/* ~~~~~~ Required ~~~~~~ */

	/** The ID of the page. Required for QA automation purposes */
	id: string;
	/** The content of the page */
	children: React.ReactNode;

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name of the page. Will always contain 'rsPage' */
	className?: string;
}

const Page: React.FC<PageProps> = (props) => {
	const { className, id } = props;

	function getClassName() {
		const classes = ['rs-page', 'rsPage']; // TODO: Remove 'rs-page' after first release
		if (!!className) classes.push(className);
		return classes.join(' ');
	}

	return (
		<div className={getClassName()} id={id}>
			{props.children}
		</div>
	);
};

export default Page;
