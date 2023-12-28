import pick from 'lodash/pick';
import * as z from 'zod';

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	SCHEMA_URL: z.string().min(1),
	SESSION_SECRET: z.string().min(1),
	GOOGLE_MAPS_API_KEY: z.string().min(1),
	STRIPE_PUBLIC_KEY: z.string().min(1),
	STRIPE_SECRET_KEY: z.string().min(1),
});

const env = () => envSchema.parse(process.env);

function getPublicKeys() {
	return {
		publicKeys: pick(env(), [
			'SCHEMA_URL',
			'STRIPE_PUBLIC_KEY',
			'GOOGLE_MAPS_API_KEY',
		]),
	};
}

export { getPublicKeys, env };
