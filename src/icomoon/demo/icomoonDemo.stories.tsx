import type { Meta, StoryObj } from '@storybook/react';

import IcomoonDemo from './IcomoonDemo';

const meta: Meta<typeof IcomoonDemo> = {
	title: 'Icomoon/Demo',
	component: IcomoonDemo,
	parameters: { options: { showPanel: false } }
};

export default meta;

type Story = StoryObj<typeof IcomoonDemo>;

export const Demo: Story = {};
