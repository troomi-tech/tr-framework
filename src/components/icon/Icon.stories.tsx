import type { Meta, StoryObj } from '@storybook/react';

import Icon from './Icon';

const meta: Meta<typeof Icon> = {
	title: 'Components/Icon',
	component: Icon,
	argTypes: {
		color: { control: 'color' },
		size: { control: 'number' }
	},
	args: {
		size: 50
	},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Default: Story = {
	args: {
		iconImg: 'icon-check'
	}
};
