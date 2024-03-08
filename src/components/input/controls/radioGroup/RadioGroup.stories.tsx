import type { Meta, StoryObj } from '@storybook/react';

import RadioGroup, { RadioGroupProps } from './RadioGroup';
import React from 'react';
import Label from '../../../label/Label';
import Box from '../../../box/Box';
import FormControl from '../../../../form/FormControl';
import Validators from '../../../../form/Validator';

const InputStory = (props: RadioGroupProps) => {
	const [formControl, setFormControl] = React.useState(props.control);

	return (
		<>
			<RadioGroup
				{...props}
				name={`storybookRadio${Math.round(Math.random() * 10000)}`}
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

const meta: Meta<typeof RadioGroup> = {
	title: 'Components/Input/Controls/RadioGroup',
	component: RadioGroup,
	argTypes: {},
	tags: ['autodocs'],
	render: (args) => <InputStory {...args} />
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Example: Story = {
	args: {
		control: new FormControl(undefined, Validators.REQ('Please check the RadioGroup.')),
		options: [
			{ label: 'Option 1', value: 'option1' },
			{ label: 'Option 2', value: 'option2' },
			{ label: 'Option 3', value: 'option3' },
			{ label: 'Option 4', value: 'option4' }
		]
	}
};

export const IconExample: Story = {
	args: {
		control: new FormControl(undefined, Validators.REQ('Please check the RadioGroup.')),
		options: [
			{ label: 'Option 1', value: 'option1', iconImg: 'icon-battery-0' },
			{ label: 'Option 2', value: 'option2', iconImg: 'icon-battery-1' },
			{ label: 'Option 3', value: 'option3', iconImg: 'icon-battery-2' },
			{ label: 'Option 4', value: 'option4', iconImg: 'icon-battery-3' }
		]
	}
};
