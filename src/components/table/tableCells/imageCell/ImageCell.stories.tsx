import type { Meta, StoryObj } from '@storybook/react';

import ImageCell from './ImageCell';
import { DUMMY_USER, createCellStoryRender } from '../../Table.storybook.utils';

const meta: Meta<typeof ImageCell> = {
	title: 'Components/Table/Cells/ImageCell',
	render: createCellStoryRender(ImageCell),
	component: ImageCell,
	argTypes: {
		data: {
			control: 'text'
		}
	},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof ImageCell>;

export const Example: Story = {
	args: {
		data: DUMMY_USER.avatar,
		height: 150,
		width: 150
	}
};
