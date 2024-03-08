import type { Meta, StoryObj } from '@storybook/react';

import Checkbox, { CheckboxProps } from './Checkbox';
import React from 'react';
import Label from '../../../label/Label';
import Box from '../../../box/Box';
import FormControl from '../../../../form/FormControl';
import Validators from '../../../../form/Validator';

const InputStory = (props: CheckboxProps) => {
	const [formControl, setFormControl] = React.useState(props.control);

	return (
		<>
			<Checkbox
				{...props}
				control={formControl}
				onControlUpdate={(control) => setFormControl(control.clone())}
				beforeUpdate={() => true}
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

const meta: Meta<typeof Checkbox> = {
	title: 'Components/Input/Controls/Checkbox',
	component: Checkbox,
	argTypes: {},
	tags: ['autodocs'],
	render: (args) => <InputStory {...args} />
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Example: Story = {
	args: {
		control: new FormControl(false, Validators.REQ('Please check the checkbox.'))
	}
};
