import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import CustomCell from './CustomCell';
import { DUMMY_USER, createCellStoryRender } from '../../Table.storybook.utils';

const meta: Meta<typeof CustomCell> = {
	title: 'Components/Table/Cells/CustomCell',
	render: createCellStoryRender(CustomCell),
	component: CustomCell,
	argTypes: {
		data: {
			control: 'text',
			defaultValue: 'Custom Data'
		}
	},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof CustomCell>;

export const Example: Story = {
	args: {
		data: DUMMY_USER.website,
		customContentHandler: (data: (typeof DUMMY_USER)['website']) => {
			return (
				<a href={data} target="_blank">
					{data}
				</a>
			);
		}
	}
};
