import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import Switch, { SwitchProps } from './Switch';
import Label from '../../../label/Label';
import Box from '../../../box/Box';
import FormControl from '../../../../form/FormControl';
import Validators from '../../../../form/Validator';

const InputStory = (props: SwitchProps) => {
	const [formControl, setFormControl] = React.useState(props.control);

	return (
		<Box width={'100%'}>
			<Switch {...props} control={formControl} onControlUpdate={(control) => setFormControl(control.clone())} />
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
		</Box>
	);
};

const meta: Meta<typeof Switch> = {
	title: 'Components/Input/Controls/Switch',
	component: Switch,
	render: (args) => <InputStory {...args} />,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
	args: {
		control: new FormControl(false, Validators.REQ())
	}
};
