import type { LoaderFunctionArgs } from '@remix-run/node';
import { typedjson } from 'remix-typedjson';
import invariant from 'tiny-invariant';
import { useGetCharacterQuery } from '~/gql';
import { QueryClient, dehydrate } from '@tanstack/react-query';

import { GraphQLClient } from 'graphql-request';
import { getPublicEnv } from '~/env/public-env';

export const loader = async ({ params }: LoaderFunctionArgs) => {
	invariant(params.id, 'Missing contactId param');
	const queryClient = new QueryClient();

	const graphQLClient = new GraphQLClient(getPublicEnv('SCHEMA_URL'));

	await queryClient.prefetchQuery({
		queryKey: useGetCharacterQuery.getKey({ id: params.id }),
		queryFn: useGetCharacterQuery.fetcher(graphQLClient, {
			id: params.id,
		}),
	});

	queryClient.clear();

	return typedjson({ dehydratedState: dehydrate(queryClient) });
};
