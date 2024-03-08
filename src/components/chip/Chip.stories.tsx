import type { Meta, StoryObj } from '@storybook/react';

import Chip from './Chip';
type ButtonType = typeof Chip;

const meta: Meta<ButtonType> = {
	title: 'Components/Chip',
	component: Chip,
	argTypes: {
		look: {
			control: {
				type: 'select',
				options: ['filled', 'outlined', 'error', 'success', 'warning', 'none']
			}
		}
	},
	args: {
		onClick: undefined,
		disabled: false,
		onDelete: undefined
	},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<ButtonType>;

export const Standard: Story = {
	args: {
		label: 'Chip Default'
	}
};

export const Outlined: Story = {
	args: {
		label: 'Chip Outlined',
		look: 'outlined'
	}
};

export const Error: Story = {
	args: {
		label: 'Chip Error',
		look: 'error'
	}
};

export const Success: Story = {
	args: {
		label: 'Chip Success',
		look: 'success'
	}
};

export const Warning: Story = {
	args: {
		label: 'Chip Warning',
		look: 'warning'
	}
};

export const Disabled: Story = {
	args: {
		label: 'Chip Disabled',
		disabled: true
	}
};

export const WithIcon: Story = {
	args: {
		label: 'Chip With Icon',
		iconImg: 'icon-comment'
	}
};

export const WithAvatar: Story = {
	args: {
		label: 'Chip With Avatar',
		avatarName: 'John Doe'
	}
};

export const Deletable: Story = {
	args: {
		label: 'Chip Deletable',
		onDelete: () => {}
	}
};

export const WithClick: Story = {
	args: {
		label: 'Chip With Click',
		onClick: () => {}
	}
};
