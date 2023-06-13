import { z } from 'zod';

export const CreateSessionSchema = z
	.object({
		is_private: z.boolean({
			required_error: "Session's privacvy is required!"
		}),
		type: z.string({
			required_error: 'Music type is required!'
		}),
		password: z.string(),
		name: z
			.string({
				required_error: 'Session name is required!'
			})
			.min(6, 'Session name is too short!')
			.max(50, 'Session name is too long!')
	})
	.superRefine(({ is_private, password }, ctx) => {
		if (is_private) {
			ctx.addIssue({
				code: 'custom',
				path: ['password'],
				message: 'Password is required!'
			});

			if (password.length < 6) {
				ctx.addIssue({
					code: 'custom',
					path: ['password'],
					message: 'Password is too short!'
				});
			} else if (password.length > 40) {
				ctx.addIssue({
					code: 'custom',
					path: ['password'],
					message: 'Password is too long!'
				});
			}
		}
	});
