import {
    Document,
    SchemaDefinition,
    SchemaTypes,
    Schema,
    Connection,
    Model
} from "mongoose";

export interface ICategorie extends Document {
    categoryName: string;
    categoryNameLower: string;
    categoryRegistrationDate: Date;
}

const schema: SchemaDefinition = {
    categoryName: { type: SchemaTypes.String, required: true},
    categoryNameLower: {type: SchemaTypes.String, required:true},
    categoryRegistrationDate: { type: SchemaTypes.Date, required: true }

};

const collectionName: string = "categories";
const categorieSchema: Schema = new Schema(schema);

const Categorie = (conn: Connection): Model<ICategorie> =>
    conn.model(collectionName, categorieSchema);

export default Categorie;