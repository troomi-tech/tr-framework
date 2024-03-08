import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import TableRow from './TableRow';
import { COLUMN_DETAIL_ARRAY, STATIC_DATA } from '../../Table.storybook.utils';

const meta: Meta<typeof TableRow> = {
	title: 'Components/Table/Pieces/TableRow',
	component: TableRow,
	render: (props) => (
		<table>
			<tbody>
				<TableRow {...props} />
			</tbody>
		</table>
	),
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof TableRow>;

export const Default: Story = {
	args: {
		data: STATIC_DATA[0],
		columns: COLUMN_DETAIL_ARRAY
	}
};
