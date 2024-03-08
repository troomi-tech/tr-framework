import type { Meta, StoryObj } from '@storybook/react';

import TableSearch from './TableSearch';

const meta: Meta<typeof TableSearch> = {
	title: 'Components/Table/Pieces/TableSearch',
	component: TableSearch,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof TableSearch>;

export const Default: Story = {
	args: {
		onSearch: (value: string) => console.log(value)
	}
};
