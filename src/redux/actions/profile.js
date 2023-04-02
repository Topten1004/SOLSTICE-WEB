import ActionTypes from "./actionTypes";

import CID from 'cids' ;

import { db, auth } from "../../firebase/config";
import { doc, setDoc, getDoc, updateDoc, getDocs, query, collection, orderBy, where, deleteDoc } from 'firebase/firestore' ;
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage' ;
import { getCookie, getProductId, getUuid } from "../../utils/Helper";
import axios from "axios";

import { ipfs_origin } from '../../constants/static' ;

export const UserAccountInfo = (userUuid) => async dispatch => {
    try {
        let docSnap = await getDoc(doc(db, "Web_Users", userUuid) ) ;

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const d = new Date(docSnap.data().joined_date);

        let month = months[d.getMonth()];

        await dispatch({
            type : ActionTypes.UserAccountInfo,
            payload : {
                fullName : docSnap.data().full_name,
                email : docSnap.data().email,
                phone_number : docSnap.data().phone_number,
                coverPictureUrl : docSnap.data().cover_picture_url,
                coverPictureName : docSnap.data().cover_picture_name,
                profilePictureUrl : docSnap.data().profile_picture_url,
                profilePictureName : docSnap.data().profile_picture_name,
                productTypeList : docSnap.data().product_type_list,
                jobTag : docSnap.data().job_tag,
                accountName : docSnap.data().account_name,

                productCount : docSnap.data().product_count,
                platformCount : docSnap.data().platform_count,
                resellerCount : docSnap.data().reseller_count,
                totalSoldCount : docSnap.data().total_sold_count,

                customers : docSnap.data().customers,
                joinedDate : month + " " + d.getFullYear(),
                hostId : docSnap.data().host_id,
                profileMessage : docSnap.data().profile_message,
                profileLink : docSnap.data().profile_link,

                stripe_account_id : docSnap.data().stripe_account_id || null,
                stripe_customer_id : docSnap.data().stripe_customer_id || null,
                stripe_balance_incoming : docSnap.data().stripe_balance_incoming || 0,
                stripe_balance_available : docSnap.data().stripe_balance_available || 0
            }
        });

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const SaveNewMessage = (message) => async dispatch => {
    try {
        await updateDoc(doc(db, "Web_Users", getCookie('_SOLSTICE_AUTHUSER')), {
            profile_message : message
        });

        await dispatch({
            type : ActionTypes.UpdateProfileMessage,
            payload : message 
        }) ;

        return true ;
        
    } catch(err) {
        console.log(err);
        return false ;
    }
}

export const UserAllProducts = () => async dispatch => {
    try {
        let productDocs = await getDocs(collection(db, "Web_Products")) ;

        productDocs = productDocs.docs.filter(productDoc => 
            productDoc.data().creator_id === getCookie('_SOLSTICE_AUTHUSER') &&
            !productDoc.data().deleted
        );

        let productsList = [] ;

        await Promise.all(
            productDocs.map(async product => {
                try {
                    if(!product.data().ipfs_product_hash) {
                        await deleteDoc(doc(db, "Web_Products", product.id)) ;
                    } else {
                        let product_meta = await axios.get(ipfs_origin + product.data().ipfs_product_hash) ;

                        let solDocs = await getDocs(query(collection(db, "Web_Solts"), where('product_id', '==', product.id))) ;

                        let sols = [] ;

                        await Promise.all(
                            solDocs.docs.map(async sol  => {
                                try {
                                    let sol_meta = await axios.get(ipfs_origin + sol.data().ipfs_sol_hash ) ;
            
                                    let asset_url = ipfs_origin + sol_meta.data.ipfs_asset_hash ;
                                    // let asset_url = 'https://' + new CID(sol_meta.data.ipfs_asset_hash).toV1().toString('base32') + ".solsapp.infura-ipfs.io";

                                    sols.push({
                                        path : asset_url ,
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
            type : ActionTypes.UserAllProducts,
            payload : productsList
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    } 
}
export const LoadingProductsList = (loadingProductsList) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.LoadingProductsList,
            payload : loadingProductsList
        }) ;
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
