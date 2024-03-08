import type { Meta, StoryObj } from '@storybook/react';

import PaginationTable from './PaginationTable';
import { action } from '@storybook/addon-actions';
import { fetchUsers } from '../../Table.storybook.utils';

const meta: Meta<typeof PaginationTable> = {
	title: 'Components/Table/PaginationTable',
	component: PaginationTable,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof PaginationTable>;

export const Example: Story = {
	args: {
		onGetData: async ({ pagination }) => (await fetchUsers(pagination.page, pagination.perPage)).data,
		total: async () => (await fetchUsers(1, 1)).total,
		perPage: 3,
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
				cellType: 'input',
				onControlUpdate: action('updateControl'),
				debounceDelay: 500
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
