import { Connection, Model } from 'mongoose';
import dayjs from "dayjs";
import UserModel, { IUser } from '../models/users';
import EstadoModel, { IEstado } from './../models/estados';
import MunicipioModel, { IMunicipio } from './../models/municipios';
import { ApolloError } from 'apollo-server-express';


export class UsersActions {
    user: Model<IUser, {}>;
    estado: Model<IEstado, {}>;
    municipio: Model<IMunicipio, {}>;

    constructor(dbConn: Connection) {
        const modelo: Model<IUser> = UserModel(dbConn);
        this.user = modelo;
        this.estado = EstadoModel(dbConn);
        this.municipio = MunicipioModel(dbConn);
    }

    async createUser(value: any) {
        const User = this.user;
        let { userEmail,
            userUID,
            userFirstName,
            userLastName,
            userPhone,
            userCity,
            citySelected,
            userState,
            stateSelected,
            userZip,
            userAddress,
            userAddress2,
            userEmailVerified } = value;

        let userExist = await this.checkIfUserExists(userEmail);

        if (userExist) {
            throw new ApolloError(`Ya existe un usuario con el correo electrónico: ${userEmail}`);
        } else {
            return User.create({
                userEmail,
                userUID,
                userFirstName,
                userLastName,
                userPhone,
                userCity,
                citySelected,
                userState,
                stateSelected,
                userZip,
                userAddress,
                userAddress2,
                userEmailVerified,
                userRegistrationDate: dayjs().toDate()
            });
        }
    }

    getUsers() {
        return this.user.find().populate({ path: "stateSelected" }).exec();
    }

    checkIfUserExists(email: String) {
        return new Promise((resolve) => {
            this.user.findOne({ userEmail: email.toString() }, async (err, user) => {
                if (!err) {

                    if (user) {
                        let us = await user.populate({ path: "stateSelected" }).populate({ path: "citySelected" }).execPopulate()
                        resolve(us)
                    } else {
                        resolve(false);
                    }

                } else {
                    console.log(err);
                    throw new ApolloError("Ocurrio un error buscando al usuario.");
                }
            });

        });
    }


    async updatePersonalData(value: any) {
        console.log("Entra aqiu");
        const User = this.user;
        let { userEmail,
            userUID,
            userFirstName,
            userLastName,
            userPhone } = value;

        if (!userEmail || !userUID || !userFirstName || !userLastName || !userPhone) {
            throw new ApolloError("Todos los campos son obligatorios.")
        } else if (userEmail.trim() === "" || userUID.trim() === "" || userFirstName.trim() === "" || userLastName.trim() === "" || userPhone.trim() === "") {
            throw new ApolloError("Todos los campos son obligatorios.");
        } else {
            let userExist: any = await this.checkIfUserExists(userEmail);

            if (userExist) {
                return await new Promise((resolve) => {
                    User.findByIdAndUpdate(userExist._id, {
                        userFirstName,
                        userLastName,
                        userPhone,
                    }, { new: true }, (error, userUpdated) => {
                        if (!error) {
                            resolve(userUpdated);
                        } else {
                            throw new ApolloError("No se logro actualizar la información del Usuario.");
                        }
                    }
                    )
                })
            } else {
                try {

                    return User.create({
                        userEmail,
                        userUID,
                        userFirstName,
                        userLastName,
                        userPhone,
                        userRegistrationDate: dayjs().toDate()
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    async updateDatosEntrega(value: any) {
        const User = this.user;
        let { userEmail,
            userUID,
            userCity,
            citySelected,
            userState,
            stateSelected,
            userZip,
            userNoExt,
            userNoInt,
            userAddress,
            userAddress2 } = value;

        if (!userEmail || !userUID || !userCity || !userState || !userZip || !userAddress || !userNoExt ||
            !stateSelected || !citySelected
        ) {
            throw new ApolloError("Todos los campos son obligatorios.")
        } else if (userEmail.trim() === "" || userUID.trim() === "" || userCity.trim() === "" || userState.trim() === "" || userZip.trim() === ""
            || userAddress.trim() === "" || userNoExt.trim() === ""
            || stateSelected.trim() === "" || citySelected.trim() === ""
        ) {
            throw new ApolloError("Todos los campos son obligatorios.");
        } else {
            let userExist: any = await this.checkIfUserExists(userEmail);

            if (userExist) {
                return await new Promise((resolve) => {
                    User.findByIdAndUpdate(userExist._id, {
                        userCity,
                        citySelected,
                        userState,
                        stateSelected,
                        userZip,
                        userNoExt,
                        userAddress,
                        userNoInt: userNoInt || "",
                        userAddress2
                    }, (error, userUpdated) => {
                        if (!error) {
                            resolve(userUpdated);
                        } else {
                            throw new ApolloError("No se logro actualizar la información del Usuario.");
                        }
                    })
                })
            } else {
                try {
                    return User.create({
                        userEmail,
                        userUID,
                        userCity,
                        citySelected,
                        userState,
                        stateSelected,
                        userZip,
                        userNoExt,
                        userNoInt: userNoInt || "",
                        userAddress,
                        userAddress2,
                        userRegistrationDate: dayjs().toDate()
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

}