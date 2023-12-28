import { useState } from 'react';
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

import {
	HydrationBoundary,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query';

import { useDehydratedState } from 'use-dehydrated-state';
import { getPublicKeys } from '~/env/env.server';
import { PublicEnv } from '~/env/public-env';

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

	return typedjson({ contacts, q, publicKeys: getPublicKeys().publicKeys });
};

export const action = async () => {
	const contact = await createEmptyContact();
	return typedjson({ contact });
};

export default function App() {
	const { contacts, q, publicKeys } = useTypedLoaderData<typeof loader>();

	const navigation = useNavigation();

	const searching =
		navigation.location &&
		new URLSearchParams(navigation.location.search).has('q');

	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// With SSR, we usually want to set some default staleTime
						// above 0 to avoid refetching immediately on the client
						staleTime: 60 * 1000,
					},
				},
			})
	);

	const dehydratedState = useDehydratedState();

	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<PublicEnv {...publicKeys} />
				<QueryClientProvider client={queryClient}>
					<HydrationBoundary state={dehydratedState}>
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
					</HydrationBoundary>
				</QueryClientProvider>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
