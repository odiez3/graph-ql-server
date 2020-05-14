
import { Connection, Model } from 'mongoose';
import { ApolloError } from "apollo-server";
import admin from 'firebase-admin';
import UserModel,{IUser} from './../database/models/users';

export const  validToken =async (token:string,dbConn:Connection) => {
  //console.log(token);
  try{
    let validToken:any = await admin.auth().verifyIdToken(token);
    //OBtiene los datos del usuario;
    let userM: Model<IUser, {}> = UserModel(dbConn);
    console.log(validToken.uid);
    let user = await userM.find({userUID:validToken.uid}).exec();

    return {token:validToken,user:user[0]};
  }catch(error){
    throw new ApolloError("Token incorrecto.");
  }
}