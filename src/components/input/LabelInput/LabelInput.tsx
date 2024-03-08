import React, { CSSProperties } from 'react';
import './LabelInput.scss';
import Label, { LabelProps } from '../../label/Label';
import Input, { InputProps } from '../Input';
import FormControl from '../../../form/FormControl';
import { RequiredValidator } from '../../../form';

export type LabelInputSharedProps = {
	/* ~~~~~~ Required ~~~~~~ */

	/** The label the display above the input */
	label: string;

	/* ~~~~~~ Basic ~~~~~~ */

	/** The class name of the component will always contain 'rsLabelInput' */
	className?: string;
	/** The id of the component */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** The placement of the label @default 'top' */
	placement?: 'top' | 'left' | 'right' | 'bottom';
	/** The placement of the required asterisk @default 'right' */
	requiredPlacement?: 'top' | 'left' | 'right' | 'bottom';
	/** The variant of the label @default 'title1' */
	variant?: LabelProps['variant'];
	/** Content to be displayed with the label */
	subLabel?: React.ReactNode;
	/** If set, will display an info icon that will open a popup
	 *  with the given title and description */
	// infoPopup?: TitleDescPopupProps;

	/* ~~~~~~ Styling ~~~~~~ */

	/** The flex-grow CSS property sets the flex grow factor of a flex item main size */
	flexGrow?: CSSProperties['flexGrow'];
	/** The flex-shrink CSS property sets the flex shrink factor of a flex item main size */
	flexShrink?: CSSProperties['flexShrink'];
	/** The flex-basis CSS property sets the initial main size of a flex item */
	flexBasis?: CSSProperties['flexBasis'];
	/** The CSS style object */
	style?: CSSProperties;
};

export type LabelInputProps = LabelInputSharedProps & InputProps;

const LabelInput: React.FC<LabelInputProps> = (props) => {
	const {
		requiredPlacement = 'right',
		variant = 'title1',
		placement = 'top',
		flexShrink,
		className,
		flexBasis,
		flexGrow,
		subLabel,
		style,
		label,
		id,
		...inputProps
	} = props;
	const inputControl = inputProps.control as FormControl;
	const isRequired = inputControl.has(RequiredValidator);

	function getClassName() {
		const classes = ['rsLabelInput'];
		if (!!className) classes.push(className);
		if (!!placement) classes.push(placement);
		if (inputProps.type === 'checkbox') classes.push('checkbox');
		else if (inputProps.type === 'switch') classes.push('switch');
		else if (inputProps.type === 'select') classes.push('select');
		else if (inputProps.type === 'number') classes.push('number');
		else if (inputProps.type === 'radioGroup') classes.push('radioGroup');
		else classes.push('text');

		return classes.join(' ');
	}

	function getLabelClassName() {
		const classes = ['inputLabel'];
		if (!!requiredPlacement) classes.push(requiredPlacement);

		return classes.join(' ');
	}

	function getStyle() {
		const styles: CSSProperties = {};
		if (!!flexBasis) styles.flexBasis = flexBasis;
		if (!!flexGrow) styles.flexGrow = flexGrow;
		if (!!flexShrink) styles.flexShrink = flexShrink;

		return { ...styles, ...style };
	}

	function renderRequiredAsterisk() {
		if (!isRequired) return null;
		const classes = ['requiredAsterisk'];
		if (!!requiredPlacement) classes.push(requiredPlacement);

		return (
			<Label variant={'body2'} className={classes.join(' ')}>
				*required
			</Label>
		);
	}

	return (
		<div className={getClassName()} style={getStyle()} id={id}>
			<Label variant={variant} id={id && `${id}Label`} className={getLabelClassName()}>
				{label}
				{/* {!!infoPopup && (
					<Icon
						className={'infoBtn'}
						iconImg={'icon-solid-info-circle'}
						size={12}
						color={'#856EAF'}
						onClick={() => {
							popupController.open<TitleDescPopupProps>(TitleDescPopup, {
								title: infoPopup.infoPopupTitle,
								description: infoPopup.infoPopupDesc
							});
						}}
					/>
				)} */}
				{renderRequiredAsterisk()}
				{subLabel}
			</Label>
			<Input {...(inputProps as InputProps)} />
		</div>
	);
};

export default LabelInput;
