import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "./config";

export const PlaceBid = async (
    creator_id, creator_wallet, creator_profile_picture_url,
    bidder_id, bidder_full_name,  bidder_profile_picture_url, bidder_wallet,
    product_id, product_name, product_type, product_description, 
    nft_id, nft_type, 
    minimum_bidding, bid_amount, bid_price, bid_unit, destination
) => {
    try {
        await addDoc(collection(db, 'Web_Bids'), {
            creator_id : creator_id ,
            creator_wallet : creator_wallet,
            creator_profile_picture_url : creator_profile_picture_url,

            bidder_id : bidder_id ,
            bidder_full_name : bidder_full_name,
            bidder_profile_picture_url : bidder_profile_picture_url,
            bidder_wallet : bidder_wallet,
            
            product_id : product_id,
            product_name : product_name,
            product_type : product_type,
            product_description : product_description,
            nft_id : nft_id,
            nft_type : nft_type,
            minimum_bidding : minimum_bidding,
            bid_amount : bid_amount,
            bid_price : bid_price,
            bid_unit : bid_unit,

            destination : destination,
            status : 'requested',
            created_at : new Date().getTime(),
        }) ;
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const AcceptBid = async (bid_id) => {
    try {
        await updateDoc(doc(db, "Web_Bids", bid_id), {
            status : 'accepted'
        }) ;
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const DenyBid = async (bid_id) => {
    try {
        await updateDoc(doc(db, "Web_Bids", bid_id), {
            status : 'denied'
        }) ;
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const IncompleteBid = async (bid_id) => {
    try {
        await updateDoc(doc(db, "Web_Bids", bid_id), {
            status : 'incompleted'
        }) ;
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const CompleteBid = async (bid_id) => {
    try {
        await updateDoc(doc(db, "Web_Bids", bid_id), {
            status : 'completed'
        }) ;
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const CancelBid = async (bid_id) => {
    try {
        await updateDoc(doc(db, "Web_Bids", bid_id), {
            status : 'cancelled'
        }) ;
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}