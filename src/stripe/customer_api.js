import axios from "axios";
import qs from 'qs' ;
import { stripe_api_origin } from "../constants/static";

export const createCustomer = async (req) => {
    try {
        let data = qs.stringify(req) ;

        let res = await axios({
            method : 'post',
            url : stripe_api_origin + 'customers',
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

export const listCustomer = async (limit) => {
    try {
        let req = {
            "limit" : limit
        } ;

        let data = qs.stringify(req) ;

        let res = await axios({
            method : 'get',
            url : stripe_api_origin + 'customers',
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

export const deleteCustomer = async (id) => {
    try {
        let res = await axios({
            method : 'delete',
            url : stripe_api_origin + 'customers/' + id,
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