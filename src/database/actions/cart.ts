import { Connection, Model } from 'mongoose';
import dayjs from "dayjs";
import CartModel, { ICart } from '../models/cart';
import { ApolloError } from 'apollo-server-express';
import { pubsub } from './../../resolvers/helper';
import ProductModel, { IProduct } from '../models/products';
import UserModel, { IUser } from '../models/users';

export class CartAction {
    cart: Model<ICart, {}>;
    productM: Model<IProduct,{}>;
    userM: Model<IUser,{}>;

    constructor(dbConn: Connection) {
        const modelo: Model<ICart> = CartModel(dbConn);
        const productModel : Model<IProduct> = ProductModel(dbConn);
        const userModel : Model<IUser> = UserModel(dbConn);
        this.productM = productModel;
        this.userM = userModel;
        this.cart = modelo;

    }

    async addToCart(value: any) {
        const Cart = this.cart;
        let { product,quantity,user } = value;
        /** Revisa si el producto ya exist en el carrito, si existe le aumenta el número de piezas si no
         * lo crea
         */
        let existInCart = await this.cart.find({user}).where("product",product).exec();
        let productAdded;
        if(existInCart.length){
            /*Si existe ya en el carrito*/
            productAdded =  await Cart.findByIdAndUpdate(existInCart[0]._id,{
                quantity: existInCart[0].quantity+quantity
            },{new: true})
            
        }else{
            productAdded = await Cart.create({
                user,
                product,
                quantity,
                updatedItem:  dayjs().toDate()
            });  
        }
        if(productAdded){
            let item = await this.cart.find({user}).populate({path:"user"}).populate({path:"product"}).exec();
            pubsub.publish('productAdded',{userCart:{item,userID:user,totalItems:item.length}});
            return item;
        }else{
            throw new ApolloError("Ocurrio un erro al agregar el articulo.");
        }
    }

    async getCart(id:String){
     
        let item = await this.cart.find({user:id.toString()}).populate({path:"user"}).populate({path:"product"}).exec();
       
        return {item,userID:id,totalItems:item.length}
    }


    async deleteItem(userID:String, idItem: String){
        console.log(userID);
        try{
           // await this.cart.findByIdAndDelete(idItem).where("user",userID).exec();

            await this.cart.deleteOne({_id:idItem}).where("user",userID).exec();

            let item = await this.cart.find({user:userID.toString()}).populate({path:"user"}).populate({path:"product"}).exec();

            let data = {userCart:{item,userID,totalItems:item.length}};

            console.log("INFO ELIMNADA:",data);

            pubsub.publish('productAdded',data);

            return "Artículo eliminado.";
        }catch(error){
            console.log(error);
            throw new ApolloError("No logramos eliminar el producto de tu carrito intenta de nuevo.");
        }
    }

}