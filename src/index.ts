import dotenv from "dotenv"
import { ApolloServer } from "apollo-server";
import { connectmongodb } from "./mongo"
import { typeDefs } from "./graph/schema";
import { resolvers } from "./graph/resolvers";
import { getUserFromToken } from "./utils/auth";

dotenv.config()


const app = async () => {
  await connectmongodb();

  const server = new ApolloServer({
    typeDefs,
    resolvers
  }
  );
  await server.listen({ port: 4000 });
  console.log("Inciado server sql");
};



app().catch(err=>console.error(err));