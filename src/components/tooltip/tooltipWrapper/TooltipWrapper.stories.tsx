import type { Meta, StoryObj } from '@storybook/react';

import TooltipWrapper from './TooltipWrapper';
type ButtonType = typeof TooltipWrapper;

const meta: Meta<ButtonType> = {
	title: 'Components/TooltipWrapper',
	component: TooltipWrapper,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<ButtonType>;

export const Default: Story = {
	args: {
		children: 'Hover over me to see a tooltip',
		label: 'Tooltip'
	}
};
