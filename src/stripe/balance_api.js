import axios from "axios";
import qs from 'qs' ;
import { stripe_api_origin } from "../constants/static";

export const retrieveBalance = async () => {
    try {
        let res = await axios({
            method : 'get',
            url : stripe_api_origin + 'balance',
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
