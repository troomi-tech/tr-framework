import React from 'react';
import Tooltip, { TooltipMessageProps } from './TooltipMessage';
import TooltipWrapper, { TooltipWrapperProps } from '../tooltipWrapper/TooltipWrapper';

export default {
	title: 'Components/Tooltip',
	component: Tooltip,
	parameters: {
		status: 'released'
	}
};
export const Regular = (args: TooltipMessageProps) => (
	<Tooltip
		// options
		{...args}
	>
		Hover here to show tooltip
	</Tooltip>
);

Regular.args = {
	label: 'Label text'
};

export const Dark = (args: TooltipWrapperProps) => (
	<TooltipWrapper
		// options
		{...args}
	>
		<span>Click here to show tooltip</span>
	</TooltipWrapper>
);

Dark.args = {
	content: 'Label text',
	children: 'This is a helper text',
	dark: true
};

Dark.story = {
	parameters: {
		docs: {
			storyDescription: `Use the \`dark\` style as an alternative for small tooltips`
		}
	}
};

export const WithIcon = (args: TooltipWrapperProps) => (
	<TooltipWrapper
		// options
		{...args}
	>
		<span>Click here to show tooltip</span>
	</TooltipWrapper>
);

const withiconsourcecode = `
import { Button, TooltipProperties } from 'TrFramework';

function getTooltipProperties(): TooltipProperties {
	return {
		label: 'Notifications',
		look: 'standard',
		position: 'bottom',
		transition: 'flip'
	};
}

<Box className={'notificationIconContainer'} tooltipProperties={getTooltipProperties()}>
	<Label variant={'link1'}>Hover over me!</Label>
</Box>`;

WithIcon.story = {
	parameters: {
		docs: {
			storyDescription: `By using the \`createRefWrapper\` prop a html element around the trigger will be added. This is useful for components without \`forwardRef\` support.`,
			source: {
				code: withiconsourcecode
			}
		}
	}
};

WithIcon.args = {
	content: 'Label text',
	children: 'This is a helper text'
};
