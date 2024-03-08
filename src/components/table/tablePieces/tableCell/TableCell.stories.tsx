import type { Meta, StoryObj } from '@storybook/react';

import TableCell from './TableCell';
import { STATIC_DATA, createCellStoryRender } from '../../Table.storybook.utils';

const meta: Meta<typeof TableCell> = {
	title: 'Components/Table/Pieces/TableCell',
	render: createCellStoryRender(TableCell),
	component: TableCell,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof TableCell>;

export const Default: Story = {
	args: {
		cellType: 'text',
		data: STATIC_DATA[0].username
	}
};
