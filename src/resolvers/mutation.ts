import { CartAction } from './../database/actions/cart';
import { ProductsAction } from './../database/actions/product';
import { UsersActions } from './../database/actions/users';
import { IResolvers } from "graphql-tools";
import { Connection } from 'mongoose';
import { ApolloError } from 'apollo-server-express';
import { CategoriesAction } from '../database/actions/categorie';
import { pubsub } from './helper';
import { OrderAction } from '../database/actions/order';

const mutation: IResolvers = {
    Mutation: {
        async saveUser(parent,
            { value }: any,
            { dbConn }: { dbConn: Connection }
        ) {
            try {
                const userAct = new UsersActions(dbConn);
                let userInfo = await userAct.createUser(value);
                pubsub.publish('userInfo', { userInfo })
                dbConn.close();
                return userInfo;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async savePersonalData(parent, { user }: any, { dbConn }: { dbConn: Connection }) {

            try {
                const userAct = new UsersActions(dbConn);
                let userInfo = await userAct.updatePersonalData(user);
                pubsub.publish('userInfo', { userInfo });
                dbConn.close();
                return userInfo;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async saveDeliverData(parent, { user }: any, { dbConn }: { dbConn: Connection }) {

            try {
                const userAct = new UsersActions(dbConn);
                let result = await userAct.updateDatosEntrega(user);
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async saveCategory(parent, { value }: any, { dbConn }: { dbConn: Connection }) {

            try {
                const categoryAct = new CategoriesAction(dbConn);
                let result = await categoryAct.createCategorie(value);
                dbConn.close;
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async saveProduct(parent, { product }: any, { dbConn }: { dbConn: Connection }) {

            try {
                const productAct = new ProductsAction(dbConn);
                let result = await productAct.createProduct(product);
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async addItemToCart(parent, { item }: any, { dbConn }: { dbConn: Connection }) {

            try {
                const cartAct = new CartAction(dbConn);
                let result = await cartAct.addToCart(item);
                dbConn.close;
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async deleteCartItem(_: void, {idItem }, { dbConn , dataUser}: { dbConn: Connection,dataUser:any}) {
            try {
                const cartAct = new CartAction(dbConn);
                console.log("Elimina info", dataUser.user._id);
                let result = await cartAct.deleteItem(dataUser.user._id, idItem);
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async createOrder(_void, {orderToDeliver }, { dbConn , dataUser}: { dbConn: Connection,dataUser:any}) {
            try {
                const orderAction = new OrderAction(dbConn);
                let result = await orderAction.createOrder(dataUser.user._id, orderToDeliver, dbConn);
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        }

    }
}

export default mutation;