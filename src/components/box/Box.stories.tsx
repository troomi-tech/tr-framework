import type { Meta, StoryObj } from '@storybook/react';

import Box from './Box';
type ButtonType = typeof Box;

const meta: Meta<ButtonType> = {
	title: 'Components/Box',
	component: Box,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<ButtonType>;

export const Default: Story = {
	args: {
		children: 'Box'
	}
};
