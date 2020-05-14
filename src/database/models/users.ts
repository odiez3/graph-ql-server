import {
    Document,
    SchemaDefinition,
    SchemaTypes,
    Schema,
    Connection,
    Model
} from "mongoose";

export interface IUser extends Document {
    userEmail: string;
    userUID:string;
    userFirstName: string;
    userLastName: string;
    userCity: string;
    citySelected: string;
    userState: string;
    stateSelected: string;
    userZip: string;
    userEmailVerified:boolean;
    userRegistrationDate: Date;
    userPhone: string;
    userAddress: string;
    userAddress2: string;
}

const schema: SchemaDefinition = {
    userEmail: { type: SchemaTypes.String, required: true },
    userUID: { type: SchemaTypes.String, required: true },
    userFirstName: { type: SchemaTypes.String, required: false },
    userLastName: { type: SchemaTypes.String, required: false },
    userPhone: { type: SchemaTypes.String, required: false },
    userCity: { type: SchemaTypes.String, required: false },
    citySelected:  { type: SchemaTypes.ObjectId, required: false,ref: 'municipios' },
    userState: { type: SchemaTypes.String, required: false },
    stateSelected:  { type: SchemaTypes.ObjectId, required: false,ref: 'estados' },
    userZip: { type: SchemaTypes.String, required: false },
    userNoExt: { type: SchemaTypes.String, required: false },
    userNoInt: { type: SchemaTypes.String, required: false },
    userAddress: { type: SchemaTypes.String, required: false },
    userAddress2: { type: SchemaTypes.String, required: false },
    userEmailVerified: { type: SchemaTypes.Boolean, required: false ,default:false},
    userRegistrationDate: { type: SchemaTypes.Date, required: true }
};

const collectionName: string = "users";
const userSchema: Schema = new Schema(schema);

const User = (conn: Connection): Model<IUser> =>
    conn.model(collectionName, userSchema);

export default User;