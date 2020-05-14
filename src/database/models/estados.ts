import {
    Document,
    SchemaDefinition,
    SchemaTypes,
    Schema,
    Connection,
    Model
} from "mongoose";

export interface IEstado extends Document {
    nameEdo: string;
}

const schema: SchemaDefinition = {
    nameEdo: { type: SchemaTypes.String, required: true }
};

const collectionName: string = "estados";
const edoSchema: Schema = new Schema(schema);

const Estado = (conn: Connection): Model<IEstado> =>
    conn.model(collectionName, edoSchema);

export default Estado;