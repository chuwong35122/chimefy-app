import { superValidate } from 'sveltekit-superforms/server';
import { SendContactSchema } from '$schemas/contact.schema';

export const load = async (event) => {
	const form = await superValidate(event, SendContactSchema);
	return { form };
};
