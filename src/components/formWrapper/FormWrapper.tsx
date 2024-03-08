import React, { FormEvent } from 'react';
import './FormWrapper.scss';

export interface FormWrapperProps extends React.PropsWithChildren {
	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name of the form. Will always contain 'rsFormWrapper' */
	className?: string;
	/** The id of the form */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** Function to be called when the form is submitted */
	onSubmit?: () => void;
	/** The name of the form, @default id */
	name?: string;
}

const FormWrapper: React.FC<FormWrapperProps> = (props) => {
	const { id, className, name = id, onSubmit } = props;

	function getClassName() {
		const classes = ['rsFormWrapper'];
		if (!!className) classes.push(className);

		return classes.join(' ');
	}

	function submitHandler(event: FormEvent) {
		event.preventDefault();
		if (!!onSubmit) onSubmit();
	}

	return (
		<form id={id} name={name} className={getClassName()} action="#" onSubmit={submitHandler}>
			{props.children}
		</form>
	);
};

export default FormWrapper;
