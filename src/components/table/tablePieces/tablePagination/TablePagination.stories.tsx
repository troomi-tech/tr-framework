import type { Meta, StoryObj } from '@storybook/react';

import TablePagination from './TablePagination';

const meta: Meta<typeof TablePagination> = {
	title: 'Components/Table/Pieces/TablePagination',
	component: TablePagination,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof TablePagination>;

export const Default: Story = {
	args: {
		total: 100
	}
};
