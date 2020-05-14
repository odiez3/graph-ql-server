
// Añadir los imports
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import schema from './schema';
import { ApolloServer, ApolloError, AuthenticationError } from 'apollo-server-express';
import { createServer } from 'http';
import expressPlayGround from 'graphql-playground-middleware-express';
import { getConnection } from './database';
import admin from 'firebase-admin';
import { PROPS } from './firebase/index';
import { validToken } from './middlewares/auth';

async function init() {
    var serviceAccount = require("./firebase/serviceAccount.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: PROPS.FIREBASE_URL
    });

    // Inicializamos la aplicación express
    const app = express();

    // Añadimos configuración de Cors y compression
    app.use('*', cors());

    app.use(compression());

    // Inicializamos el servidor de Apollo
    const server = new ApolloServer({
        schema,
        context: async ({ req, connection }) => {
            const dbConn = await getConnection();
            let dataUser:any;
            if (connection) {
                dataUser = await validToken(connection.context.token,dbConn);
            } else {
                if (!req.headers.authorization) {
                    throw new ApolloError('Debe haber iniciado sesión!');
                } else {
                    dataUser = await validToken(req.headers.authorization,dbConn);
                }
            }

         
            return { dbConn, dataUser };
        },
        subscriptions: {
            onConnect: async (connectionParams: any, webSocket, context) => {

                if (!connectionParams.authorization) {
                    throw new ApolloError('Debe haber iniciado sesión!');
                } else {
                    let token = connectionParams.authorization;

                    return { token };
                }
            }
        },
        introspection: true // Necesario
    });

    server.applyMiddleware({ app });

    app.use('/', expressPlayGround({
        endpoint: '/graphql',
    }));

    const PORT = process.env.PORT || 5000;

    const httpServer = createServer(app);

    server.installSubscriptionHandlers(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`http://localhost:${PORT}/graphql`);
        console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
    });


}

init();
