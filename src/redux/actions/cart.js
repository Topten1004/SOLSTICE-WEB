import ActionTypes from "./actionTypes";

import { db, auth } from "../../firebase/config";
import { doc, setDoc, getDoc, updateDoc, getDocs, query, collection, orderBy, where, increment } from 'firebase/firestore' ;
import { getCookie, getUuid } from "../../utils/Helper";

import emailjs from 'emailjs-com';
import axios from "axios";

import { ipfs_origin } from '../../constants/static' ;

export const UserBidsInfoList = () => async dispatch => {
    try {
       
        let bidDocs = await getDocs(query(collection(db, "Web_Bids"), where('creator_id', "==", getCookie('_SOLSTICE_AUTHUSER')))) ;
        
        let _bids = await Promise.all(
            bidDocs.docs.map(async bid => {
                let bidderDoc = await getDoc(doc(db, "Web_Users", bid.data().bidder_id)) ;

                return {
                    ...bid.data(),
                    bidder_full_name : bidderDoc.data().full_name,
                    bidder_account_name : bidderDoc.data().account_name,
                    bidder_profile_link : bidderDoc.data().profile_link,
                    bidder_email : bidderDoc.data().email,
                    bidder_profile_picture_url : bidderDoc.data().profile_picture_url,
                    id : bid.id,
                }
            })
        )

        console.log(_bids) ;

        await dispatch({
            type : ActionTypes.UserBidsInfoList,
            payload : _bids
        })

        return true ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
export const UserOrdersInfoList = () => async dispatch => {
    try {
        let orderDocs = await getDocs(query(collection(db, "Web_Bids"), where('bidder_id', "==", getCookie('_SOLSTICE_AUTHUSER')))) ;
        
        let _orders = await Promise.all(
            orderDocs.docs.map(async order => {
                let creatorDoc = await getDoc(doc(db, "Web_Users", order.data().creator_id)) ;

                return {
                    ...order.data(),
                    creator_full_name : creatorDoc.data().full_name,
                    creator_account_name : creatorDoc.data().account_name,
                    creator_profile_link : creatorDoc.data().profile_link,
                    creator_email : creatorDoc.data().email,
                    id : order.id,
                }
            })
        )

        console.log(_orders) ;

        await dispatch({
            type : ActionTypes.UserOrdersInfoList,
            payload : _orders
        })

        return true ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
export const UserTxsInfoList = (web3Provider) => async dispatch => {
    try {
        let userSnap = await getDoc(doc(db, "Web_Users", getCookie('_SOLSTICE_AUTHUSER'))) ;

        let txsList = [] ;

        let wallets = userSnap.data().wallets ;

        await Promise.all(
            wallets.map(async (wallet, index) => {
                // let _txs = await FetchOrdersByBidder(web3Provider, wallet) ;
                
                txsList = txsList.concat(_txs) ;
                
                _txs = await FetchBidsByOwner(web3Provider, wallet) ;

                txsList = txsList.concat(_txs) ;
            })
        )

        await dispatch({
            type : ActionTypes.UserTxsInfoList,
            payload : txsList
        }) ;

        return true ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
 
}


export const SendRareAccessUrl = async (product_id, bid_id) => {
    try {

        let bidDoc = await getDoc(doc(db, "Web_Bids", bid_id)) ;
        let creatorDoc = await getDoc(doc(db, "Web_Users", bidDoc.data().creator_id)) ;
        let bidderDoc = await getDoc(doc(db, "Web_Users", bidDoc.data().bidder_id)) ;

        let solDocs = await getDocs(query(collection(db, "Web_Solts"), where('product_id', "==", product_id))) ;

        let message = `<html><body><h1>Product Name : ${bidDoc.data().product_name}</h1><br/>` ;

        await Promise.all(
            solDocs.docs.map(async sol => {
                try {
                    let sol_meta = await axios.get(ipfs_origin + ipfs_sol_hash) ;
                    message += sol_meta.data.name  + " : https://solsapp.com/sols?access_key=" + sol.data().access_key + " <br/>" ;
                } catch(err){

                }
            })
        )

        var templateParams = {
            from_email : creatorDoc.data().email ,
            to_email : creatorDoc.data().email,
            from_name : bidderDoc.data().account_name,
            to_name : bidderDoc.data().account_name,
            message : message
        }

        console.log(templateParams) ;

        let res = await emailjs.send(process.env.REACT_APP_EMAIL_SERVICE_ID, process.env.REACT_APP_EMAIL_TEMPLATE_ID, templateParams, process.env.REACT_APP_EMAIL_USER_ID) ;
       
        console.log("success") ;
        
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
