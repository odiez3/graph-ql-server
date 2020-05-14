import { Connection, Model } from 'mongoose';
import MunicipioModel, { IMunicipio } from '../models/municipios';
import EstadoModel, { IEstado } from '../models/estados';
import { ApolloError } from 'apollo-server-express';

export class MunicipiosAction {
    municipio: Model<IMunicipio, {}>;
    estado: Model<IEstado, {}>;

    constructor(dbConn: Connection) {
        this.municipio =  MunicipioModel(dbConn);
        this.estado = EstadoModel(dbConn);
    }

    async getMunicipiosByEstado(estado:string){
        return await this.municipio.find().where("edo",estado).populate({path:"edo"}).exec()
    }

}