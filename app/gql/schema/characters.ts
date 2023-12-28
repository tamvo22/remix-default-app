import { gql } from 'graphql-request';

const fragmentCharacter = gql`
	fragment CharacterFields on Character {
		gender
		id
		image
		name
		origin {
			dimension
			name
			type
		}
		species
		status
		type
	}
`;

const getCharacterQuery = gql`
	query getCharacter($id: ID!) {
		character(id: $id) {
			...CharacterFields
		}
	}

	${fragmentCharacter}
`;

const getCharactersQuery = gql`
	fragment GetCharactersFields on Characters {
		results {
			...CharacterFields
		}
	}

	query getCharacters($page: Int) {
		characters(page: $page) {
			...GetCharactersFields
		}
	}

	${fragmentCharacter}
`;
