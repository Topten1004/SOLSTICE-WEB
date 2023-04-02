import ActionTypes from './actionTypes' ;

import { convertObjToString, getCookie,  } from '../../utils/Helper';

import {  db } from '../../firebase/config';
import { doc,  updateDoc, addDoc, collection, getDocs, query, where, increment, deleteDoc } from 'firebase/firestore' ;

import lodash from 'lodash' ;
import { v4 as uuidv4 } from 'uuid' ;
import { create as ipfsHttpClient } from 'ipfs-http-client' ;

import { DeleteProductById } from '../../firebase/product_collection';
import { MintNFT} from '../../web3/mint';
import axios from 'axios';

import { ipfs_auth } from '../../constants/static';

const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization : ipfs_auth,
    },
}) ;
// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0') ;
// const client = ipfsHttpClient('https://infura.io/docs/ipfs/post/') ;

export const InputUploadFiles = (solsForUpload) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.InputUploadFiles,
            payload : solsForUpload
        });

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
} 

export const InputExternalLinks = (linksForUpload) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.InputExternalLinks,
            payload : linksForUpload
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;

        return false ;
    }
}

export const InputProductName = (productName) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.InputProductName,
            payload : productName
        });

        return true ;
    } catch(err) {
        console.log(err) ;

        return false ;
    }
}

export const InputProductType = (product_type) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.InputProductType,
            payload : product_type
        })
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const InputPriceConfig = (productDescription, resellTick, priceType, productType) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.InputPriceConfig,
            payload : {
                productDescription : productDescription,
                resellTick : resellTick,
                priceType : priceType,
                productType : productType
            }
        });
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const InputLegenPriceConfig = (productPrice, priceUnit, resellPrice, resellUnit, resellCount, royalty, stripeCard) => async dispatch => {
    try {

        await dispatch({
            type : ActionTypes.InputLegenPriceConfig,
            payload : {
                productPrice : productPrice,
                priceUnit : priceUnit,
                resellPrice : resellPrice,
                resellUnit : resellUnit,
                resellCount : resellCount,
                royalty : royalty,
                stripeCard : stripeCard
            }
        });

        return true ;
    } catch(err) {
        console.log(err) ;

        return false ;
    }
}

export const InputRarePriceConfig = (biddingPrice, biddingUnit, availableItems, royalty, stripeCard, listingTime, unlimited) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.InputRarePriceConfig,
            payload : {
                biddingPrice : biddingPrice,
                biddingUnit : biddingUnit,
                availableItems : availableItems,
                royalty : royalty,
                stripeCard : stripeCard,
                listingTime : listingTime,
                unlimited : unlimited
            }
        });

        return true ;
    } catch(err) {  
        console.log(err) ;
        return false ;
    }
}

export const InputRecurringPriceConfig = (subscriptionPrice, releaseDate, recurringUnit) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.InputRecurringPriceConfig,
            payload : {
                subscriptionPrice : subscriptionPrice,
                recurringUnit : recurringUnit,
                releaseDate : releaseDate
            }
        });
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const InputFreePriceConfig = (subscriptionPrice, releaseDate, freeUnit) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.InputFreePriceConfig,
            payload : {
                subscriptionPrice : subscriptionPrice,
                freeUnit : freeUnit,
                releaseDate : releaseDate
            }
        });

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UploadSolsToIpfs = async (solsForUpload, docRef, dispatch) => {
    try {
        let total = 0 ;
        let upload_progress = 0 ;

        let ipfs_sols_hashes = [] ;

        await Promise.all (
            solsForUpload.map(async file => {
                total += Number( file.size );
            })
        ) ;

        await Promise.all(
            solsForUpload.map(async file => {
                try {
                    let added = await client.add(
                        file.raw,
                        {
                            progress : async (prog) => {
                                await dispatch({
                                    type : ActionTypes.UpdateUploadProgress,
                                    payload : Number( Number( (upload_progress + Number(prog)) / total  * 100 ).toFixed(2) ) ,
                                }) ;
                            }
                        }
                    );

                    upload_progress += Number(file.size) ;

                    let meta_data = JSON.stringify({
                        name : file.name,
                        duration : file.duration,
                        format_duration : file.format_duration,
                        type : file.type,
                        platform : 'solscloud',
                        ipfs_asset_hash : added.path,
                        size : file.size,
                        category : file.category,
                        created_at : new Date().getTime(),
                    }) ;

                    added = await client.add(meta_data) ;

                    console.log(added.path) ;

                    await addDoc(collection(db, "Web_Solts"), {
                        product_id : docRef.id,
                        ipfs_sol_hash : added.path ,
                        access_key : uuidv4()
                    }) ;

                    ipfs_sols_hashes.push(added.path) ;

                    await dispatch({
                        type : ActionTypes.UpdateUploadedCount,
                    }) ;
    
                } catch(err) {
                    console.log('Error uploading File: ' + file.name , err) ;
                }
            })
        ) ;

        return ipfs_sols_hashes ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UploadLegens = (
    walletAddress,
    productName ,
    legenResell ,

    solsForUpload ,
    externalsForUpload ,
    solsPriceType ,
    solsProductType ,
    solsProductDescription,

    legenProductPrice ,
    legenPriceUnit ,
    legenTicketPrice,
    legenTicketUnit,
    legenTicketCount,

    legenRoyalty,
    legenStripeCard,
) => async dispatch => {
    try {
        let docRef = await addDoc(collection(db, "Web_Products"), {
            creator_id : getCookie("_SOLSTICE_AUTHUSER"),
            creator_wallet : walletAddress,

            stripe_card : legenStripeCard,
            buyers : {} ,
            owners : {},

            intro_link_restricted : uuidv4(),
            intro_link_anyone : uuidv4(),
            accessible_customers_to_restricted : [],

            sold_count : 0,
            receipts_count : 0,

            created_at : new Date().getTime()
        }) ;
       
        await dispatch({
            type : ActionTypes.UploadedProduct,
            payload: docRef.id
        }) ;

        let ipfs_sols_hashes = await UploadSolsToIpfs(solsForUpload, docRef, dispatch) ;

        if(!ipfs_sols_hashes.length) {
            await DeleteProductById(docRef.id) ;
            return ;
        }

        let meta_data = JSON.stringify({
            product_name : productName,
            resellable : legenResell,

            product_type : solsProductType,
            product_description : solsProductDescription,

            price_type : solsPriceType ,
            product_price : legenProductPrice ,
            product_unit : legenPriceUnit ,
            
            ticket_price : legenTicketPrice,
            ticket_unit : legenTicketUnit,
            ticket_count : legenTicketCount,
            
            royalty : legenRoyalty,

            ipfs_sols_hashes : ipfs_sols_hashes,

            created_at : new Date().getTime()
        }) ;

        let added = await client.add(meta_data) ;

        console.log(added.path) ;
        
        await updateDoc(doc(db, "Web_Products", docRef.id), {
            ipfs_product_hash : added.path,
        }) ;

        await updateDoc(doc(db, "Web_Users", getCookie('_SOLSTICE_AUTHUSER')), {
            product_count : increment(1)
        }) ;

        return docRef.id ;

    } catch(err) {
        console.log(err);
        return false ;
    }
}

export const MintMyNFT = async ( 
    creator_id,
    creator_wallet, 
    solstice_id_hash, 
    nft_type, 
    nft_price, 
    resell_price, 
    amount, 
    royalty, 
    resell, 
    nft_uri, 
    price_unit 
) => {
    try {
        let new_nft_id = await MintNFT(
            creator_wallet, solstice_id_hash, nft_type, nft_price, resell_price, amount, royalty, resell, nft_uri, price_unit
        )

        if(new_nft_id === 'error') {
            let solDocs = await getDocs(query(collection(db, "Web_Solts"), where('product_id', '==', nft_uri))) ;

            await Promise.all(
                solDocs.docs.map( async solDoc => {
                    await deleteDoc(doc(db, "Web_Solts", solDoc.id)) ;
                })
            )

            await deleteDoc(doc(db, "Web_Products", nft_uri)) ;

            return ;
        }

        await updateDoc(doc(db, "Web_Products", nft_uri), {
            nft_id : new_nft_id
        }) ;

        await updateDoc(doc(db, "Web_Users", creator_id), {
            product_count : increment(1)
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UploadRares = (
    walletAddress,
    productName ,

    solsForUpload ,
    externalsForUpload ,
    solsPriceType ,
    solsProductType ,
    solsProductDescription,

    rareBiddingPrice ,
    rareBiddingUnit,
    rareAvailableItems ,
    rareRoyalty,
    rareStripeCard ,
    rareListingTime ,
    rareUnlimited ,
) => async dispatch => {
    try {
        
        let docRef =  await addDoc(collection(db, "Web_Products"), {
            creator_id : getCookie('_SOLSTICE_AUTHUSER'),
            creator_wallet : walletAddress,
            
            stripe_card : rareStripeCard,

            buyers : {} ,
            owners : {},
            
            intro_link_restricted : uuidv4(),
            intro_link_anyone : uuidv4(),
            accessible_customers_to_restricted : [],

            sold_count : 0,
            receipts_count : 0,
            
            created_at : new Date().getTime(),
        }) ;
        
        await dispatch({
            type : ActionTypes.UploadedProduct,
            payload: docRef.id
        }) ;

        let ipfs_sols_hashes = await UploadSolsToIpfs(solsForUpload, docRef, dispatch) ;

        if(!ipfs_sols_hashes.length) return false ;

        let meta_data = JSON.stringify({
            product_name : productName,

            price_type : solsPriceType ,
            product_type : solsProductType,
            product_description : solsProductDescription,

            minimum_bidding : Number(rareBiddingPrice),
            bid_unit : rareBiddingUnit,
            available_items: Number(rareAvailableItems),
            
            listing_time : rareListingTime,
            unlimited : rareUnlimited,

            royalty : rareRoyalty,

            ipfs_sols_hashes : ipfs_sols_hashes,
            
            created_at : new Date().getTime()
        }) ;

        let added = await client.add(meta_data) ;
        
        await updateDoc(doc(db, "Web_Products", docRef.id), {
            ipfs_product_hash : added.path,
        }) ;

        return docRef.id ;

    } catch(err) {
        console.log(err);
        return false ;
    }
}

export const UploadRecurrings = (
    walletAddress,
    productName ,

    solsForUpload ,
    externalsForUpload ,
    solsPriceType ,
    solsProductType ,
    solsProductDescription,

    recurringSubscriptionPrice,
    recurringPriceUnit,
    recurringReleaseDate
) => async dispatch => {
    try {
        let docRef =  await addDoc(collection(db, "Web_Products"), {
            creator_id : getCookie('_SOLSTICE_AUTHUSER'),
            creator_wallet : walletAddress,

            release_date : new Date(convertObjToString(recurringReleaseDate)).getTime(),
            payment_method : 'Monthly',
            distribution_schedule : 'Weekly',

            buyers : {} ,
            owners : {} ,

            intro_link_restricted : uuidv4(),
            intro_link_anyone : uuidv4(),
            accessible_customers_to_restricted : [],

            sold_count : 0,
            receipts_count : 0,

            created_at : new Date().getTime(),
        }) ;

        await dispatch({
            type : ActionTypes.UploadedProduct,
            payload: docRef.id
        }) ;

        let ipfs_sols_hashes = await UploadSolsToIpfs(solsForUpload, docRef, dispatch) ;

        if(!ipfs_sols_hashes.length) return false ;
        
        let meta_data = JSON.stringify({
            product_name : productName,

            price_type : solsPriceType ,
            product_type : solsProductType,
            product_description : solsProductDescription,

            recurring_price : Number(recurringSubscriptionPrice),
            recurring_unit : Number(recurringPriceUnit),

            ipfs_sols_hashes : ipfs_sols_hashes,
            
            created_at : new Date().getTime()
        }) ;

        let added = await client.add(meta_data) ;

        await updateDoc(doc(db, "Web_Products", docRef.id), {
            ipfs_product_hash : added.path,
        }) ;

        await updateDoc(doc(db, "Web_Users", getCookie('_SOLSTICE_AUTHUSER')), {
            product_count : increment(1)
        }) ;

        return docRef.id ;

    } catch(err) {
        console.log(err);
        return false ;
    }
}

export const UploadFrees = (
    productName ,

    solsForUpload ,
    externalsForUpload ,
    solsPriceType ,
    solsProductType ,
    solsProductDescription,

    freeReleaseDate
) => async dispatch => {
    try {
        let docRef = await addDoc(collection(db,"Web_Products"), {
            creator_id : getCookie('_SOLSTICE_AUTHUSER'),

            buyers : {} ,
            owners : {} ,

            intro_link_restricted : uuidv4(),
            intro_link_anyone : uuidv4(),
            accessible_customers_to_restricted : [],
            
            distribution_schedule : 'Weekly',
            
            sold_count : 0,
            receipts_count : 0,
            
            created_at : new Date().getTime(),
            release_date : new Date(convertObjToString(freeReleaseDate)).getTime(),
        }) ;
       
        await dispatch({
            type : ActionTypes.UploadedProduct,
            payload: docRef.id
        }) ;

        let ipfs_sols_hashes = await UploadSolsToIpfs(solsForUpload, docRef, dispatch) ;

        if(!ipfs_sols_hashes.length) return false ;

        let meta_data = JSON.stringify({
            product_name : productName,

            price_type : solsPriceType ,
            product_type : solsProductType,
            product_description : solsProductDescription,

            ipfs_sols_hashes : ipfs_sols_hashes,

            created_at : new Date().getTime()
        }) ;

        let added = await client.add(meta_data) ;
        
        await updateDoc(doc(db, "Web_Products", docRef.id), {
            ipfs_product_hash : added.path ,
        }) ;

        await updateDoc(doc(db, "Web_Users", getCookie('_SOLSTICE_AUTHUSER')), {
            product_count : increment(1)
        }) ;

        return docRef.id ;
    } catch(err) {
        console.log(err);
        return false ;
    }
}

export const InitUploadReducer = () => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.InitUploadReducer
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UploadLoading = (isLoading) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.UploadLoading,
            payload : isLoading
        });
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}