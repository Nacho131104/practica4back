import { gql } from 'apollo-server';

export const typeDefs = gql`

    type User{
        _id:ID!
        email: String!
        name: String!
        password: String
    }

    type Post{
        _id: ID
        titulo:String
        contenido:String
        autor:String
        fechaCreada:String
    }

    type Query {

        me: User
        getPost: [Post]!
        getPostID(id:ID!): Post
    }

    type Mutation {
    
        register(email: String!, password: String!) : String!

        login(email: String!, password: String!) : String!

        addPost(titulo:String!, contenido:String!, fecha:String!): Post!

        updatePost(_id:ID!, titulo:String, contenido:String, autor:String, fecha:String): Post

        deletePost ( _id:ID!): Boolean

    }

`;