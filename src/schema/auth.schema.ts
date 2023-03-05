import { string, object } from 'yup';

export const LoginValidationSchema = object({
	password: string().required('Password is required'),
	email: string().email('This is not a valid email').required('Email is required')
});

export const SignupValidationSchema = object({
	passwordConfirm: string()
		.required('Confirm password is required')
		.test('Confirm password must match with password', (val, ctx) => {
			if (val && val === ctx.parent.password) {
				return true;
			}

			return false;
		}),
	password: string().required('Password is required').min(10, 'Password is too short'),
	email: string().email('This is not a valid email').required('Email is required')
});
