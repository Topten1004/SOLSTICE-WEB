import { set, ref, child, update, increment } from 'firebase/database' ;
import { db, realDb } from "./config";

import { getCookie } from "../utils/Helper";

// Firebase Collection Pkg
import { UserInfoById , UpdateResellerCount, UpdateSellerCustomer , UpdateCreatorSoldCount} from "./user_collection";
import { UpdateRecurringBuyers, UpdateRareOwners , UpdateLegenOwners, UpdateLegenBuyers, 
    UpdateProductSoldCount ,
} from "./product_collection";
import { CreateNotify } from "./notify_collection";
import { CompleteBid } from "./bid_collection";

// Web3 Interact Pkg
import { SellNFT } from "../web3/market";

// Email Send Pkg
import { SendProductLink } from "../email";

// Stripe Api
import { retrievePaymentIntent, retrievePaymentMethod } from "../stripe/payment_api";
import { createTransfer } from "../stripe/transfer_api";

import md5 from "md5";
import { v4 as uuidv4 } from 'uuid' ;

import { toast } from 'react-toastify/dist/react-toastify';
import { retrieveBalance } from '../stripe/balance_api';
import { retrieveTxBalance } from '../stripe/tx_balance_api';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const CreatePayment = async (
    payment_intent_id,
    payment_intent_client_secret,

    creator_id,
    creator_wallet,
    creator_full_name,
    creator_account_name,
    creator_profile_picture_url,
    creator_profile_link,
    creator_email,
    creator_stripe_account_id,

    buyer_id,
    buyer_full_name,
    buyer_email,
    buyer_profile_picture_url,
    buyer_wallet,
    buyer_permission,

    product_id,
    product_name,
    price_type,
    product_price,
    price_unit,

    bid_amount,
    bid_id,
    nft_id,

    status,

    destination
) => {
    try {

        const nodeRef = child(ref(realDb), "Web_Payments/" + payment_intent_id); // id = custom ID you want to specify 

        await set(nodeRef, {
            payment_intent_id : payment_intent_id,
            payment_intent_client_secret : payment_intent_client_secret,

            creator_id : creator_id,
            creator_wallet : creator_wallet,
            creator_full_name : creator_full_name,
            creator_account_name : creator_account_name,
            creator_profile_picture_url : creator_profile_picture_url,
            creator_profile_link : creator_profile_link,
            creator_email : creator_email,
            creator_stripe_account_id : creator_stripe_account_id,

            buyer_id : buyer_id,
            buyer_full_name : buyer_full_name,
            buyer_email : buyer_email,
            buyer_profile_picture_url : buyer_profile_picture_url,
            buyer_wallet : buyer_wallet,
            buyer_permission : buyer_permission,

            product_id : product_id,
            product_name : product_name,
            price_type : price_type,
            product_price : product_price,
            price_unit : price_unit,

            bid_amount : bid_amount,
            bid_id: bid_id,
            nft_id : nft_id,

            status : status,
            confirmed : false,

            created_at : new Date().getTime(),

            destination : destination
        }) ;

        return true ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const AdminPayment = async () => {
    try {
        let updates = {} ;

        updates['Web_Payments'] = {
            
        }

        update(ref(realDb), updates) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdatePayment = async (old_payment_intent, payment_intent_id, newData) => {
    try {
        let updates = {} ;

        updates['Web_Payments/' + payment_intent_id] = {
            ...old_payment_intent,
            ...newData
        }

        update(ref(realDb), updates) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const DeletePayment = async (payment_intent_id) => {
    try {
        let updates = {} ;

        updates['Web_Payments/' + payment_intent_id] = null

        update(ref(realDb), updates) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false;
    }
}

export const AutoCheckPayments = async (paymentsList) => {
    try {

        console.log('auto check') ;

        if(!paymentsList) return ;
        
        let myPaymentList = paymentsList.filter(([id, payment]) => 
            payment?.available_on !== 'available'
        ) ;

        await Promise.all(
            myPaymentList.map(async ([id, payment]) => {

                let payment_intent = await retrievePaymentIntent(id) ;

                if(payment_intent.status !== payment.status) {
                    await UpdatePayment(payment, id, {
                        status : payment.status
                    }) ;
                }

                if(payment_intent.status === 'succeeded') {
                    let txBalance = await retrieveTxBalance(payment_intent.charges.data[0].balance_transaction) ;

                    if(txBalance?.status === 'pending' && !payment?.available_on) {
                        let payment_method = await retrievePaymentMethod(payment_intent.payment_method) ;

                        let amount = Number(txBalance.amount) / 100 ;
                        let sols_fee = Number(txBalance.amount - payment_intent.charges.data[0].transfer_data.amount - txBalance.fee) / 100 ;
                        let net = Number(txBalance.net) / 100 ;
                        let fee = Number(txBalance.fee) / 100 ;

                        await UpdatePayment(payment, id, {
                            available_on : new Date(txBalance.available_on * 1000).getTime(),
                            net : net,
                            total_after_fees : net - sols_fee,
                            fee : fee,
                            sols_fee : sols_fee,
                            payment_method : payment_method.card.brand,
                            amount : amount
                        }) ;
                    }
    
                    if(txBalance?.status === 'available') {
                        await UpdatePayment(payment, id, {
                            available_on : 'available',
                        }) ;

                        let userDoc = await getDoc(doc(db, "Web_Users", payment.creator_id)) ;

                        await updateDoc(doc(db, "Web_Users", getCookie('_SOLSTICE_AUTHUSER')), {
                            stripe_balance_incoming : userDoc.data().stripe_balance_incoming  - ( net - sols_fee ),
                            stripe_balance_available : userDoc.data().stripe_balance_available + ( net - sols_fee )
                        }) ;

                        return "incoming_success" ;
                    }
                }
            })
        )
        return true ;
    } catch(err) {
        console.log(err) ;

        return false ;
    }
}

export const ConfirmPayment = async (payment) => {
    try {

        let creatorInfo = await getDoc(doc(db, "Web_Users", payment.creator_id)) ;

        let creator_stripe_balance_incoming = creatorInfo.data().stripe_balance_incoming ;

        let payment_intent = await retrievePaymentIntent(payment.payment_intent_id) ;
       
        let txBalance = await retrieveTxBalance(payment_intent.charges.data[0].balance_transaction) ;

        let net = Number(txBalance.net) / 100 ;
        // let sols_fee = payment_intent.charges.data[0].application_fee_amount / 100 ;

        let sols_fee = Number(txBalance.amount - payment_intent.charges.data[0].transfer_data.amount - txBalance.fee) / 100 ;

        if(payment.price_type === 'recurring') {
            let access_key = uuidv4() ;

            await UpdateRecurringBuyers(payment.product_id, payment.buyer_id, access_key) ;

            let buyerInfo = await UserInfoById(payment.buyer_id) ;

            await CreateNotify({
                buyer : {
                    email : buyerInfo.email,
                    profile_link : buyerInfo.profile_link,
                    account_name : buyerInfo.account_name ,
                    full_name :  payment.buyer_full_name
                },
                price : payment.product_price,
                product : payment.product_name,
                unit : payment.price_unit,
                purchased_at : new Date().toLocaleDateString(),
                seller : payment.creator_id,
                type : 'recurring'
            }) ;

            await SendProductLink(payment.creator_id, payment.buyer_id, payment.buyer_full_name, payment.product_id, access_key) ;

            await UpdateProductSoldCount(payment.product_id) ;
            await UpdateCreatorSoldCount(payment.creator_id);
        }

        if(payment.price_type === 'rare') {
            let txSellNFT = await SellNFT(payment.buyer_wallet , md5(payment.buyer_id), payment.nft_id, payment.bid_amount) ;

            if( txSellNFT === 200 ) {
                await CompleteBid(payment.bid_id) ;
                await UpdateRareOwners(payment.product_id, payment.buyer_id, payment.buyer_wallet) ;
                await SendProductLink(payment.creator_id, payment.buyer_id, payment.product_id) ;

                await UpdateProductSoldCount(payment.product_id) ;
                await UpdateCreatorSoldCount(payment.creator_id) ;
            } 
        }

        if(payment.price_type === 'legendary') {
            if(payment.buyer_permission === 'reseller') {
                let txSellNFT = await SellNFT(payment.buyer_wallet, md5(payment.buyer_id), Number(payment.nft_id), 1) ;

                if( txSellNFT !== 200 ) {
                    
                    return ;
                }
            }
            
            let buyerInfo = await UserInfoById(payment.buyer_id) ;

            await CreateNotify({
                buyer : {
                    email : buyerInfo.email,
                    profile_link : buyerInfo.profile_link,
                    account_name : buyerInfo.account_name ,
                    role : payment.buyer_permission === 'reseller' ? "reseller" : "buyer",
                    full_name :payment.buyer_full_name
                },
                price : payment.product_price,
                product : payment.product_name,
                unit : payment.price_unit,
                purchased_at : new Date().toLocaleDateString(),
                seller : payment.creator_id,
                type : 'legendary'
            }) ;

            
            let access_key = uuidv4() ;

            if(payment.buyer_permission === 'reseller') {
                await UpdateResellerCount(payment.creator_id) ;
                await UpdateLegenOwners(payment.product_id, payment.buyer_id, payment.buyer_wallet) ;
            }
            else await UpdateLegenBuyers(payment.product_id, payment.buyer_id, access_key) ;

            await SendProductLink(payment.creator_id, payment.buyer_id, payment.buyer_full_name,  payment.product_id, access_key) ;

            await UpdateProductSoldCount(payment.product_id) ;

            await UpdateCreatorSoldCount(payment.creator_id) ;
        }

        await UpdateSellerCustomer(payment.creator_id, payment.buyer_id) ;

        await updateDoc(doc(db, "Web_Users", payment.creator_id), {
            stripe_balance_incoming : creator_stripe_balance_incoming + (net - sols_fee)
        }) ;

        await UpdatePayment(payment, payment.payment_intent_id, {
            confirmed : true,
            status : 'succeeded',
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;

        return false ;
    }
}