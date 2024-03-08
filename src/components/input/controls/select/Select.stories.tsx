import type { Meta, StoryObj } from '@storybook/react';

import Select, { SelectProps } from './Select';
import React from 'react';
import Label from '../../../label/Label';
import Box from '../../../box/Box';
import { isInteger } from 'lodash';
import FormControl from '../../../../form/FormControl';
import Validators from '../../../../form/Validator';

const InputStory = (props: SelectProps) => {
	const [formControl, setFormControl] = React.useState(props.control);
	return (
		<>
			<Select {...props} control={formControl} onControlUpdate={(control) => setFormControl(control.clone())} />
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

const meta: Meta<typeof Select> = {
	title: 'Components/Input/Controls/Select',
	component: Select,
	render: (args) => <InputStory {...args} />,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Basic: Story = {
	args: {
		theme: 'rsInput',
		control: new FormControl('', Validators.REQ()),
		options: [
			{ value: 1, label: 'Option 1' },
			{ value: 2, label: 'Option 2' },
			{ value: 3, label: 'Option 3' },
			{ value: 4, label: 'Option 4' },
			{ value: 5, label: 'Option 5' }
		]
	}
};

export const Creatable: Story = {
	args: {
		theme: 'rsInput',
		control: new FormControl('', Validators.REQ()),
		onCreateOption: (value: string) => ({ value: +value, label: `Option ${value}` }),
		isValidNewOption: (value: string) => value !== '' && isInteger(+value),
		options: [
			{ value: 1, label: 'Option 1' },
			{ value: 2, label: 'Option 2' },
			{ value: 3, label: 'Option 3' },
			{ value: 4, label: 'Option 4' },
			{ value: 5, label: 'Option 5' }
		],
		isCreatable: true
	}
};

export const Multi: Story = {
	args: {
		theme: 'rsInput',
		control: new FormControl([], Validators.REQ()),
		options: [
			{ value: 1, label: 'Option 1' },
			{ value: 2, label: 'Option 2' },
			{ value: 3, label: 'Option 3' },
			{ value: 4, label: 'Option 4' },
			{ value: 5, label: 'Option 5' }
		],
		isMulti: true
	}
};

export const MultiCreatable: Story = {
	args: {
		theme: 'rsInput',
		control: new FormControl([], Validators.REQ()),
		onCreateOption: (value: string) => ({ value: +value, label: `Option ${value}` }),
		isValidNewOption: (value: string) => value !== '' && isInteger(+value),
		options: [
			{ value: 1, label: 'Option 1' },
			{ value: 2, label: 'Option 2' },
			{ value: 3, label: 'Option 3' },
			{ value: 4, label: 'Option 4' },
			{ value: 5, label: 'Option 5' }
		],
		isMulti: true,
		isCreatable: true
	}
};
