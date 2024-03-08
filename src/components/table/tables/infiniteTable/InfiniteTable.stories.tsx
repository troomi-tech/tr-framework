import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import InfScrollTable from './InfiniteTable';
import { fetchUsers } from '../../Table.storybook.utils';

const meta: Meta<typeof InfScrollTable> = {
	title: 'Components/Table/InfiniteTable',
	component: InfScrollTable,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof InfScrollTable>;

export const InfiniteTable: Story = {
	args: {
		onGetData: async ({ pagination }) => (await fetchUsers(pagination.page, pagination.perPage)).data,
		perPage: 3,
		total: 'auto',
		columns: [
			{
				label: 'ID',
				accessor: 'id',
				cellType: 'text'
			},
			{
				label: ' Username',
				accessor: 'username',
				cellType: 'text'
			},
			{
				label: 'Email',
				accessor: 'email',
				cellType: 'button',
				onButtonClick: action('buttonClick')
			},
			{
				label: 'Phone',
				accessor: 'phone',
				cellType: 'text'
			},
			{
				label: 'Website',
				accessor: 'website',
				cellType: 'text'
			},
			{
				label: 'Company',
				accessor: 'company.name',
				cellType: 'text'
			}
		]
	}
};
