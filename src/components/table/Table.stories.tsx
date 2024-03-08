import type { Meta, StoryObj } from '@storybook/react';

import Table from './Table';
import { STATIC_DATA, fetchUsers, COLUMN_DETAIL_ARRAY } from './Table.storybook.utils';

const meta: Meta<typeof Table> = {
	title: 'Components/Table/Table',
	component: Table,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof Table>;

export const StaticTable: Story = {
	args: {
		type: 'static',
		columns: COLUMN_DETAIL_ARRAY,
		data: STATIC_DATA
	}
};

export const InfiniteTable: Story = {
	args: {
		type: 'infinite-scroll',
		onGetData: async ({ pagination }) => (await fetchUsers(pagination.page, pagination.perPage)).data,
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
				cellType: 'text'
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

export const PaginationTable: Story = {
	args: {
		type: 'pagination',
		onGetData: async ({ pagination }) => (await fetchUsers(pagination.page, pagination.perPage)).data,
		total: async () => (await fetchUsers(0, 0)).total,
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
				cellType: 'text'
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
