import type { Meta, StoryObj } from '@storybook/react';

import ProgressBar from './ProgressBar';
type ButtonType = typeof ProgressBar;

const meta: Meta<ButtonType> = {
	title: 'Components/ProgressBar',
	component: ProgressBar,
	argTypes: {
		percentage: {
			control: {
				type: 'range',
				min: 0,
				max: 100,
				step: 1
			}
		}
	},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<ButtonType>;

export const Default: Story = {
	args: {
		percentage: 40
	}
};
