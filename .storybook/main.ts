import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	staticDirs: [{ from: '../src/icomoon/icons', to: 'icomoon/icons' }],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-onboarding',
		'@storybook/addon-interactions'
	],
	framework: {
		name: '@storybook/react-vite',
		options: {}
	},
	docs: {
		/** We can also try automatically generated Autodocs: @link https://storybook.js.org/docs/react/writing-docs/autodocs */
		autodocs: 'tag'
	}
};
export default config;
