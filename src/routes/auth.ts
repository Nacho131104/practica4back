import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import { getDb } from '../mongo';
import { ObjectId } from 'mongodb';
import {TokenPayload, User}from "../types"
dotenv.config()


const SUPER_SECRETO = process.env.SECRET;




export const signToken = (userId: string) => jwt.sign({ userId }, SUPER_SECRETO!, { expiresIn: "1h" });


export const verifyToken = (token: string): TokenPayload | null => {
    try{
        return jwt.verify(token, SUPER_SECRETO!) as TokenPayload;
    }catch (err){
        return null;
    }
};

export const getUserFromToken = async (token: string) => {
    const payload = verifyToken(token);
    if(!payload) return null;
    const colleccion = getDb().collection<User>("Usuarios");
    return await colleccion.findOne({
        _id: new ObjectId(payload.userId)
    })
}