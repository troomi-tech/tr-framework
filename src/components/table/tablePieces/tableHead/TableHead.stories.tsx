import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import TableHead from './TableHead';
import { COLUMN_DETAIL_ARRAY } from '../../Table.storybook.utils';

const meta: Meta<typeof TableHead> = {
	title: 'Components/Table/Pieces/TableHead',
	component: TableHead,
	render: (props) => (
		<table>
			<TableHead {...props} />
		</table>
	),
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof TableHead>;

export const Default: Story = {
	args: {
		columns: COLUMN_DETAIL_ARRAY
	}
};
