import {
    Document,
    SchemaDefinition,
    SchemaTypes,
    Schema,
    Connection,
    Model
} from "mongoose";

export interface IMunicipio extends Document {
    nameMuni: string;
    edo: string;
}

const schema: SchemaDefinition = {
    nameMuni: { type: SchemaTypes.String, required: true },
    edo: { type: SchemaTypes.ObjectId, required: true,ref: 'estados' },
};

const collectionName: string = "municipios";
const productSchema: Schema = new Schema(schema);

const Municipio = (conn: Connection): Model<IMunicipio> =>
    conn.model(collectionName, productSchema);

export default Municipio;