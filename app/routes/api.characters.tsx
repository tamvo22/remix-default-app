import { typedjson } from 'remix-typedjson';
import { useGetCharactersQuery } from '~/gql';
import { QueryClient, dehydrate } from '@tanstack/react-query';

import { graphQLClient } from '~/gql/graphql';

export const loader = async () => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: useGetCharactersQuery.getKey(),
		queryFn: useGetCharactersQuery.fetcher(graphQLClient),
	});

	queryClient.clear();

	return typedjson({ dehydratedState: dehydrate(queryClient) });
};
