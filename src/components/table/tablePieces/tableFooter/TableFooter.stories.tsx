import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import TableFooter from './TableFooter';

const meta: Meta<typeof TableFooter> = {
	title: 'Components/Table/Pieces/TableFooter',
	component: TableFooter,
	render: (props) => (
		<table>
			<TableFooter {...props} />
		</table>
	),
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof TableFooter>;

export const Default: Story = {
	args: {
		children: 'TableFooter'
	}
};
