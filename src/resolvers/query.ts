import { MunicipiosAction } from './../database/actions/municipios';
import { EstadosAction } from './../database/actions/estados';
import { CartAction } from './../database/actions/cart';
import { ProductsAction } from './../database/actions/product';
import { Connection } from 'mongoose';
import { IResolvers } from "graphql-tools";
import { UsersActions } from '../database/actions/users';
import { CategoriesAction } from '../database/actions/categorie';
import { OrderAction } from '../database/actions/order';
import { ApolloError } from 'apollo-server-express';

const query: IResolvers = {
    Query: {
        async allUsers(_: void, args: any, { dbConn }: { dbConn: Connection }) {
            try {
                const userAct = new UsersActions(dbConn);
                let result = await userAct.getUsers();
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async checkDataInDB(_: void, { email }, { dbConn , dataUser}: { dbConn: Connection,dataUser:any}) {
            try {
                console.log("Este es el uid",dataUser.token.email);
                const userAct = new UsersActions(dbConn);

                let result = await userAct.checkIfUserExists(dataUser.token.email);
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async allCategories(_: void, args: any, { dbConn }: { dbConn: Connection }) {
            try {
              
                const categoryAct = new CategoriesAction(dbConn);
                let result = await categoryAct.getCategories();
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async deleteCategorie(_: void, { idCategorie }, { dbConn }: { dbConn: Connection }) {
            try {
                const categoryAct = new CategoriesAction(dbConn);
                let result = await categoryAct.deleteCategorie(idCategorie);
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async updateCategorie(_: void, { idCategorie, categoryName }, { dbConn }: { dbConn: Connection }) {
            try {
                const categoryAct = new CategoriesAction(dbConn);
                let result = await categoryAct.updateCategorie(idCategorie, categoryName);
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async getProducts(_: void, args: any, { dbConn }: { dbConn: Connection }) {
            try {

                const productsAct = new ProductsAction(dbConn);
                let result = await productsAct.getProducts();
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async getProductByID(_: void, { id }, { dbConn }: { dbConn: Connection }) {
            try {
                const productsAct = new ProductsAction(dbConn);
                let result = await productsAct.getProductByID(id);
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async getProductsByCategory(_: void, { idCategorie }, { dbConn }: { dbConn: Connection }) {
            try {
                const productsAct = new ProductsAction(dbConn);
                let result = await productsAct.getProductsByCategory(idCategorie);
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async getCartItems(_: void, { id }, { dbConn , dataUser}: { dbConn: Connection,dataUser:any}) {
            try {
                const cartAct = new CartAction(dbConn);
                let result = await cartAct.getCart(dataUser.user._id);
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async getEstados(_void, args: any, { dbConn }: { dbConn: Connection }) {
            try {
                const edosAct = new EstadosAction(dbConn);
                let result = await edosAct.getEstados();
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async getMunicipiosByEstado(_void, { estado }, { dbConn }: { dbConn: Connection }) {
            try {
                const muncipioAct = new MunicipiosAction(dbConn);
                let result = await muncipioAct.getMunicipiosByEstado(estado);
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        },
        async getOrders(_void, {idOrder }, { dbConn , dataUser}: { dbConn: Connection,dataUser:any}) {
            try {
                const ordenAct = new OrderAction(dbConn);
                let result = await ordenAct.getOrders(dataUser.user._id, idOrder);
                dbConn.close();
                return result;
            } catch (error) {
                dbConn.close();
                throw new ApolloError(error);
            }
        }


    }
}

export default query;