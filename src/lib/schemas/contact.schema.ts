import { z } from 'zod';

export const SendContactSchema = z.object({
	name: z
		.string({
			required_error: 'Please enter your name'
		})
		.min(4, 'Longer name is required'),
	email: z
		.string({
			required_error: 'Please enter your email'
		})
		.email(),
	subject: z
		.string({
			required_error: 'Please enter your email subject'
		})
		.min(8, 'Longer title is required'),
	detail: z
		.string({
			required_error: 'Please enter your email detail'
		})
		.min(20, 'Longer detail is required')
});
