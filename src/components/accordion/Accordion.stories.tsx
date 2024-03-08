import type { Meta, StoryObj } from '@storybook/react';

import Accordion from './Accordion';
import React from 'react';
import Label from '../label/Label';

type ButtonType = typeof Accordion;

const meta: Meta<ButtonType> = {
	title: 'Components/Accordion',
	component: Accordion,
	argTypes: {
		isOpen: { type: 'number' }
	},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<ButtonType>;

export const Default: Story = {
	args: {
		title: 'Accordion',
		children: (
			<>
				<Label variant="subtitle">Item 1</Label>
				<Label variant="subtitle">Item 2</Label>
				<Label variant="subtitle">Item 3</Label>
				<Label variant="subtitle">Item 4</Label>
			</>
		)
	}
};
