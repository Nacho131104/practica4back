
import { IResolvers } from "@graphql-tools/utils";
import { getDb } from "../mongo";
import { ObjectId } from "mongodb";
import { insertarUsuario } from "../utils/user";
import { signToken } from "../utils/auth";
import { comprobarContraseña } from "../utils/user";

export const resolvers: IResolvers = {
  Query: {
    getPost: async () => {
      const db = getDb();
      return db.collection("Posts").find().toArray();
    },
    getPostID: async (_, { id }: { id: string }) => {
      const db = getDb();
      return db.collection("Posts").findOne({ _id: new ObjectId(id) });
    },

    me: async (_, __, { user }) => {
      if (!user) return null
      console.log(user)
      return {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        password: user.password,
      }
    }
  },

  Mutation: {
    addPost: async (_, { titulo, contenido, fecha }, { user }) => {
      if (!user) {
        throw new Error("Usuario no autentificado")
      }
      const db = getDb();

      const result = await db.collection("Posts").insertOne({
        titulo,
        contenido,
        autor: user.name,
        fecha,
        userId: new ObjectId(user._id)
      });

      return {
        _id: result.insertedId,
        titulo,
        contenido,
        autor: user.name,
        fecha,
      };

    },

    updatePost: async (_,{ _id, titulo, contenido, fecha },{ user }) => {
      if (!user) {
        throw new Error("Usuario no autentificado");
      }

      const db = getDb();

      const nuevo : any = {};
      if (titulo !== undefined) nuevo.titulo = titulo;
      if (contenido !== undefined) nuevo.contenido = contenido;
      if (fecha !== undefined) nuevo.fecha = fecha;

      const result = await db.collection("Posts").updateOne(
        { _id: new ObjectId(_id), userId: new ObjectId(user._id) },
        { $set: nuevo }
      );

      if (result.matchedCount === 0) {
        throw new Error("No se encontro el post con ese id");
      }

      return await db.collection("Posts").findOne({
        _id: new ObjectId(_id),
      });
    },



    deletePost: async (_, { _id }, { user }) => {
      if (!user) {
        throw new Error("Usuario no autentificado");
      }

      const db = getDb();

      const result = await db.collection("Posts").deleteOne({
        _id: new ObjectId(_id),
        userId: new ObjectId(user._id),
      });

      if (result.deletedCount === 0) {
        throw new Error("Post no encontrado o no es tuyo");
      }

      return true;
    },



    register: async (_, { name, email, password }) => {
      const userId = await insertarUsuario(name, email, password)
      return signToken(userId)
    },

    login: async (_, { email, password }) => {
      const user = await comprobarContraseña(email, password)
      if (!user) {
        throw new Error("Credenciales incorrectas")
      }
      return signToken(user._id.toString())
    },

  },
};