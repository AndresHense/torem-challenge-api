import { buildSchema } from 'graphql';

export default buildSchema(`
    type User {
        userId: ID!
	    name: String!
	    lastName: String!
	    email: String!
	    password: String!
	    image: String!
	    chats: [Chat!]!
    }

    type Chat {
        chatId: ID!
        name: String!
        image: String!
        messages: [Message!]!
    }

    type Message {
        messageId: ID!
        message: String!
        timeDate: String!
        received: Boolean!
    }

    type RootQuery {
        filterMessages(userId: ID!, chatId: ID!, filter: String!): [Message]!
    }

    schema {
        query: RootQuery
    }

`);
