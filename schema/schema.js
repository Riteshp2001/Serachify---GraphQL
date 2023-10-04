const graphql = require("graphql");
const _ = require("lodash");

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLInt } = graphql;

//dummy data
var books = [
	{ name: "Name of the Wind", genre: "Fantasy", id: "1" },
	{ name: "The Final Empire", genre: "Fantasy", id: "2" },
	{ name: "The Long Earth", genre: "Sci-Fi", id: "3" },
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
	}),
});

const AuthorType = new GraphQLObjectType({
	name: "Author",
	fields: () => ({
		//keeps order of the search
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
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
			},
		},
		book: {
			type: AuthorType,
			args: {
				id: { type: GraphQLID },
			},
			resolve(parent, args) {
				//code to get data from db / other source
				return _.find(authors, { id: args.id });
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: rootQuery,
});
