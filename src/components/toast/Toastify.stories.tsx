import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import ToastMessage, { ToastContainer, ToastMessageProps } from './toastMessage/ToastMessage';
import rsToastify, { ToastifyOptions } from './toastify';
import Button from '../button/Button';
import 'react-toastify/dist/ReactToastify.minimal.css';
import { TROOMI_COLORS } from '../../utils/constants';

type ToastifyRenderProps = Pick<ToastMessageProps, 'message' | 'title' | 'type'> & ToastifyOptions;

const ToastifyRender = (props: ToastifyRenderProps) => {
	const { type, message, title, ...toastifyOptions } = props;

	function handleClick() {
		switch (type) {
			case 'info':
				return rsToastify.info(message, title, toastifyOptions);
			case 'success':
				return rsToastify.success(message, title, toastifyOptions);
			case 'warning':
				return rsToastify.warning(message, title, toastifyOptions);
			case 'error':
				return rsToastify.error(message, title, toastifyOptions);
			case 'custom':
				return rsToastify.custom(message, title, toastifyOptions);
		}
	}

	function getButtonStyle(): React.CSSProperties {
		const styles: React.CSSProperties = {
			transition: 'all .3s ease',
			boxShadow: '0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)',
			outline: '4px solid transparent',
			minWidth: '500px'
		};

		switch (type) {
			case 'info':
				styles.backgroundColor = TROOMI_COLORS.$infoBackgroundColor;
				styles.color = TROOMI_COLORS.$infoMainColor;
				styles.outlineColor = TROOMI_COLORS.$infoMainColor;
				break;
			case 'success':
				styles.backgroundColor = TROOMI_COLORS.$successBackgroundColor;
				styles.color = TROOMI_COLORS.$successMainColor;
				styles.outlineColor = TROOMI_COLORS.$successMainColor;
				break;
			case 'warning':
				styles.backgroundColor = TROOMI_COLORS.$warningBackgroundColor;
				styles.color = TROOMI_COLORS.$warningMainColor;
				styles.outlineColor = TROOMI_COLORS.$warningMainColor;
				break;
			case 'error':
				styles.backgroundColor = TROOMI_COLORS.$errorBackgroundColor;
				styles.color = TROOMI_COLORS.$errorMainColor;
				styles.outlineColor = TROOMI_COLORS.$errorMainColor;
				break;
			case 'custom':
				styles.backgroundColor = TROOMI_COLORS.$white;
				styles.color = TROOMI_COLORS.$primaryTextColor;
				styles.outlineColor = TROOMI_COLORS.$primaryTextColor;
				break;
		}

		return styles;
	}

	function renderContainer() {
		// Check if there is a container already rendered.
		const container = document.querySelector('.Toastify');
		if (!!container) return;

		return (
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				rtl={false}
				pauseOnFocusLoss
				pauseOnHover
				closeOnClick
				draggable
			/>
		);
	}

	return (
		<>
			{renderContainer()}
			<Button style={getButtonStyle()} onClick={handleClick} look="containedPrimary">
				Toast {type}
			</Button>
		</>
	);
};

const meta: Meta<ToastifyRenderProps> = {
	title: 'Components/Toasts',
	render: ToastifyRender,
	argTypes: {
		type: {
			description: 'The type of the toast',
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'custom']
		},
		message: { description: 'The message of the toast', control: 'text' },
		title: { description: 'The title of the toast', control: 'text' },
		autoClose: {
			description:
				'Set the delay in ms to close the toast automatically. Use false to prevent the toast from closing.',
			defaultValue: 5000,
			control: 'number'
		},
		delay: { description: 'Add a delay in ms before the toast appear.', control: 'number' },
		closeButton: {
			description: 'Pass a custom close button. To remove the close button pass false',
			defaultValue: false,
			control: 'boolean'
		},
		hideProgressBar: { description: 'Hide or show the progress bar.', defaultValue: false, control: 'boolean' },
		draggable: { description: 'Allow toast to be draggable.', defaultValue: true, control: 'boolean' },
		pauseOnHover: {
			description: 'Pause the timer when the mouse hover the toast.',
			defaultValue: true,
			control: 'boolean'
		},
		closeOnClick: { description: 'Remove the toast when clicked.', defaultValue: true, control: 'boolean' },
		position: {
			description: `Set the default position to use. One of: 'top-right', 'top-center', 'top-left', 
			'bottom-right', 'bottom-center', 'bottom-left' Default: 'top-right'`,
			defaultValue: 'top-right',
			control: 'select',
			options: ['top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left']
		},
		progress: {
			description: 'Set the percentage for the controlled progress bar. Value must be between 0 and 1.',
			control: {
				type: 'range',
				min: 0,
				max: 1,
				step: 0.1
			}
		},
		draggableDirection: {
			description: 'Specify in which direction should you swipe to dismiss the toast',
			defaultValue: 'x',
			control: 'select',
			options: ['x', 'y']
		}
	},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof ToastMessage>;

export const Success: Story = {
	args: {
		message: 'lorem ipsum dolor sit amet consectetur adipisicing elit.',
		type: 'success'
	}
};

export const Info: Story = {
	args: {
		message: 'lorem ipsum dolor sit amet consectetur adipisicing elit.',
		type: 'info'
	}
};

export const Warning: Story = {
	args: {
		message: 'lorem ipsum dolor sit amet consectetur adipisicing elit.',
		type: 'warning'
	}
};

export const Error: Story = {
	args: {
		message: 'lorem ipsum dolor sit amet consectetur adipisicing elit.',
		type: 'error'
	}
};

export const Custom: Story = {
	args: {
		message: 'lorem ipsum dolor sit amet consectetur adipisicing elit.',
		type: 'custom'
	}
};
