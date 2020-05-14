import { Connection, Model } from 'mongoose';
import dayjs from "dayjs";
import CategorieModel, { ICategorie } from '../models/categorie';
import { ApolloError } from 'apollo-server-express';


export class CategoriesAction {
    categorie: Model<ICategorie, {}>;

    constructor(dbConn: Connection) {
        const modelo: Model<ICategorie> = CategorieModel(dbConn);
        this.categorie = modelo;
    }

    async createCategorie(value: any) {
        const Categorie = this.categorie;
        let { categoryName } = value;

        let categoryExists = await this.checkCategorieName(categoryName);

        if (categoryExists) {
            throw new ApolloError(`Ya existe una categoría similar.`);
        } else {
            return Categorie.create({
                categoryName: categoryName.trim(),
                categoryNameLower: categoryName.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase(),
                categoryRegistrationDate: dayjs().toDate()
            });
        }
    }

    async checkCategorieName(categoryName: String) {
        return new Promise((resolve) => {
            this.categorie.findOne(
                { categoryNameLower: categoryName.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() },
                (err, categorie) => {
                    if (!err) {
                        if (categorie) {
                            resolve(true)
                        } else {
                            resolve(false);
                        }

                    } else {
                        console.log(err);
                        throw new ApolloError("Ocurrio un error buscando la categoría.");
                    }
                }
            )
        })

    }

    getCategories() {
        return this.categorie.find().exec();
    }

    getCategorieByID(_id:String){
        return new Promise((resolve)=>{
            this.categorie
        })
    }

    deleteCategorie(_id: String) {
        return new Promise((resolve) => {
            this.categorie.deleteOne({ _id: _id }, (err) => {
                if (!err) {
                    resolve(true);
                } else {
                    console.log(err);
                    throw new ApolloError("No se logro eliminar esta categoría.");
                }
            })
        })
    }

    updateCategorie(_id: String, categoryName: String) {
        return new Promise((resolve) => {
            this.categorie.findByIdAndUpdate(_id,
                {
                    categoryName: categoryName.toString(),
                    categoryNameLower: categoryName.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase()
                }, (err, categoryUpdated) => {
                    if (!err) {
                        resolve(categoryUpdated)
                    } else {
                        console.log(err);
                        throw new ApolloError("No se logro actualizar la categoría.");
                    }
                })
        })
    }


}