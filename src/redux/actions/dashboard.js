import ActionTypes from "./actionTypes";

import CID from 'cids' ;

import { db, auth } from "../../firebase/config";
import { doc, setDoc, getDoc, updateDoc, getDocs, query, collection, orderBy, where, deleteDoc, limit } from 'firebase/firestore' ;
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage' ;
import { getCookie, getProductId, getUuid } from "../../utils/Helper";
import axios from "axios";

import { ipfs_origin } from '../../constants/static' ;

export const ActiveProductsList = () => async dispatch => {
    try {
        let activeProductsList = [] ;

        let productDocs = await getDocs(query(collection(db, "Web_Products"), where('creator_id', '==', getCookie('_SOLSTICE_AUTHUSER'), where('active', '==', true) ))) ;

        await Promise.all(
            productDocs.docs.map(async productDoc => {
                let product_meta = await axios.get(ipfs_origin + productDoc.data().ipfs_product_hash) ;

                activeProductsList.push({
                    id : productDoc.id,
                    ...productDoc.data(),
                    ...product_meta.data
                })
            })
        )

        await dispatch({
            type : ActionTypes.ActiveProductsList,
            payload : activeProductsList
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
export const TopSellersList = () => async dispatch => {
    try {
        let topSellersList = [] ;

        let userDocs = await getDocs(query( collection(db, "Web_Users"), orderBy('total_sold_count','desc'), limit(4) ) ) ;

        await Promise.all(
            userDocs.docs.map( async userDoc => {
                topSellersList.push({
                    id : userDoc.id,
                    profile_picture_url : userDoc.data().profile_picture_url,
                    email : userDoc.data().email,
                    full_name : userDoc.data().full_name,
                    profile_link : userDoc.data().profile_link,
                    phone_number : userDoc.data().phone_number,
                    total_sold_count : userDoc.data().total_sold_count,
                    product_count : userDoc.data().product_count
                })
            })
        )

        console.log(topSellersList) ;

        await dispatch({
            type : ActionTypes.TopSellersList,
            payload : topSellersList
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    } 
}


export const ProductsListOrderBy = () => async dispatch => {
    try {
        let productDocs = await getDocs(query( collection(db, "Web_Products"), where('creator_id', '==', getCookie('_SOLSTICE_AUTHUSER')), orderBy('sold_count', 'desc'), limit(10))) ;

        let productsList = [] ;

        await Promise.all(
            productDocs.docs.map(async product => {
                try {
                    let product_meta = await axios.get(ipfs_origin + product.data().ipfs_product_hash) ;

                    if(product_meta.data.price_type !== 'free') {
                        productsList.push({
                            ...product_meta.data,
                            ...product.data(),
                            id : product.id
                        })
                    }
                } catch(err) {

                }
            })
        )

        await dispatch({
            type : ActionTypes.ProductsListOrderBy,
            payload : productsList
        }) ;

        return true ;

    } catch (err) {
        console.log(err) ;
        return false ;
    }
}

export const EarningBalanceList = () => async dispatch => {
    try {

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}