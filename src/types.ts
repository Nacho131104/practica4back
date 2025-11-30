import { ObjectId } from "mongodb"

export type User={
    _id:ObjectId,
    name:string,
    email:string
    password:string
}

export type Post={
    _id:string,
    titulo:string,
    contenido:string,
    autor:string,
    fecha:Date
}

export type TokenPayload = {
    userId: string;
}


