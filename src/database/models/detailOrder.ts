import {
    Document,
    SchemaDefinition,
    SchemaTypes,
    Schema,
    Connection,
    Model
} from "mongoose";

export interface IOrderDetail extends Document {
    order: string;
    productSKU: string;
    productName: string;
    productPrice: Number;
    quantity: Number;
}

const schema: SchemaDefinition = {
    order: { type: SchemaTypes.ObjectId, required: true, ref:'orders'},
    productSKU: {type: SchemaTypes.String, required:true},
    productName: {type: SchemaTypes.String, required:true},
    productPrice: {type: SchemaTypes.Number, required:true},
    quantity: {type: SchemaTypes.Number, required:true},
};

const collectionName: string = "orderdetail";
const cartSchema: Schema = new Schema(schema);

const OrderDetail = (conn: Connection): Model<IOrderDetail> =>
    conn.model(collectionName, cartSchema);

export default OrderDetail;