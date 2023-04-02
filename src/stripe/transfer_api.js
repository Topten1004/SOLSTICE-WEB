import axios from "axios";
import qs from 'qs' ;
import { stripe_api_origin } from "../constants/static";

export const createTransfer = async (body) => {
    try {
        let bodyData = qs.stringify(body) ;

        let res = await axios({
            method : 'post',
            url : stripe_api_origin + 'transfers',
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