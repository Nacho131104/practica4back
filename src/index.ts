import express from "express";
import { connectmongodb } from "./mongo";
import dotenv from "dotenv";

dotenv.config();

connectmongodb();