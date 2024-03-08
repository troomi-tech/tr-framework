import type { Meta, StoryObj } from '@storybook/react';

import View from './View';
type ButtonType = typeof View;

const meta: Meta<ButtonType> = {
	title: 'Components/View',
	component: View,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<ButtonType>;

export const Default: Story = {
	args: {
		id: 'ExampleView',
		initialPath: '/'
	}
};
