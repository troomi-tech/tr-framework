import React, { CSSProperties, useEffect } from 'react';
import './Switch.scss';
import ErrorMessage from '../errorMessage/ErrorMessage';
import { RequiredValidator } from '../../../../form/Validators';
import { InputControlProps } from '../../input.types';
import useInputControl from '../../../../hooks/useInputControl';

export type SwitchControlValues = boolean;

export interface SwitchProps extends InputControlProps<SwitchControlValues> {
	/* ~~~~~~ Basic ~~~~~~ */

	/** The className of the switch. Will always contain `rsSwitch` and `rsInput`. */
	className?: string;
	/** The id of the switch */
	id?: string;

	/* ~~~~~~ Advanced ~~~~~~ */

	/** The name for the switch @default control.key */
	name?: string;
	/** The text to display inside the switch when it is on @default 'ON' */
	innerTextOn?: string | 'NONE';
	/** The text to display inside the switch when it is off @default 'OFF' */
	innerTextOff?: string | 'NONE';

	/* ~~~~~~ Styling ~~~~~~ */

	/** The background color of the switch when it is on */
	backgroundColorOn?: CSSProperties['backgroundColor'];
	/** The background color of the switch when it is off */
	backgroundColorOff?: CSSProperties['backgroundColor'];
	/** The text color of the switch when it is on */
	textColorOn?: CSSProperties['color'];
	/** The text color of the switch when it is off */
	textColorOff?: CSSProperties['color'];
	/** The style object of the switch */
	style?: CSSProperties;
}

const Switch: React.FC<SwitchProps> = (props) => {
	const [control, updateControl] = useInputControl<SwitchControlValues>(props);
	const {
		name = control.formKey,
		innerTextOff = 'OFF',
		innerTextOn = 'ON',
		backgroundColorOff,
		backgroundColorOn,
		textColorOff,
		textColorOn,
		className,
		style,
		id
	} = props;

	const isOn = !!control.value;
	const isInvalid = !control.isValid;
	const isRequired = control.has(RequiredValidator);
	const ref = React.useRef<HTMLInputElement>(null);

	useEffect(() => {
		const target = ref.current;
		if (!target) return;
		const filteredOnInnerText = innerTextOn === 'NONE' ? '' : innerTextOn;
		const filteredOffInnerText = innerTextOff === 'NONE' ? '' : innerTextOff;

		target.style.setProperty('--_switchOnText', `"${filteredOnInnerText}"`);
		target.style.setProperty('--_switchOffText', `"${filteredOffInnerText}"`);
	}, [innerTextOn, innerTextOff]);

	function handleBlur() {
		updateControl((prev) => {
			prev.isTouched = true;
			return prev;
		});
	}

	async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const target = event.target;
		const targetValue = target.checked;

		const updatedValue = updateControl((prev) => {
			prev.value = targetValue;
			return prev;
		}).value;

		target.checked = updatedValue;
	}

	function getStyle() {
		const styles: CSSProperties = {};
		styles.backgroundColor = isOn ? backgroundColorOn : backgroundColorOff;
		styles.color = isOn ? textColorOn : textColorOff;

		return { ...styles, ...style };
	}

	function getClassName() {
		const classes = ['rsSwitch'];
		if (!!className) classes.push(className);
		if (isInvalid) classes.push('error');
		if (isOn) classes.push('on');
		else classes.push('off');

		return classes.join(' ');
	}

	return (
		<>
			<input
				role="switch"
				type="checkbox"
				className={getClassName()}
				onChange={handleChange}
				onBlur={handleBlur}
				style={getStyle()}
				checked={isOn}
				name={name}
				ref={ref}
				id={id}
				aria-errormessage={control.errors[0]}
				aria-invalid={!control.isValid}
				aria-required={isRequired}
			/>
			<ErrorMessage control={control} />
		</>
	);
};

export default Switch;
