import { Connection, createConnection, connect } from "mongoose";

const uri: string = 'mongodb://localhost:27017/ecommerce'; //process.env.DB_PATH;
//const uri: string = 'mongodb://localhost:27017,localhost:27018,localhost:27019/ecommerce?replicaSet=rs';
//const uri: string = 'mongodb+srv://odiez3:3str3llitA@cluster0-flqnz.gcp.mongodb.net/ecommerce?retryWrites=true&w=majority'
export const getConnection = async (): Promise<Connection> => {
  // Because `conn` is in the global scope, Lambda may retain it between
  // function calls thanks to `callbackWaitsForEmptyEventLoop`.
  // This means your Lambda function doesn't have to go through the
  // potentially expensive process of connecting to MongoDB every time.

  let conn: Connection = await createConnection(uri, {
    // Buffering means mongoose will queue up operations if it gets
    // disconnected from MongoDB and send them when it reconnects.
    // With serverless, better to fail fast if not connected.
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0, // and MongoDB driver buffering
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })

  console.log("Se conecta");

  return conn;
};