import {
    Document,
    SchemaDefinition,
    SchemaTypes,
    Schema,
    Connection,
    Model
} from "mongoose";

export interface IOrder extends Document {
    user: string;
    shortID:string;
    statusOrder: Number;
    canceled:string;
    orderCreated: Date;
    orderUpdated: Date;
}
/*Status Order 1="En proceso"*/
const schema: SchemaDefinition = {
    user: { type: SchemaTypes.ObjectId, required: true, ref:'users'},
    shortID: { type: SchemaTypes.String, required: true },
    canceled: { type: SchemaTypes.String, required: false },
    statusOrder: {type: SchemaTypes.Number, required:true, default:1},
    orderCreated: { type: SchemaTypes.Date, required: true },
    orderUpdated: { type: SchemaTypes.Date}
};

const collectionName: string = "orders";
const cartSchema: Schema = new Schema(schema);

const Order = (conn: Connection): Model<IOrder> =>
    conn.model(collectionName, cartSchema);

export default Order;