import axios from "axios";
import qs from 'qs' ;
import { stripe_api_origin } from "../constants/static";

export const createProduct =  async (newProduct) => {
    try {
        let bodyData = qs.stringify(newProduct) ;

        let res = await axios({
            method : 'post',
            url : stripe_api_origin + 'products',
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data : bodyData
        }) ;

        return res ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
export const createCardToken = async (body) => {
    try {
        console.log(process.env.REACT_APP_STRIPE_SOLSTICE_ACCOUNT_ID);
        let bodyData = qs.stringify(body) ;

        let res = await axios({
            method : 'post',
            url : stripe_api_origin + 'tokens' ,
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded',
                'Stripe-Account' : process.env.REACT_APP_STRIPE_SOLSTICE_ACCOUNT_ID
            },
            data : bodyData
        }) ;

        return res ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const createCharge = async (body) => {
    try {
        let bodyData = qs.stringify(body) ;

        let res = await axios({
            method : 'post',
            url : stripe_api_origin + 'charges',
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data : bodyData
        }) ;

        return res ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const createRefund = async (body) => {
    try {
        let bodyData = qs.stringify(body) ;

        let res = await axios({
            method : 'post',
            url : stripe_api_origin + 'refunds',
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data : bodyData
        }) ;

        return res ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}


export const createAccount = async (body) => {
    try {
        let bodyData = qs.stringify(body) ;

        let res = await axios({
            method : 'post',
            url : stripe_api_origin + 'accounts',
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data : bodyData
        }) ;

        return res ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const updateAccount = async (id, body) => {
    try {
        let bodyData = qs.stringify(body) ;

        let res = await axios({
            method : 'post',
            url : stripe_api_origin + 'accounts/' + id,
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data : bodyData
        }) ;

        return res ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const createAccountLink = async (body) => {
    try {
        let bodyData = qs.stringify(body) ;

        let res = await axios({
            method : 'post',
            url : stripe_api_origin + 'account_links',
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data : bodyData
        }) ;

        return res ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
export const deleteAccount = async (id) => {
    try {
        let res = await axios({
            method : 'delete',
            url : stripe_api_origin + 'accounts/' + id,
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded'
            },
        }) ;

        return res ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const deleteProduct = async (id) => {
    try {
        let params = qs.stringify({
            id : id
        }) ;

        let res = await axios({
            method : 'delete',
            url : stripe_api_origin + 'products',
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded'
            },
        }) ;

        return res ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}