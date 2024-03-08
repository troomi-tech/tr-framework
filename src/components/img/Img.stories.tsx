import type { Meta, StoryObj } from '@storybook/react';

import Img from './Img';
type ButtonType = typeof Img;

const meta: Meta<ButtonType> = {
	title: 'Components/Img',
	component: Img,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<ButtonType>;

export const EagerImg: Story = {
	args: {
		width: 150,
		height: 150,
		alt: 'Placeholder image',
		src: 'https://via.placeholder.com/150'
	}
};

export const LazyImg: Story = {
	args: {
		width: 150,
		height: 150,
		alt: 'Placeholder image',
		src: 'https://via.placeholder.com/150',
		isLazy: true,
		id: 'lazyImg'
	}
};
