import type { Meta, StoryObj } from '@storybook/react';

import NumericInput, { NumericInputProps } from './NumericInput';
import React from 'react';
import Label from '../../../label/Label';
import Box from '../../../box/Box';
import FormControl from '../../../../form/FormControl';
import Validators from '../../../../form/Validator';

const TextInputStory = (props: NumericInputProps) => {
	const [formControl, setFormControl] = React.useState(props.control);

	return (
		<>
			<NumericInput
				{...props}
				control={formControl}
				onControlUpdate={(control) => setFormControl(control.clone())}
			/>
			<Label mt={32} variant="link1">
				Form Control:
			</Label>
			<hr />
			<Box display="flex" flexDirection="column" gap={8}>
				<Label variant="subtitle">Value: {String(formControl.value)}</Label>
				<Label variant="subtitle">Is Touched: {String(formControl.isTouched)}</Label>
				<Label variant="subtitle">Is Dirty: {String(formControl.isDirty)}</Label>
				<Label variant="subtitle">Is Valid: {String(formControl.isValid)}</Label>
				<Label variant="subtitle">Errors: {formControl.errors}</Label>
			</Box>
		</>
	);
};

const meta: Meta<typeof NumericInput> = {
	title: 'Components/Input/Controls/NumericInput',
	component: NumericInput,
	argTypes: {},
	tags: ['autodocs'],
	render: (args) => <TextInputStory {...args} />
};

export default meta;

type Story = StoryObj<typeof NumericInput>;

export const Integer: Story = {
	args: {
		control: new FormControl<number>(0, Validators.NUM('integer')),
		doesAllowDecimal: false
	}
};

export const Decimal: Story = {
	args: {
		control: new FormControl<number>(5.5, Validators.NUM('positiveFloat')),
		doesAllowDecimal: true
	}
};

export const Negative: Story = {
	args: {
		control: new FormControl(undefined, Validators.NUM('integer'), Validators.REQ()),
		doesAllowNegative: true
	}
};

export const NegativeDecimal: Story = {
	args: {
		control: new FormControl(undefined, Validators.NUM('float'), Validators.REQ()),
		doesAllowNegative: true,
		doesAllowDecimal: true
	}
};

export const CSV: Story = {
	args: {
		autocomplete: 'cc-csc',
		control: new FormControl(
			undefined,
			Validators.REQ('You must enter a CVV'),
			Validators.MAX_LENGTH(4, 'CVV must be at most 4 characters'),
			Validators.MIN_LENGTH(3, 'CVV must be least 3 characters'),
			Validators.NUM('positiveInteger', 'CVV must be a positive integer')
		),
		minValue: 100,
		maxValue: 9999
	}
};
