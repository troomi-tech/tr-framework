import type { Meta, StoryObj } from '@storybook/react';

import InputCell from './InputCell';
import { DUMMY_USER, createCellStoryRender } from '../../Table.storybook.utils';

const meta: Meta<typeof InputCell> = {
	title: 'Components/Table/Cells/InputCell',
	render: createCellStoryRender(InputCell),
	component: InputCell,
	argTypes: {
		data: {
			control: 'text',
			defaultValue: '456-444-4444'
		}
	},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof InputCell>;

export const Example: Story = {
	args: {
		data: DUMMY_USER.phone
	}
};
