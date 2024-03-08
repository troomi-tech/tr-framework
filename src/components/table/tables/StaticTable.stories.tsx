import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import StaticTable from './StaticTable';
import { STATIC_DATA } from '../Table.storybook.utils';
import rsToastify from '../../toast/toastify';
import { StringUtils } from '../../../utils';

const meta: Meta<typeof StaticTable> = {
	title: 'Components/Table/StaticTable',
	component: StaticTable,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof StaticTable>;

export const Example: Story = {
	args: {
		data: STATIC_DATA,
		onRowClick: undefined,
		onCellClick: undefined,
		columns: [
			{
				label: 'ID',
				accessor: 'id',
				cellType: 'text',
				align: 'center',
				onClick: (data, columnIndex, rowIndex) => {
					console.log(data, columnIndex, rowIndex);
					const rowDetail = STATIC_DATA.find((row) => row.id === data);
					if (!rowDetail) return;
					StringUtils.copyToClipboard(JSON.stringify(rowDetail));
					rsToastify.info(`Copied ${rowDetail.username}'s data to clipboard`, 'Copied to clipboard');
				}
			},
			{
				label: 'Username',
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
				beforeUpdate: (value) => {
					const valueToNumber = StringUtils.removeNonNumeric(value);
					if (StringUtils.validateNumberLength(valueToNumber, 10))
						return StringUtils.formatPhoneNumber(valueToNumber);
					return valueToNumber;
				},
				debounceDelay: 0
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
