

import { IResolvers } from "graphql-tools";
import {  withFilter } from 'apollo-server';
import { pubsub } from './helper';

const subscription: IResolvers = {

    Subscription:{
        userInfo:{
            subscribe: withFilter(() => pubsub.asyncIterator('userInfo'), (payload, variables) => {
                return payload.userInfo.userEmail === variables.email
             })
        },
        userCart:{
            subscribe: withFilter(()=>pubsub.asyncIterator('productAdded'),(payload,variables)=>{
                // console.log(payload);
                // console.log(variables);
                return payload.userCart.userID.toString() === variables.userID.toString()
            })
        }

    }

}


export default subscription;