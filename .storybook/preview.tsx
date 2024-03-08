import type { Preview } from '@storybook/react';
import '../src/styles/global.scss';
import '../src/icomoon/icons/style.css';
import './preview.scss';
import { TROOMI_COLORS } from '../src/utils/constants';
import React from 'react';
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';
import { ToastContainer } from 'react-toastify';

const presetColors: { color: string; title: string }[] = [
	// Primary
	{ title: 'Primary Orange Color', color: TROOMI_COLORS.$primaryOrangeColor },
	{ title: 'Primary Purple Color', color: TROOMI_COLORS.$primaryPurpleColor },
	{ title: 'Primary Text Color', color: TROOMI_COLORS.$primaryTextColor },
	{ title: 'Primary Blue Color', color: TROOMI_COLORS.$primaryBlueColor },
	{ title: 'Primary Yellow Color', color: TROOMI_COLORS.$primaryYellowColor },
	// Bequick
	{ title: 'Bequick Purple Color', color: TROOMI_COLORS.$bequickPurpleColor },
	{ title: 'Bequick Yellow Color', color: TROOMI_COLORS.$bequickYellowColor },
	// Common
	{ title: 'White Color', color: TROOMI_COLORS.$white },
	{ title: 'Black Color', color: TROOMI_COLORS.$black },
	{ title: 'Light Gray Color', color: TROOMI_COLORS.$lightGray },
	// Text
	{ title: 'Gray Text Color', color: TROOMI_COLORS.$grayTextColor },
	{ title: 'Light Gray Text Color', color: TROOMI_COLORS.$lightGrayTextColor },
	{ title: 'Error Text Color', color: TROOMI_COLORS.$errorTextColor }
];

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: {
			presetColors: presetColors,
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/
			}
		},
		docs: {
			page: () => (
				<>
					<Title />
					<Subtitle />
					<Description />
					<Primary />
					<ToastContainer />
					<Controls />
					<Stories />
				</>
			)
		}
	}
};

export default preview;
