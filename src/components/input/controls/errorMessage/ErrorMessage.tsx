import FormControl from '../../../../form/FormControl';
import './ErrorMessage.scss';
import React from 'react';

export interface ErrorMessageProps {
	/** The form control to use for the error message */
	control: FormControl;
}

const ErrorMessage: React.FC<ErrorMessageProps> = (props) => {
	const { control } = props;

	function renderErrorMessage() {
		if (!control.shouldShowErrors) return null;
		const firstError = control.errors.at(0);
		if (!firstError) return null;

		return (
			<div role="alert" className={'rsErrorMessage'}>
				{firstError}
			</div>
		);
	}

	return renderErrorMessage();
};

export default ErrorMessage;
