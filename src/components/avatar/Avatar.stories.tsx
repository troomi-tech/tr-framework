import type { Meta, StoryObj } from '@storybook/react';

import Avatar from './Avatar';
type ButtonType = typeof Avatar;

const meta: Meta<ButtonType> = {
	title: 'Components/Avatar',
	component: Avatar,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<ButtonType>;

export const Default: Story = {
	args: {
		name: 'John Doe',
		widthHeight: 50
	}
};
