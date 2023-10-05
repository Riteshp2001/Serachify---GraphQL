const graphql = require("graphql");
const _ = require("lodash");

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLList } = graphql;

//dummy data
var books = [
	{ name: "Name of the Wind", genre: "Fantasy", id: "1", authorId: "1" },
	{ name: "The Final Empire", genre: "Fantasy", id: "2", authorId: "2" },
	{ name: "The Long Earth", genre: "Sci-Fi", id: "3", authorId: "3" },
	{ name: "The Hero of Ages", genre: "Fantasy", id: "4", authorId: "2" },
	{ name: "The Colour of Magic", genre: "Fantasy", id: "5", authorId: "3" },
	{ name: "The Light Fantastic", genre: "Fantasy", id: "6", authorId: "3" },
];

var authors = [
	{ name: "Patrick Rothfuss", age: 44, id: "1" },
	{ name: "Brandon Sanderson", age: 42, id: "2" },
	{ name: "Terry Pratchett", age: 66, id: "3" },
];

const BookType = new GraphQLObjectType({
	name: "Book",
	fields: () => ({
		//keeps order of the search
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve(parent, args) {
				return _.find(author, { id: parent.authorId });
			},
		},
	}),
});

const AuthorType = new GraphQLObjectType({
	name: "Author",
	fields: () => ({
		//keeps order of the search
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return _.filter(books, { authorId: parent.id });
			},
		},
	}),
});

const rootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		//doesnt keep order
		book: {
			type: BookType,
			args: {
				id: { type: GraphQLID },
			},
			resolve(parent, args) {
				//code to get data from db / other source
				return _.find(books, { id: args.id });
			}, //return books iwth specified id
		},
		author: {
			type: AuthorType,
			args: {
				id: { type: GraphQLID },
			},
			resolve(parent, args) {
				//code to get data from db / other source
				return _.find(authors, { id: args.id });
			},
		},
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				return books;
			}, //return all boooks
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve(parent, args) {
				return authors;
			}, //return all boooks
		},
	},
});

module.exports = new GraphQLSchema({
	query: rootQuery,
});
