import { Connection, Model } from 'mongoose';
import EstadoModel, { IEstado } from '../models/estados';
import { ApolloError } from 'apollo-server-express';

export class EstadosAction {
    estado: Model<IEstado, {}>;

    constructor(dbConn: Connection) {
        const modelo: Model<IEstado> = EstadoModel(dbConn);
        this.estado = modelo;
    }

    async getEstados(){
        return await this.estado.find().sort({nameEdo:1})
    }

}