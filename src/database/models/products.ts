import {
    Document,
    SchemaDefinition,
    SchemaTypes,
    Schema,
    Connection,
    Model
} from "mongoose";

export interface IProduct extends Document {
    productSKU: string;
    productName: string;
    productPrice: Number;
    productBrand: string;
    productWeight: Number;
    productCartDesc: string;
    productShortDesc: string;
    productLongDesc:string;
    productImage: string;
    productCategoryID: string;
    productBarCode: string;
    productUpdateDate: Date;
    productStock: Number;
    productLive: boolean;
    productRegistrationDate: Date;
}

const schema: SchemaDefinition = {
    productSKU: { type: SchemaTypes.String, required: true },
    productName: { type: SchemaTypes.String, required: true },
    productPrice: { type: SchemaTypes.Number, required: true },
    productBrand: { type: SchemaTypes.String, required: true },
    productBarCode: { type: SchemaTypes.Number, required: true },
    productWeight: { type: SchemaTypes.Number, required: false },
    productCartDesc: { type: SchemaTypes.String, required: true },
    productShortDesc: { type: SchemaTypes.String, required: false },
    productLongDesc: { type: SchemaTypes.String, required: false },
    productImage: { type: SchemaTypes.String, required: true },
    productCategoryID: { type: SchemaTypes.ObjectId, required: true,ref: 'categories' },
    productUpdateDate: { type: SchemaTypes.Date, required: false },
    productStock: { type: SchemaTypes.Number, required: false },
    productLive: { type: SchemaTypes.Boolean, required: false ,default:false},
    productRegistrationDate: { type: SchemaTypes.Date, required: true } 
};

const collectionName: string = "products";
const productSchema: Schema = new Schema(schema);

const Product = (conn: Connection): Model<IProduct> =>
    conn.model(collectionName, productSchema);

export default Product;