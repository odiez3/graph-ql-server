import {
    Document,
    SchemaDefinition,
    SchemaTypes,
    Schema,
    Connection,
    Model
} from "mongoose";

export interface ICart extends Document {
    user: string;
    product: string;
    quantity: Number;
    updatedItem: Date;
}

const schema: SchemaDefinition = {
    user: { type: SchemaTypes.ObjectId, required: true, ref:'users'},
    product: { type: SchemaTypes.ObjectId, required: true, ref:'products'},
    quantity: {type: SchemaTypes.Number, required:true},
    updatedItem: { type: SchemaTypes.Date, required: true }

};

const collectionName: string = "cart";
const cartSchema: Schema = new Schema(schema);

const Cart = (conn: Connection): Model<ICart> =>
    conn.model(collectionName, cartSchema);

export default Cart;