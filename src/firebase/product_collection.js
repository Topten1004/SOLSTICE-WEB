import axios from "axios";
import { collection, deleteDoc, doc, getDoc, getDocs, query, where, updateDoc, increment } from "firebase/firestore";
import { ipfs_origin } from "../constants/static";
import { db } from "./config";
import { v4 as uuidv4 } from 'uuid' ;

import { create as ipfsHttpClient } from 'ipfs-http-client' ;

import CID from 'cids' ;

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0') ;

export const ActiveProductLink = async (product_id, receipts_count) => {
    try {
        await updateDoc(doc(db, "Web_Products", product_id), {
            active : true,
            receipts_count : receipts_count
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const DeleteProductById = async (product_id) => {
    try {
        await deleteDoc(doc(db, "Web_Products", product_id)) ;
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const ProductInfoByIntroLink = async (linkId) => {
    try {
        let link_type ;

        let productInfo = await getDocs(query(collection(db, "Web_Products"), where('intro_link_restricted', "==", linkId))) ;

        if(!productInfo.size) {
            productInfo = await getDocs(query(collection(db, "Web_Products"), where('intro_link_anyone', "==", linkId))) ;
            
            if(productInfo.size) link_type = 'anyone' ;
            else return false ;
        } else link_type = 'restricted' ;

        try {
            let product_meta = await axios.get(ipfs_origin + productInfo.docs[0].data().ipfs_product_hash) ;

            let creatorDoc = await getDoc(doc(db, "Web_Users", productInfo.docs[0].data().creator_id)) ;

            let sols = [] ;

            let solDocs = await getDocs(query(collection(db, "Web_Solts"), where("product_id", "==", productInfo.docs[0].id))) ;

            console.log(solDocs.size) ;
            
            await Promise.all(
                solDocs.docs.map(async solDoc => {
                    try {
                        let sol_meta = await axios.get(ipfs_origin + solDoc.data().ipfs_sol_hash) ;

                        // let asset_url = 'https://' + new CID(sol_meta.data.ipfs_asset_hash).toV1().toString('base32') + ".solsapp.infura-ipfs.io";
                        let asset_url = ipfs_origin + sol_meta.data.ipfs_asset_hash ;
                        
                        sols.push({
                            id : solDoc.id,
                            ...solDoc.data(),
                            ...sol_meta.data,
                            path : asset_url
                        })
                    } catch(err) {

                    }
                })
            )

            return {
                id : productInfo.docs[0].id,
                link_type : link_type,
                ...product_meta.data,
                ...productInfo.docs[0].data(),
                creator : {
                    id : creatorDoc.id,
                    ...creatorDoc.data()
                },
                sols : sols
            } ;
            
        } catch(err) {
            return false ;
        }
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const ProductInfoById = async (id) => {
    try {
        let productInfo = await getDoc(doc(db, "Web_Products", id)) ;

        if(!productInfo.exists()) return false ;

        try {
            let product_meta = await axios.get(ipfs_origin + productInfo.data().ipfs_product_hash) ;

            let creatorDoc = await getDoc(doc(db, "Web_Users", productInfo.data().creator_id)) ;

            let sols = [] ;

            let solDocs = await getDocs(query(collection(db, "Web_Solts"), where("product_id", "==", productInfo.id))) ;

            await Promise.all(
                solDocs.docs.map(async solDoc => {
                    try {
                        let sol_meta = await axios.get(ipfs_origin + solDoc.data().ipfs_sol_hash) ;

                        // let asset_url = 'https://' + new CID(sol_meta.data.ipfs_asset_hash).toV1().toString('base32') + ".solsapp.infura-ipfs.io";

                        let asset_url = ipfs_origin + sol_meta.data.ipfs_asset_hash ;

                        sols.push({
                            id : solDoc.id,
                            ...solDoc.data(),
                            ...sol_meta.data,
                            path : asset_url
                        })
                    } catch(err) {

                    }
                })
            )

            return {
                id : productInfo.id,
                ...product_meta.data,
                ...productInfo.data(),
                creator : {
                    id : creatorDoc.id,
                    ...creatorDoc.data()
                },
                sols : sols
            } ;
            
        } catch(err) {
            return false ;
        }
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const ProductInfoByAccessKey = async (access_key) => {
    try {
        let productInfo = await getDocs(query(collection(db, "Web_Products"), where('access_key', "==", access_key))) ;

        if(!productInfo.size) return false ;

        try {
            let product_meta = await axios.get(ipfs_origin + productInfo.docs[0].data().ipfs_product_hash) ;

            let creatorDoc = await getDoc(doc(db, "Web_Users", productInfo.docs[0].data().creator_id)) ;

            let sols = [] ;

            let solDocs = await getDocs(query(collection(db, "Web_Solts"), where("product_id", "==", productInfo.docs[0].id))) ;

            await Promise.all(
                solDocs.docs.map(async solDoc => {
                    try {
                        let sol_meta = await axios.get(ipfs_origin + solDoc.data().ipfs_sol_hash) ;

                        // let asset_url = 'https://' + new CID(sol_meta.data.ipfs_asset_hash).toV1().toString('base32') + ".solsapp.infura-ipfs.io";

                        let asset_url = ipfs_origin + sol_meta.data.ipfs_asset_hash ;

                        sols.push({
                            id : solDoc.id,
                            ...solDoc.data(),
                            ...sol_meta.data,
                            path : asset_url
                        })
                    } catch(err) {

                    }
                })
            )

            return {
                id : productInfo.docs[0].id,
                ...product_meta.data,
                ...productInfo.docs[0].data(),
                creator : {
                    id : creatorDoc.id,
                    ...creatorDoc.data()
                },
                sols : sols
            } ;
            
        } catch(err) {
            return false ;
        }
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdateRecurringBuyers = async (product_id, buyer_id, access_key) => {
    try {
        let productDoc = await getDoc(doc(db, "Web_Products", product_id)) ;

        let buyerDoc = await getDoc(doc(db, "Web_Users", buyer_id)) ;

        let temp = productDoc.data().buyers ;

        temp[buyerDoc.data().email] = {
            paid_at : new Date().getTime(),
            buyer_id : buyer_id,
            buyer_email : buyerDoc.data().email,
            access_key : access_key
        }

        await updateDoc(doc(db, "Web_Products", product_id), {
            buyers : {...temp}
        }) ;

        return true ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdateRareOwners = async (product_id, owner_id, owner_wallet) => {
    try {
        let rareDoc = await getDoc(doc(db, "Web_Products", product_id)) ;

        let owners_ids = rareDoc.data().owners_ids ;
        let owners_wallets = rareDoc.data().owners_wallets ;

        let temp = {
            ...owners_wallets
        } ;

        temp[owner_id] = {
            wallet : owner_wallet
        }

        updateDoc(doc(db, "Web_Products", product_id), {
            owners_ids : [...owners_ids, owner_id],
            owners_wallets : {
                ...temp
            }
        })

        return true ;
    }catch(err){
        console.log(err) ;
        return false ;
    }
}

export const UpdateLegenOwners = async (product_id, owner_id, owner_wallet) => {
    try {
        let productDoc = await getDoc(doc(db, "Web_Products", product_id)) ;

        let owners_ids = productDoc.data().owners_ids ;
        let owners_wallets = productDoc.data().owners_wallets ;

        let temp = {...owners_wallets} ;

        temp[owner_id] = {
            wallet : owner_wallet
        } ;

        updateDoc(doc(db, "Web_Products", product_id), {
            owners_ids : [...owners_ids, owner_id],
            owners_wallets : {...temp}
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdateLegenBuyers = async (product_id, buyer_id, access_key) => {
    try {
        let buyerDoc = await getDoc(doc(db, "Web_Users", buyer_id)) ;
        let productDoc = await getDoc(doc(db, "Web_Products", product_id)) ;

        let temp = productDoc.data().buyers ;

        temp[`${buyerDoc.data().email}`] = {
            id : buyerDoc.id,
            access_key : access_key,
            wallet : buyerDoc.data().wallet || null,
        }
        
        await updateDoc(doc(db, "Web_Products", product_id), {
            buyers : {...temp}
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const CheckBuyerOrOwner = async (product_id, buyer_id, price_type) => {
    try {
        let productInfo = await getDoc(doc(db, "Web_Products", product_id)) ;
        let buyerDoc = await getDoc(doc(db, "Web_Users", buyer_id)) ;

        if(price_type === 'legendary') {

            if(
                Object.keys(productInfo.data().buyers).includes(buyerDoc.data().email)
            ) return 'buyer' ;
        }

        if(price_type === 'rare') {
            if(productInfo.data().owners_ids.includes(buyer_id)) return 'owner' ;
        }

        if(price_type === 'recurring' || price_type === 'free') {
            if(
                Object.entries(productInfo.data().buyers).filter(([id, buyer]) => {
                        id === buyerDoc.data().email
                    }
                ).length
            ) return 'buyer' ;
        }

        return false ;

    } catch(err) {
        console.log(err) ;
        return false;
    }
}

export const FreeOfferProduct = async (product_id, buyer_id, access_key) => {
    try {

        let buyerDoc =  await getDoc(doc(db, "Web_Users", buyer_id)) ;
        let productDoc = await getDoc(doc(db, "Web_Products", product_id)) ;

        let temp = productDoc.data().buyers ;

        temp[buyerDoc.data().email] = {
            id : buyerDoc.id,
            email : buyerDoc.data().email,
            access_key : access_key
        }

        await updateDoc(doc(db, "Web_Products", product_id), {
            buyers : temp
        }) ;
        
        return true ;
    } catch(err) {
        return false ;
    }
}

export const UpdateLegendaryProduct = async (product_id, product_name, product_description, product_price) => {
    try {
        let productInfo = await getDoc(doc(db, "Web_Products", product_id)) ;

        let old_product_meta_data = await axios.get(ipfs_origin + productInfo.data().ipfs_product_hash) ;

        let meta_data = JSON.stringify({
            ...old_product_meta_data.data,

            product_name : product_name,
            product_description : product_description,

            product_price : product_price ,
        }) ;

        let added = await client.add(meta_data) ;

        await updateDoc(doc(db, "Web_Products", product_id), {
            ipfs_product_hash : added.path,
        }) ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdateRecurringProduct = async (product_id, product_name, product_description, recurring_price) => {
    try {
        let productInfo = await getDoc(doc(db, "Web_Products", product_id)) ;

        let old_product_meta_data = await axios.get(ipfs_origin + productInfo.data().ipfs_product_hash) ;

        let meta_data = JSON.stringify({
            ...old_product_meta_data.data,

            product_name : product_name,
            product_description : product_description,

            recurring_price : recurring_price ,
        }) ;

        let added = await client.add(meta_data) ;

        await updateDoc(doc(db, "Web_Products", product_id), {
            ipfs_product_hash : added.path,
        }) ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const MoveProductToTrash = async (product_id) => {
    try {
        await updateDoc(doc(db, "Web_Products", product_id), {
            deleted : true
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdateProductSoldCount = async (product_id) => {
    try {
        await updateDoc(doc(db, "Web_Products", product_id), {
            sold_count : increment(1)
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}