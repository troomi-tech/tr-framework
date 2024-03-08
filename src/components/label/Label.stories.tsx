import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import React from 'react';
import Label, { LabelProps } from './Label';
import Box from '../box/Box';
import { LabelVariants } from './LabelVariants';

const textVariants: LabelVariants[] = [
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'h1Mobile',
	'h2Mobile',
	'h3Mobile',
	'h4Mobile',
	'h5Mobile',
	'h6Mobile',
	'body1',
	'body2',
	'bodyList',
	'bodyLarge',
	'sectionHeader',
	'caption',
	'button',
	'buttonLarge',
	'title',
	'title1',
	'title1Small',
	'title2',
	'title2Small',
	'subtitle',
	'subtitle1',
	'subtitle2',
	'link1',
	'link2',
	'overline',
	'inherit',
	'none'
];

const LabelVariantTable = (props: LabelProps) => {
	return (
		<Box display="grid" gridTemplateColumns={'33% 33% 33%'} gap={'8px 48px'}>
			{textVariants.map((variant) => (
				<Label key={variant} {...props} variant={variant}>
					{variant}
				</Label>
			))}
		</Box>
	);
};

const meta: Meta<typeof Label> = {
	title: 'Components/Label',
	component: Label,
	argTypes: {
		onClick: { action: 'clicked' },
		variant: {
			control: { type: 'select' },
			options: textVariants
		}
	},
	tags: ['autodocs'],
	render: (args) => <LabelVariantTable {...args} />
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Variants: Story = {
	render: (args) => <LabelVariantTable {...args} />,
	args: {
		children: 'Label',
		variant: 'link1',
		onClick: action('clicked')
	}
};
