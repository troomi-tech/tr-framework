import type { Meta, StoryObj } from '@storybook/react';

import DateCell from './DateCell';
import { DUMMY_USER, createCellStoryRender } from '../../Table.storybook.utils';

const meta: Meta<typeof DateCell> = {
	title: 'Components/Table/Cells/DateCell',
	render: createCellStoryRender(DateCell),
	component: DateCell,
	argTypes: {
		data: {
			control: 'text',
			defaultValue: 'Date Data'
		}
	},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof DateCell>;

export const Example: Story = {
	args: {
		data: DUMMY_USER.createdAt
	}
};
