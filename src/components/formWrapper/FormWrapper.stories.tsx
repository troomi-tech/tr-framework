import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import FormWrapper, { FormWrapperProps } from './FormWrapper';
import Button from '../button/Button';
import FormControl from '../../form/FormControl';
import Validators from '../../form/Validators';
import LabelInput from '../input/LabelInput/LabelInput';
import useFormGroup from '../../hooks/useFormGroup';
import rsToastify from '../toast/toastify';
import { StringUtils } from '../../utils';

enum UserTypeEnum {
	SUPER_ADMIN = 'superAdmin',
	ADMIN = 'admin',
	USER = 'user',
	GUEST = 'guest'
}

const FormWrapperStory = (props: FormWrapperProps) => {
	const [formGroup, updateFormGroup] = useFormGroup({
		firstName: new FormControl<string>('', Validators.REQ(), Validators.CHAR()),
		lastName: new FormControl<string>('', Validators.CHAR()),
		phone: new FormControl<string>('1234567890', Validators.REQ(), Validators.PHONE()),
		email: new FormControl<string>('', Validators.REQ(), Validators.EMAIL()),
		age: new FormControl<number | undefined>(
			undefined,
			Validators.REQ(),
			Validators.NUM(),
			Validators.MIN_VALUE(18, 'Users Must by at least 18 years of age'),
			Validators.MAX_VALUE(100, 'Invalid age'),
			Validators.CUSTOM((value) => value !== 69, 'Nice')
		),
		userType: new FormControl<UserTypeEnum>(UserTypeEnum.USER, Validators.REQ()),
		favoriteColors: new FormControl<string[]>([], Validators.REQ()),
		isDeviceOn: new FormControl<boolean>(false),
		mostHatedNumber: new FormControl<number | undefined>(undefined),
		hasAgreedToTerms: new FormControl<boolean>(false, Validators.REQ()),
		hasAgreedToNewsletter: new FormControl<boolean>(true)
	});

	function handleSubmit() {
		const isValid = formGroup.isValid;
		formGroup.isTouched = true;
		updateFormGroup(formGroup);
		if (!isValid) return;
		if (!!props.onSubmit) props.onSubmit();
	}

	return (
		<FormWrapper {...props} onSubmit={handleSubmit}>
			<LabelInput
				type="text"
				label={'First Name'}
				placeholder="First Name"
				autocomplete="given-name"
				control={formGroup.controls.firstName}
				onControlUpdate={updateFormGroup}
			/>
			<LabelInput
				label="Last Name"
				placeholder="Last Name"
				autocomplete="family-name"
				control={formGroup.controls.lastName}
				onControlUpdate={updateFormGroup}
				type="text"
			/>
			<LabelInput
				label="Phone Number"
				placeholder="Phone Number"
				autocomplete="tel-national"
				control={formGroup.controls.phone}
				onControlUpdate={updateFormGroup}
				beforeUpdate={StringUtils.formatPhoneNumber}
				type="tel"
			/>
			<LabelInput
				label="Email"
				placeholder="Email"
				autocomplete="email"
				control={formGroup.controls.email}
				onControlUpdate={updateFormGroup}
				type="email"
			/>
			<LabelInput
				label="Age"
				placeholder="Age"
				autocomplete="on"
				control={formGroup.controls.age}
				onControlUpdate={updateFormGroup}
				type="number"
			/>
			<LabelInput
				label="User Type"
				placeholder="User Type"
				control={formGroup.controls.userType}
				onControlUpdate={updateFormGroup}
				type="select"
				options={[
					{ label: 'Super Admin', value: UserTypeEnum.SUPER_ADMIN },
					{ label: 'Admin', value: UserTypeEnum.ADMIN },
					{ label: 'User', value: UserTypeEnum.USER },
					{ label: 'Guest', value: UserTypeEnum.GUEST }
				]}
			/>
			<LabelInput
				label="Favorite Colors"
				placeholder="Favorite Colors"
				control={formGroup.controls.favoriteColors}
				isCreatable
				onControlUpdate={updateFormGroup}
				type="select"
				options={['Red', 'Green', 'Blue', 'Yellow']}
				isMulti
			/>
			<LabelInput
				label="My device is currently:"
				control={formGroup.controls.isDeviceOn}
				onControlUpdate={updateFormGroup}
				type="switch"
			/>
			<LabelInput
				label="Which number is the worst?"
				control={formGroup.controls.mostHatedNumber}
				onControlUpdate={updateFormGroup}
				options={[
					{ label: '1', value: 1 },
					{ label: '3', value: 3 },
					{ label: '5', value: 5 },
					{ label: '7', value: 7 },
					{ label: '9', value: 9 }
				]}
				type="radioGroup"
			/>
			<LabelInput
				label="Agreed to Terms"
				control={formGroup.controls.hasAgreedToTerms}
				onControlUpdate={updateFormGroup}
				type="checkbox"
			/>
			<LabelInput
				label="Receive Newsletter"
				control={formGroup.controls.hasAgreedToNewsletter}
				onControlUpdate={updateFormGroup}
				type="checkbox"
			/>
			<Button look="containedPrimary" type="submit">
				Submit
			</Button>
		</FormWrapper>
	);
};

const meta: Meta<typeof FormWrapper> = {
	title: 'Components/FormWrapper',
	component: FormWrapper,
	render: (args) => <FormWrapperStory {...args} />,
	argTypes: {},
	tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof FormWrapper>;

export const Default: Story = {
	args: {
		onSubmit: () => rsToastify.success('Form Submitted!')
	}
};
