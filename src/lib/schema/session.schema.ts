import { string, object, boolean } from 'yup';

export const CreateSessionSchema = object({
	is_private: boolean().required('is_private is required!'),
	type: string().required('Music type is required!'),
	password: string().when('is_private', {
		is: true,
		then: (schema) =>
			schema
				.required('Password is required!')
				.min(6, 'Password is too short!')
				.max(40, 'Password is too long!')
	}),
	name: string()
		.required('Session name is required!')
		.min(6, 'Session name is too short!')
		.max(50, 'Session name is too long!')
});
