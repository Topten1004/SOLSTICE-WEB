import ActionTypes from "./actionTypes";

import { db } from "../../firebase/config";
import { doc, getDoc, updateDoc, getDocs, query, collection, where, addDoc, increment } from 'firebase/firestore' ;
import { getCookie, getProductId, setCookie, getUuid } from "../../utils/Helper";

import axios from "axios";
import { ipfs_origin } from "../../constants/static";

import { v4 as uuidv4 } from 'uuid' ;

import emailjs from 'emailjs-com';


export const UpdateBidDB = () => async dispatch => {
    try {
        let querySnapshots = await getDocs(collection(db, 'Web_Bids')) ;

        let new_bid_id = querySnapshots.docs.length ;

        await addDoc(collection(db, 'Web_Bids'), {
            from : getCookie('_SOLSTICE_SELLER') ,
            to : getCookie('_SOLSTICE_BUYER') ,
            bid_id : new_bid_id
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdateWalletInfo = (web3Provider) => async dispatch => {
    try {
        const signer = web3Provider.getSigner() ;
        const address = await signer.getAddress();

        let userSnap = await getDoc(doc(db, "Web_Users", getCookie('_SOLSTICE_BUYER'))) ;

        if(!userSnap.data().wallets.includes(address)) {
            await updateDoc(doc(db, "Web_Users", getCookie('_SOLSTICE_BUYER')), {
                wallets : [...userSnap.data().wallets, address] 
            }) ;
        }

    } catch(err) {
        console.log(err) ;
        return true ;
    }
} 

export const SellerProfileInfo = (profile_link) => async dispatch => {
    try {

        let querySnapShot = await getDocs(query(collection(db, "Web_Users") , where("profile_link", "==", profile_link))) ;

        if(querySnapShot.size === 1) {

            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
            const d = new Date(querySnapShot.docs[0].data().joined_date);
            let month = months[d.getMonth()];
    
            await dispatch({
                type : ActionTypes.SellerProfileInfo,
                payload : {
                    fullName : querySnapShot.docs[0].data().full_name,
                    coverPictureUrl : querySnapShot.docs[0].data().cover_picture_url,
                    profilePictureUrl : querySnapShot.docs[0].data().profile_picture_url,
                    productTypeList : querySnapShot.docs[0].data().product_type_list,
                    jobTag : querySnapShot.docs[0].data().job_tag,
                    accountName : querySnapShot.docs[0].data().account_name,
                    productCount : querySnapShot.docs[0].data().product_count,
                    platformCount : querySnapShot.docs[0].data().platform_count,
                    resellerCount : querySnapShot.docs[0].data().reseller_count,
                    joinedDate : month + " " + d.getFullYear(),
                    hostId : querySnapShot.docs[0].data().host_id,
                    profileMessage : querySnapShot.docs[0].data().profile_message,
                }
            });

            setCookie('_SOLSTICE_SELLER', querySnapShot.docs[0].id) ;

            return true ;
        } else {
            return false ;
        }
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const SellerAllProducts = () => async dispatch => {
    try {
        let productDocs = await getDocs(collection(db, "Web_Products")) ;

        productDocs = productDocs.docs.filter(productDoc => 
            (
                productDoc.data().creator_id === getCookie('_SOLSTICE_SELLER') ||
                productDoc.data().owners_ids.includes(getCookie('_SOLSTICE_SELLER')) 
            ) && (
                !productDoc.data().owners_ids.includes(getCookie('_SOLSTICE_BUYER')) &&
                productDoc.data().creator_id !== getCookie('_SOLSTICE_BUYER')
            )
        );

        let productsList = [] ;

        await Promise.all(
            productDocs.map(async product => {
                try {
                    let product_meta = await axios.get(ipfs_origin + product.data().ipfs_product_hash) ;

                    let possible = false ;

                    if(product_meta.data.price_type === 'legendary') {
                        possible = true ;
                        if( !product_meta.data.resellable && product.data().buyers_ids.includes(getCookie('_SOLSTICE_BUYER'))) possible = false ;
                    }
                    if(
                        (product_meta.data.price_type === 'recurring' || product_meta.data.price_type === 'free') 
                        &&  !product.data().buyers_ids.includes(getCookie('_SOLSTICE_BUYER'))
                    ) possible = true ;

                    if (
                        product_meta.data.price_type === 'rare' 
                    ) {
                        possible = true ;
                    }

                    if(possible) {
                        let solDocs = await getDocs(query(collection(db, "Web_Solts"), where('product_id', '==', product.id))) ;

                        let sols = [] ;

                        await Promise.all(
                            solDocs.docs.map(async sol  => {
                                try {
                                    let sol_meta = await axios.get(ipfs_origin + sol.data().ipfs_sol_hash ) ;
            
                                    let asset_url = ipfs_origin + sol_meta.data.ipfs_asset_hash ;

                                    sols.push({
                                        path : asset_url,
                                        ...sol.data(),
                                        ...sol_meta.data,
                                        id : sol.id,
                                    });
                                } catch(err) {

                                }
                            })
                        ) ;

                        if(sols.length) {
                            productsList.push({
                                ...product_meta.data,
                                ...product.data(),
                                id : product.id,
                                sols : sols
                            }) ;
                        }
                    }
                } catch(err) {
                    console.log(err) ;
                }
            })
        ) ;

        console.log(productsList) ;

        await dispatch({
            type : ActionTypes.SellerAllProducts,
            payload : productsList
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    } 
}

export const LoadingSellerProductsList = (loadingProductsList) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.LoadingSellerProductsList,
            payload : loadingProductsList
        }) ;
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const LoadingProfileLink = (loadingProfileLink) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.LoadingProfileLink,
            payload : loadingProfileLink
        });

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const InitLinkReducer = () => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.InitLinkReducer,
        }) ;
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}



