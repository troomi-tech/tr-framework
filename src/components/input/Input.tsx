import React from 'react';
import './Input.scss';
import NumericInput, { NumericInputProps } from './controls/numericInput/NumericInput';
import TextInput, { TextInputProps } from './controls/textInput/TextInput';
import Select, { SelectProps } from './controls/select/Select';
import Checkbox, { CheckboxProps } from './controls/checkbox/Checkbox';
import Switch, { SwitchProps } from './controls/switch/Switch';
import RadioGroup, { RadioGroupProps } from './controls/radioGroup/RadioGroup';

type ConditionalInputProps =
	| ({ type: 'number' } & NumericInputProps)
	| ({ type: 'select' } & SelectProps)
	| ({ type: 'checkbox' } & CheckboxProps)
	| ({ type: 'switch' } & SwitchProps)
	| ({ type: 'radioGroup' } & RadioGroupProps)
	| ({ type: TextInputProps['type'] } & TextInputProps);

export type InputSharedProps = {
	/* ~~~~~~ Required ~~~~~~ */

	/** Used to determine the type of input to render. */
	type: 'number' | 'select' | 'checkbox' | 'switch' | 'radioGroup' | TextInputProps['type'];

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name of the component will always contain 'rsLabelInput' */
	className?: string;
	/** The id of the component */
	id?: string;
};

export type InputProps = ConditionalInputProps & InputSharedProps;

const Input: React.FC<InputProps> = (props) => {
	const { type, className, id, ...typeProps } = props;

	function getClassName() {
		const classes = ['rsInput'];
		if (!!className) classes.push(className);
		if (type === 'checkbox') classes.push('checkbox');
		else if (type === 'switch') classes.push('switch');
		else if (type === 'select') classes.push('select');
		else if (type === 'number') classes.push('number');
		else classes.push('text');

		return classes.join(' ');
	}

	function renderInput() {
		const sharedProps = {
			className: getClassName(),
			id: id && `${id}Input`
		};

		switch (type) {
			case 'select':
				return <Select theme="rsInput" {...sharedProps} {...(typeProps as SelectProps)} />;
			case 'checkbox':
				return <Checkbox {...sharedProps} {...(typeProps as CheckboxProps)} />;
			case 'switch':
				return <Switch {...sharedProps} {...(typeProps as SwitchProps)} />;
			case 'number':
				return <NumericInput look="box" {...sharedProps} {...(typeProps as NumericInputProps)} />;
			case 'radioGroup':
				return <RadioGroup {...sharedProps} {...(typeProps as RadioGroupProps)} />;
			default:
				return <TextInput look="box" {...sharedProps} {...(typeProps as TextInputProps)} />;
		}
	}

	return renderInput();
};

export default Input;
