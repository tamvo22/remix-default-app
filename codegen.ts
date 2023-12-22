import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	overwrite: true,
	schema: 'https://rickandmortyapi.com/graphql',
	documents: 'app/gql/*.ts',
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
				namingConvention: 'change-case-all#camelCase',
				declarationKind: 'interface',
				noNamespaces: true,
				pureMagicComment: true,
				exposeQueryKeys: true,
				exposeFetcher: true,
				withHooks: true,
				withComponent: true,
				fetcher: 'graphql-request',
			},
		},
	},
};

export default config;
