import { Connection, Model } from 'mongoose';
import dayjs from "dayjs";
import CartModel, { ICart } from '../models/cart';
import { ApolloError } from 'apollo-server-express';
import { pubsub } from './../../resolvers/helper';
import ProductModel, { IProduct } from '../models/products';
import UserModel, { IUser } from '../models/users';
import OrderModel, { IOrder } from './../models/order';
import OrderDetailModel, { IOrderDetail } from './../models/detailOrder';
import OrderDeliverModel, { IOrderDeliver } from './../models/deliverOrder';
import { CartAction } from './cart';
import shortid from 'shortid';
import MunicipioModel, { IMunicipio } from '../models/municipios';
import EstadoModel, { IEstado } from '../models/estados';



export class OrderAction {
    cart: Model<ICart, {}>;
    productM: Model<IProduct, {}>;
    userM: Model<IUser, {}>;
    orderM: Model<IOrder, {}>;
    orderDetailM: Model<IOrderDetail, {}>;
    orderDeliverM: Model<IOrderDeliver, {}>;
    municipio: Model<IMunicipio, {}>;
    estado: Model<IEstado, {}>;

    constructor(dbConn: Connection) {
        const modelo: Model<ICart> = CartModel(dbConn);
        const productModel: Model<IProduct> = ProductModel(dbConn);
        const userModel: Model<IUser> = UserModel(dbConn);
        this.productM = productModel;
        this.userM = userModel;
        this.cart = modelo;
        this.orderM = OrderModel(dbConn);
        this.orderDetailM = OrderDetailModel(dbConn);
        this.orderDeliverM = OrderDeliverModel(dbConn);
        this.municipio = MunicipioModel(dbConn);
        this.estado = EstadoModel(dbConn);
    }

    async createOrder(id: String, deliverAdress: any, dbConn: Connection) {
        /*Obtiene todos los items del carrito */
   
        let cartAction: CartAction = new CartAction(dbConn);
        let items: any = await cartAction.getCart(id);

        if (items.totalItems >= 1) {

            await this.orderM.createCollection();
            await this.orderDetailM.createCollection();
            await this.orderDeliverM.createCollection();

            const session = await dbConn.startSession();
            session.startTransaction();
            try {
                /*crea la orden*/
                let orderID = shortid.generate();
                let orderCreated = await this.orderM.create([{
                    user: id,
                    shortID: orderID,
                    statusOrder: 1,
                    orderCreated: dayjs().toDate()
                }], { session });

                /*Crea la colleción para amacenar los items*/
                let itemsToOrder = [];
                for (let item of items.item) {
                    itemsToOrder.push({
                        order: orderCreated[0]._id,
                        productSKU: String(item.product.productSKU),
                        productName: String(item.product.productName),
                        productPrice: Number(item.product.productPrice),
                        quantity: item.quantity
                    })
                }

                /*Agrega los datos de entrega */
                let {
                    userFirstName, userLastName,
                    userPhone, userCity, citySelected, userState, stateSelected,
                    userZip, userNoExt, userNoInt, userAddress, userAddress2, notes,
                } = deliverAdress;

                await this.orderDeliverM.create([{
                    order: orderCreated[0]._id,
                    userFirstName,
                    userLastName,
                    userPhone,
                    userCity,
                    citySelected,
                    userState,
                    stateSelected,
                    userZip,
                    userNoExt,
                    userNoInt,
                    userAddress,
                    userAddress2,
                    notes,
                }], { session })

                /*Agrega los items al detalle de la orden*/
                await this.orderDetailM.create(itemsToOrder, { session });

                /*Elimina todos los items del carrito*/
                await this.cart.deleteMany({ user: String(id) }, { session }).exec();

                await session.commitTransaction();
                session.endSession();

                let item = await this.cart.find({ user: id.toString() }).populate({ path: "user" }).populate({ path: "product" }).exec();
              
                pubsub.publish('productAdded', { userCart: { item, userID: id, totalItems: item.length } });

                return { orderID: orderID, success: true, message: `Su orden fue generada correctamente (${orderID}).` };

            } catch (error) {
                console.log(error);
                await session.abortTransaction();
                session.endSession();
                return { orderID: "", success: false, message: `No se logro generar la orden intente de nuevo.` };
            }
        } else {
            return { orderID: "", success: false, message: `No cuenta con artículos en su carrito para poder ordenar.` };
        }
    }

    async getOrders(idUser: String, idOrder: String) {
        try {
            let ordenes: any = [];

            if (!idOrder) {
                /*Obtiene el listado de ordenes*/
                ordenes = await this.orderM.find({ user: idUser.toString() }).populate({ path: "user" }).sort({orderCreated: -1}).exec();
            } else {
                ordenes = await this.orderM.find({ user: idUser.toString(), shortID: idOrder.toString() }).populate({ path: "user" }).exec();
            }

            let ordenesArray = [];
            if (ordenes.length) {

                for (let orden of ordenes) {
                    let od: any = orden;
                    let products: any = await this.orderDetailM.find({ order: orden._id }).exec();

                    let deliverAdress: any = await this.orderDeliverM.find({ order: orden._id })
                        .populate({ path: "citySelected" }).populate({ path: "stateSelected" }).exec();

                    od.products = products;

                    let total = 0;
                    for(let product of products){
                        total += product.productPrice * product.quantity;
                    }

                    od.total = total;
                    od.items = products.length;
                    od.deliverAdress = deliverAdress[0];
                    ordenesArray.push(od);
                }

                return ordenesArray;
            } else {
                throw new ApolloError("No se encontrarón resultados.", "404");
            }

        } catch (error) {
            console.log(error);
            if (idOrder) {
                throw new ApolloError("Ocurrio un error al obtener su Orden.", "500");
            } else {
                throw new ApolloError("Ocurrio un error al obtener sus Ordenes.", "500");
            }

        }
    }
} 