import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import TableBody from './TableBody';

const meta: Meta<typeof TableBody> = {
	title: 'Components/Table/Pieces/TableBody',
	component: TableBody,
	render: (props) => (
		<table>
			<TableBody {...props}>
				<tr>
					<td>{props.children}</td>
				</tr>
			</TableBody>
		</table>
	),
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof TableBody>;

export const Default: Story = {
	args: {
		children: 'TableBody'
	}
};
