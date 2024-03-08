import React from 'react';
import './ToastMessage.scss';
import Label from '../../label/Label';
import Icon, { IconProps } from '../../icon/Icon';
import Box from '../../box/Box';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export type ToastifyTypes = 'info' | 'success' | 'warning' | 'error' | 'custom';
export type ToastIconMap = Record<ToastifyTypes, IconProps['iconImg']>;

export interface ToastMessageProps {
	/** The message of the toast */
	message: string;
	/** The type of the toast */
	type: ToastifyTypes;
	/** The icons to use for the toast */
	icons: ToastIconMap;
	/** The title of the toast */
	title: string;
}

const ToastMessage: React.FC<ToastMessageProps> = (props) => {
	const { message, type, icons, title } = props;

	function getClassName() {
		const classes = ['rsToastMessage', type];

		return classes.join(' ');
	}
	function renderIcon() {
		const iconProps: Omit<IconProps, 'iconImg'> = {
			size: 24
		};

		switch (type) {
			case 'info':
				return <Icon {...iconProps} iconImg={icons.info} />;
			case 'success':
				return <Icon {...iconProps} iconImg={icons.success} size={16} />;
			case 'warning':
				return <Icon {...iconProps} iconImg={icons.warning} />;
			case 'error':
				return <Icon {...iconProps} iconImg={icons.error} />;
			case 'custom':
				return <Icon {...iconProps} iconImg={icons.custom} />;
		}
	}

	return (
		<Box className={getClassName()} display={'flex'} alignItems={'center'}>
			{renderIcon()}
			<Box marginLeft={16}>
				<Label variant={'title1'}>{title}</Label>
				<Label variant={'body2'}>{message}</Label>
			</Box>
		</Box>
	);
};

export default ToastMessage;
export { ToastContainer };
