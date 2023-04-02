import axios from "axios";
import qs from 'qs' ;
import { stripe_api_origin } from "../constants/static";

export const createPaymentIntent = async (body) => {
    try {
        let bodyData = qs.stringify(body) ;

        let res = await axios({
            method : 'post',
            url : stripe_api_origin + 'payment_intents',
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data : bodyData
        }) ;

        return res.data ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const retrievePaymentIntent = async (id) => {
    try {

        let res = await axios({
            method : 'get',
            url : stripe_api_origin + 'payment_intents/' + id,
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded'
            },
        }) ;

        return res.data ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const cancelPaymentIntent = async (id) => {
    try {
        let res = await axios({
            method : 'post',
            url : stripe_api_origin + 'payment_intents/' + id + "/cancel",
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded'
            },
        }) ;

        return res.data ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const retrievePaymentMethod = async (id) => {
    try {

        let res = await axios({
            method : 'get',
            url : stripe_api_origin + 'payment_methods/' + id,
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded'
            },
        }) ;

        return res.data ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
