import emailjs from 'emailjs-com';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getUnit } from '../utils/Helper';

export const SendPaymentLinkByEmail = async (linkUrl, productInfo, from_name, from_email, receiversList,
    emailSubject, emailMessage
) => {
    try {
        let message = `
            <html>
                <body>
                    <h1>SOLSTICE Team!</h1><br/>
        ` ;

        message += ( "Subject : " + emailSubject + "<br/>") ;
        message += ( "Message : <pre>" + emailMessage + "<pre/><br/>") ;
        message += ( "Creator : " + from_name + "<br/>" ) ;
        message += ( "From : " + from_email + "<br/>" ) ;

        message += "Product Information<br/>" ;

        message += ( "Product Name : " + productInfo.product_name + "<br/>") ;
        message += ( "Product Description : " + productInfo.product_description + "<br/>" ) ;
        message += ( "Product Type : " + productInfo.product_type + "<br/>" ) ;
        
        if(productInfo.price_type === 'legendary') {
            message += ( "Product Price : " + productInfo.product_price + "<br/>" ) ;
            message += ( "Product Currency : " + getUnit(productInfo.product_unit) + "<br/>" ) ;
            if(productInfo.resellable) {
                message += ( "Ticket Price : " + productInfo.ticket_price  + "<br/>") ;
                message += ( "Ticket Currency : " + getUnit(productInfo.ticket_unit) + "<br/>" ) ;
                message += ( "Royalty : " + productInfo.royalty + "<br/>" ) ;
            }
            message += ( "Created At : " + new Date(productInfo.created_at).toLocaleDateString() + "<br/>" ) ;
        }

        if(productInfo.price_type === 'rare') {
            message += ( "Minimum Bidding Price : " + productInfo.minimum_bidding + "<br/>" ) ;
            message += ( "Bid Currency : " + getUnit(productInfo.bid_unit) + "<br/>" ) ;
            message += ( "Royalty : " + productInfo.royalty + "<br/>" ) ;
            message += ( "NFT ID : #" + productInfo.nft_id + "<br/>" ) ;
            message += ( "Created At : " + new Date(productInfo.created_at).toLocaleDateString() + "<br/>" ) ;
        }

        if(productInfo.price_type === 'recurring') {
            message += ( "Price : " + productInfo.recurring_price + "<br/>" ) ;
            message += ( "Currency : " + getUnit(productInfo.recurring_unit) + "<br/>" ) ;
            message += ( "Created At : " + new Date(productInfo.created_at).toLocaleDateString() + "<br/>" ) ;
        }

        if(productInfo.price_type === 'free') {
            message += ( "Created At : " + new Date(productInfo.created_at).toLocaleDateString() + "<br/>" ) ;
        }

        message += "Link URL : " + linkUrl ;

        message += `
            </body>
                </html>
        ` ;

        console.log(message) ;

        await Promise.all(
            receiversList.map(async receiver => {
                let templateParams = {
                    from_email : from_email ,
                    to_email : receiver,
                    message : message
                }
        
                await emailjs.send(process.env.REACT_APP_EMAIL_SERVICE_ID, process.env.REACT_APP_EMAIL_TEMPLATE_ID, templateParams, process.env.REACT_APP_EMAIL_USER_ID) ;
            })
        )

        return true ;
        
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const SendProductLink = async (seller_id, buyer_id, buyer_full_name, product_id, access_key) => {
    try {
        if(!access_key) return false ;

        let sellerDoc = await getDoc(doc(db, "Web_Users", seller_id)) ;
        let buyerDoc = await getDoc(doc(db, "Web_Users", buyer_id)) ;

        let message = `
            <html>
                <body>
                    <h1>SOLSTICE Team!</h1><br/>
        ` ;

        message += ( "Creator : " + sellerDoc.data().full_name ) ;
        message += ( "Creator Email : " + sellerDoc.data().email + "<br/>" ) ;

        message += ( "Product URL : " + location.origin + "/product-link?id="+ product_id +"&access_key=" + access_key ) ;
        
        message += `
            </body>
                </html>
        ` ;

        let templateParams = {
            from_email : sellerDoc.data().email ,
            to_email : buyerDoc.data().email,
            message : message
        }

        let txSendEmail = await emailjs.send(process.env.REACT_APP_EMAIL_SERVICE_ID, process.env.REACT_APP_EMAIL_TEMPLATE_ID, templateParams, process.env.REACT_APP_EMAIL_USER_ID) ;

        message = `
            <html>
                <body>
                    <h1>SOLSTICE Team!</h1><br/>
        ` ;

        message += ( "Customer : " + buyer_full_name + "<br/>" ) ;
        message += ( "Customer Email : " + buyerDoc.data().email + "<br/>" ) ;
        message += ( buyer_full_name + " bought your product successfully.<br/>" 
                     + "Please, check your stripe account"
        ) ;

        message += `
            </body>
                </html>
        ` ;

        templateParams = {
            from_email : buyerDoc.data().email ,
            to_email : sellerDoc.data().email,
            message : message
        }

        txSendEmail = await emailjs.send(process.env.REACT_APP_EMAIL_SERVICE_ID, process.env.REACT_APP_EMAIL_TEMPLATE_ID, templateParams, process.env.REACT_APP_EMAIL_USER_ID) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const SendVerificationCodeByEmail = async (to_email) => {
    try {

        console.log(to_email) ;
        
        let message = `
            <html>
                <body>
                    <h1>SOLSTICE Team!</h1><br/>
        ` ;

        let verify_code = Math.floor(100000 + Math.random() * 900000);

        message += ( "Verification Code : " + verify_code ) ;
        
        message += `
            </body>
                </html>
        ` ;

        let templateParams = {
            from_email : process.env.REACT_APP_ADMIN_EMAIL ,
            to_email : to_email,
            message : message
        }

        await emailjs.send(process.env.REACT_APP_EMAIL_SERVICE_ID, process.env.REACT_APP_EMAIL_TEMPLATE_ID, templateParams, process.env.REACT_APP_EMAIL_USER_ID) ;

        return verify_code ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
