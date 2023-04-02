import axios from "axios";
import qs from 'qs' ;
import { stripe_api_origin } from "../constants/static";

export const retrieveTxBalance = async (balance_tx_id) => {
    try {
        let res = await axios({
            method : 'get',
            url : stripe_api_origin + 'balance_transactions/' + balance_tx_id,
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
