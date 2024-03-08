import type { Meta, StoryObj } from '@storybook/react';

import TextCell from './TextCell';
import { DUMMY_USER, createCellStoryRender } from '../../Table.storybook.utils';

const meta: Meta<typeof TextCell> = {
	title: 'Components/Table/Cells/TextCell',
	render: createCellStoryRender(TextCell),
	component: TextCell,
	argTypes: {
		data: {
			control: 'text',
			defaultValue: 'Text Data'
		}
	},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof TextCell>;

export const Example: Story = {
	args: {
		data: DUMMY_USER.username
	}
};
