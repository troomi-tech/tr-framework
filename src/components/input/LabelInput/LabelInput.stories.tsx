import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import Label from '../../label/Label';
import Box from '../../box/Box';
import FormControl from '../../../form/FormControl';
import LabelInput, { LabelInputProps } from './LabelInput';
import Validators from '../../../form/Validators';

const TextInputStory = (props: LabelInputProps) => {
	const [formControl, setFormControl] = React.useState<FormControl>(props.control);

	return (
		<>
			<LabelInput
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

const meta: Meta<typeof LabelInput> = {
	title: 'Components/Input/LabelInput',
	component: LabelInput,
	argTypes: {},
	tags: ['autodocs'],
	render: (args) => <TextInputStory {...args} />
};

export default meta;

type Story = StoryObj<typeof LabelInput>;

export const TextInput: Story = {
	args: {
		type: 'email',
		label: 'Email',
		look: 'box',
		autocomplete: 'email',
		control: new FormControl('', Validators.REQ(), Validators.EMAIL())
	}
};

export const NumericInput: Story = {
	args: {
		type: 'number',
		label: 'Number',
		look: 'box',
		control: new FormControl(undefined, Validators.NUM(), Validators.REQ()),
		doesAllowDecimal: true,
		doesAllowNegative: true
	}
};

export const SelectInput: Story = {
	args: {
		type: 'select',
		label: 'Select',
		control: new FormControl(undefined, Validators.REQ()),
		options: [
			{ label: 'Option 1', value: 'option1' },
			{ label: 'Option 2', value: 'option2' },
			{ label: 'Option 3', value: 'option3' }
		]
	}
};

export const CheckboxInput: Story = {
	args: {
		type: 'checkbox',
		label: 'Checkbox',
		placement: 'right',
		requiredPlacement: 'bottom',
		control: new FormControl(false, Validators.REQ())
	}
};

export const SwitchInput: Story = {
	args: {
		type: 'switch',
		label: 'Switch',
		placement: 'left',
		requiredPlacement: 'bottom',
		control: new FormControl(true, Validators.REQ())
	}
};
