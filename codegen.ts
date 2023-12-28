import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	overwrite: true,
	schema: process.env.SCHEMA_URL,
	documents: 'app/gql/schema/*.ts',
	emitLegacyCommonJSImports: false,
	generates: {
		'./app/gql/index.ts': {
			plugins: [
				'typescript',
				'typescript-operations',
				'typescript-react-query',
			],
			config: {
				skipTypename: true,
				pureMagicComment: true,
				exposeQueryKeys: true,
				exposeFetcher: true,
				withHooks: true,
				fetcher: 'graphql-request',
				reactQueryVersion: 5,
			},
			hooks: {
				afterOneFileWrite: ['prettier --write'],
			},
		},
	},
};

export default config;

/** 
 * Typescript error
 * 
 *  https://github.com/dotansimha/graphql-code-generator-community/pull/549

import { GraphQLClient, RequestOptions } from 'graphql-request';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];

 */
