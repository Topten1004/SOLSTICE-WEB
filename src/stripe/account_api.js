import axios from "axios";
import qs from 'qs' ;
import { stripe_api_origin } from "../constants/static";

export const createAccount = async (req) => {
    try {
        let data = qs.stringify(req) ;

        let res = await axios({
            method : 'post',
            url : stripe_api_origin + 'accounts',
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data : data
        }) ;

        return res.data ;
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

export const retrieveAccount = async (id) => {
    try {
        let res = await axios({
            method : 'get',
            url : stripe_api_origin + 'accounts/' + id,
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

        return res.data ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const listAccount = async (limit) => {
    try {
        let req = {
            "limit" : limit
        } ;

        let data = qs.stringify(req) ;

        let res = await axios({
            method : 'get',
            url : stripe_api_origin + 'accounts',
            headers : { 
                'Authorization' : `Bearer ` +  process.env.REACT_APP_STRIPE_PRV_KEY ,
                'Content-Type':'application/x-www-form-urlencoded'
            },
            data : data
        }) ;

        return res.data.data ;

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

        return res.data ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const rejectAccount = async (id, req) => {
    try {
        let bodyData = qs.stringify(req) ;
       
        let res = await axios({
            method : 'post',
            url : stripe_api_origin + 'accounts/' + id + "/reject",
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
