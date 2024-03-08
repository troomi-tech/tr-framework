import type { Meta, StoryObj } from '@storybook/react';

import TextInput, { TextInputProps } from './TextInput';
import React from 'react';
import Label from '../../../label/Label';
import Box from '../../../box/Box';
import FormControl from '../../../../form/FormControl';
import { StringUtils } from '../../../../utils';
import { Validators } from '../../../../form';

const TextInputStory = (props: TextInputProps) => {
	const [formControl, setFormControl] = React.useState(props.control);

	return (
		<>
			<TextInput
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

const meta: Meta<typeof TextInput> = {
	title: 'Components/Input/Controls/TextInput',
	component: TextInput,
	argTypes: {},
	tags: ['autodocs'],
	render: (args) => <TextInputStory {...args} />
};

export default meta;

type Story = StoryObj<typeof TextInput>;

export const Email: Story = {
	args: {
		type: 'email',
		look: 'box',
		autocomplete: 'email',
		control: new FormControl<string>('', Validators.REQ(), Validators.EMAIL())
	}
};

export const Password: Story = {
	args: {
		type: 'password',
		look: 'underline',
		control: new FormControl<string>('', Validators.REQ(), Validators.MIN_LENGTH(8))
	}
};

export const TextArea: Story = {
	args: {
		type: 'textarea',
		control: new FormControl<string>('', Validators.MAX_LENGTH(100))
	}
};

export const Phone: Story = {
	args: {
		type: 'tel',
		control: new FormControl<string>('1234567890', Validators.REQ(), Validators.PHONE()),
		beforeUpdate: StringUtils.formatPhoneNumber
	}
};
