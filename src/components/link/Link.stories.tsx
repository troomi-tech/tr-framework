import type { Meta, StoryObj } from '@storybook/react';

import Link from './Link';
type ButtonType = typeof Link;

const meta: Meta<ButtonType> = {
	title: 'Components/Link',
	component: Link,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<ButtonType>;

export const Default: Story = {
	args: {
		children: 'Link',
		path: 'https://www.google.com',
		isExternal: true,
		target: 'blank',
		onClick: undefined
	}
};
