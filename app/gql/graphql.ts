import { GraphQLClient } from 'graphql-request';
import { getPublicEnv } from '~/env/public-env';

export const graphQLClient = new GraphQLClient(getPublicEnv('SCHEMA_URL'));
