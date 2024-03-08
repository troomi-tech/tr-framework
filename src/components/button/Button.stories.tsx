import type { Meta, StoryObj } from '@storybook/react';

import Button from './Button';
type ButtonType = typeof Button;
// More on how to set up stories at: @link https://storybook.js.org/docs/react/writing-stories/introduction#default-export

/**  Here we write documentation for the component, and it will be displayed in the Storybook UI. */
const meta: Meta<ButtonType> = {
	title: 'Components/Button',
	component: Button,
	/** More on argTypes: @link https://storybook.js.org/docs/react/api/argtypes */
	argTypes: {
		children: { control: 'text' },
		disabled: { control: 'boolean' },
		look: {
			control: 'select',
			options: [
				'containedPrimary',
				'containedSecondary',
				'containedTertiary',
				'textPrimary',
				'textSecondary',
				'textTertiary',
				'outlinedPrimary',
				'outlinedSecondary',
				'outlinedTertiary',
				'none'
			]
		},
		className: { control: 'text' },
		id: { control: 'text' },
		disableRipple: { control: 'boolean' },
		type: { control: 'radio', options: ['button', 'submit'] },
		small: { control: 'boolean' },
		onClick: { action: 'clicked', control: 'function' },
		tooltipProperties: { control: 'object' },
		backgroundColor: { control: 'color' }
	},
	tags: ['autodocs']
};

export default meta;

/** More on writing stories with args: @link https://storybook.js.org/docs/react/writing-stories/args */
type Story = StoryObj<ButtonType>;

export const ContainedPrimary: Story = {
	args: {
		children: 'Regular Button',
		look: 'containedPrimary'
	}
};

export const DisabledButton: Story = {
	args: {
		children: 'Disabled Button',
		look: 'containedPrimary',
		disabled: true
	}
};

export const SmallContainedPrimary: Story = {
	args: {
		children: 'Small Button',
		look: 'containedPrimary',
		small: true
	}
};

export const ContainedSecondary: Story = {
	args: {
		children: 'Regular Button',
		look: 'containedSecondary'
	}
};

export const ContainedTertiary: Story = {
	args: {
		children: 'Regular Button',
		look: 'containedTertiary'
	}
};
