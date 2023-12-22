import type { MetaFunction, LinksFunction } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useNavigation,
} from '@remix-run/react';

import appStylesHref from './app.css';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';

import Sidebar from '~/components/sidebar';
import { createEmptyContact, getContacts } from '~/data';

export const links: LinksFunction = () => [
	{ rel: 'stylesheet', href: appStylesHref },
];

export const meta: MetaFunction = () => [
	{
		charset: 'utf-8',
		title: 'New Remix App',
		viewport: 'width=device-width,initial-scale=1',
	},
];

// existing imports & exports
export const loader = async ({ request }: LoaderFunctionArgs) => {
	const url = new URL(request.url);
	const q = url.searchParams.get('q');

	const contacts = await getContacts(q);
	return typedjson({ contacts, q });
};

export const action = async () => {
	const contact = await createEmptyContact();
	return typedjson({ contact });
};

export default function App() {
	const { contacts, q } = useTypedLoaderData<typeof loader>();

	const navigation = useNavigation();

	const searching =
		navigation.location &&
		new URLSearchParams(navigation.location.search).has('q');

	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<Sidebar
					contacts={contacts}
					q={q}
				/>
				<main
					id="detail"
					className={
						navigation.state === 'loading' && !searching ? 'loading' : ''
					}>
					<Outlet />
				</main>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
