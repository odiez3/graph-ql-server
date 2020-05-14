import { IResolvers } from "graphql-tools";
import query from "./query";
import mutation from "./mutation";
import subscription from './subscription';

export const LIST: string [] = [ ];
const resolvers : IResolvers = {
    ...query,
    ...mutation,
    ...subscription
}

export default resolvers;