import { IResolvers } from '@graphql-tools/utils';
import { ObjectId } from 'mongodb';

export const resolvers: IResolvers= {
  Query: {
    me: async (_, __, { user }) => {
      return user || null;
    },

    getPost: async (_, __, { db }) => {
      return await db.collection("Posts").find().toArray();
    },

    getPostID: async (_, { id }, { db }) => {
      return await db.collection("Posts").findOne({ _id: new ObjectId(id) });
    },
  },

  Mutation: {
    register: async (_, { email, password }, { db }) => {
      const existingUser = await db.collection("Usuarios").findOne({ email });
      if (existingUser) throw new Error('Usuario ya existe');

      const result = await db.collection('users').insertOne({ email, password });
      return result.insertedId.toString(); // o token si usas JWT
    },

    login: async (_, { email, password }, { db }) => {
      const user = await db.collection("Usuarios").findOne({ email });
      if (!user || user.password !== password) throw new Error('Credenciales inválidas');

      return user._id.toString(); // o token si usas JWT
    },

    addPost: async (_, { titulo, contenido, fecha }, { db, user }) => {
      if (!user) throw new Error('No autenticado');

      const newPost = {
        titulo,
        contenido,
        autor: user.name,
        fechaCreada: fecha,
      };

      const result = await db.collection('posts').insertOne(newPost);
      return { _id: result.insertedId, ...newPost };
    },

    updatePost: async (_, { _id, titulo, contenido, autor, fecha }, { db }) => {

      const updateFields = { titulo, contenido, autor, fecha };
      const result = await db.collection("Posts").findOneAndUpdate(
        { _id: new ObjectId(_id) },
        { $set: updateFields },
        { returnDocument: 'after' }
      );
      return result.value;
    },

    deletePost: async (_, { _id }, { db }) => {
      const result = await db.collection("Posts").deleteOne({ _id: new ObjectId(_id) });
      return result.deletedCount === 1;
    },
  },
};
