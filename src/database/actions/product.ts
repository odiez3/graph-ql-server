import { Connection, Model } from 'mongoose';
import dayjs from "dayjs";
import ProductModel, { IProduct } from '../models/products';
import CategorieModel, { ICategorie } from '../models/categorie';
import { ApolloError } from 'apollo-server-express';


export class ProductsAction {
    product: Model<IProduct, {}>;
    categorie: Model<ICategorie, {}>;

    constructor(dbConn: Connection) {
        const modelo: Model<IProduct> = ProductModel(dbConn);
        const modeloCate: Model<ICategorie> = CategorieModel(dbConn);
        this.product = modelo;
        this.categorie = modeloCate;
    }

    async createProduct(value: any) {
        const Product = this.product;
        let {
            productSKU,
            productName,
            productBrand,
            productBarCode,
            productPrice,
            productWeight,
            productCartDesc,
            productShortDesc,
            productLongDesc,
            productImage,
            productCategoryID,
            productStock,
            productLive,
        } = value;

        return Product.create({
            productSKU,
            productName,
            productBrand,
            productBarCode,
            productPrice,
            productWeight,
            productCartDesc,
            productShortDesc,
            productLongDesc,
            productImage,
            productCategoryID,
            productStock,
            productLive,
            productRegistrationDate: dayjs().toDate()
        });

    }


    getProducts() {
        return this.product.find().populate({ path: "productCategoryID" }).exec();
    }

    getProductsByCategory(category: String) {
        if (category.trim() !== "") {
            return this.product.find({ productCategoryID: category.toString() }).populate({ path: "productCategoryID" }).exec();
        } else {
            return this.product.find().populate({ path: "productCategoryID" }).exec();
        }

    }

    async getProductByID(id: String) {
        try {
           
            let product = await this.product.findById(id).populate({path:"productCategoryID"}).exec();

            console.log(product);
            return product;
            
        } catch (error) {
            throw new ApolloError("El artículo no se encuentra o no esta disponible por el momento.");
        }
    }

    deleteProduct(_id: String) {
        return new Promise((resolve) => {
            this.product.deleteOne({ _id: _id }, (err) => {
                if (!err) {
                    resolve(true);
                } else {
                    console.log(err);
                    throw new ApolloError("No se logro eliminar el producto.");
                }
            })
        })
    }

    updateProduct(_id: String, value: any) {
        return new Promise((resolve) => {
            // this.product.findByIdAndUpdate(_id,
            //     {
            //         categoryName: categoryName.toString(),
            //         categoryNameLower: categoryName.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
            //     }, (err, categoryUpdated) => {
            //         if (!err) {
            //             resolve(categoryUpdated)
            //         } else {
            //             console.log(err);
            //             throw new ApolloError("No se logro actualizar la categoría.");
            //         }
            //     })
            resolve(true);
        })
    }


}