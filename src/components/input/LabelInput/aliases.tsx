import React from 'react';
import LabelInput, { LabelInputProps } from './LabelInput';
import { TextInputProps } from '../controls/textInput/TextInput';

export type LabelSelectProps = LabelInputProps & { type?: 'select' };
export const LabelSelect: React.FC<LabelSelectProps> = (props) => {
	props.type = 'select';
	return <LabelInput {...props} />;
};

export type LabelCheckboxProps = LabelInputProps & { type?: 'checkbox' };
export const LabelCheckbox: React.FC<LabelCheckboxProps> = (props) => {
	props.type = 'checkbox';
	return <LabelInput {...props} />;
};

export type LabelSwitchProps = LabelInputProps & { type?: 'switch' };
export const LabelSwitch: React.FC<LabelSwitchProps> = (props) => {
	props.type = 'switch';
	return <LabelInput {...props} />;
};

export type LabelNumericInputProps = LabelInputProps & { type?: 'number' };
export const LabelNumericInput: React.FC<LabelNumericInputProps> = (props) => {
	props.type = 'number';
	return <LabelInput {...props} />;
};

export type LabelTextInputProps = LabelInputProps & { type: TextInputProps['type'] };
export const LabelTextInput: React.FC<LabelTextInputProps> = (props) => {
	return <LabelInput {...props} />;
};

export type LabelRadioGroupProps = LabelInputProps & { type?: 'radioGroup' };
export const LabelRadioGroup: React.FC<LabelRadioGroupProps> = (props) => {
	props.type = 'radioGroup';
	return <LabelInput {...props} />;
};
