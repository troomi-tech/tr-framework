import type { Meta, StoryObj } from '@storybook/react';

import Page from './Page';
type ButtonType = typeof Page;

const meta: Meta<ButtonType> = {
	title: 'Components/Page',
	component: Page,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<ButtonType>;

export const Default: Story = {
	args: {
		children: 'Page'
	}
};
