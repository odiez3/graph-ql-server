import {
    Document,
    SchemaDefinition,
    SchemaTypes,
    Schema,
    Connection,
    Model
} from "mongoose";

export interface IOrderDeliver extends Document {
    order: string;
    userFirstName: string;
    userLastName: string;
    userCity: string;
    citySelected: string;
    userState: string;
    stateSelected: string;
    userZip: string;
    userPhone: string;
    userAddress: string;
    userAddress2: string;
    notes:string;
}

const schema: SchemaDefinition = {
    order: { type: SchemaTypes.ObjectId, required: true, ref:'orders'},
    userFirstName: { type: SchemaTypes.String, required: true },
    userLastName: { type: SchemaTypes.String, required: true },
    userPhone: { type: SchemaTypes.String, required: true },
    userCity: { type: SchemaTypes.String, required: true },
    citySelected:  { type: SchemaTypes.ObjectId, required: true,ref: 'municipios' },
    userState: { type: SchemaTypes.String, required: true },
    stateSelected:  { type: SchemaTypes.ObjectId, required: true,ref: 'estados' },
    userZip: { type: SchemaTypes.String, required: true },
    userNoExt: { type: SchemaTypes.String, required: true },
    userNoInt: { type: SchemaTypes.String, required: false },
    userAddress: { type: SchemaTypes.String, required: true },
    userAddress2: { type: SchemaTypes.String, required: false },
    notes: { type: SchemaTypes.String, required: false },
};

const collectionName: string = "orderdeliver";
const cartSchema: Schema = new Schema(schema);

const OrderDeliver = (conn: Connection): Model<IOrderDeliver> =>
    conn.model(collectionName, cartSchema);

export default OrderDeliver;