import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import ButtonCell from './ButtonCell';
import { DUMMY_USER, createCellStoryRender } from '../../Table.storybook.utils';

const meta: Meta<typeof ButtonCell> = {
	title: 'Components/Table/Cells/ButtonCell',
	render: createCellStoryRender(ButtonCell),
	component: ButtonCell,
	argTypes: {
		data: {
			control: 'text',
			defaultValue: 'Button Data'
		}
	},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof ButtonCell>;

export const Example: Story = {
	args: {
		data: DUMMY_USER.username,
		onButtonClick: action('onButtonClick')
	}
};
