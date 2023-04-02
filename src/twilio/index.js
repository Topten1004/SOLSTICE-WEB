import axios from 'axios';
import qs from 'qs' ;

export const SendPaymentLinkByTwilio = async (payment_link, productInfo, creator_name, creator_email, creator_phone_number, receiversList, textMessage) => {
    try {
        let message = 'Creator Name : ' + creator_name + '\n';
        
        message += 'Creator Email : ' + creator_email + '\n' ;
        message += 'Creator Phone Number : ' + creator_phone_number + "\n" ;
        message += 'Product Link : ' + payment_link + '\n' ;

        message += 'Message : ' + textMessage ;

        const auth = 'Basic ' + new Buffer.from(process.env.REACT_APP_TWILIO_ACCOUNT_SID + ':' + process.env.REACT_APP_TWILIO_AUTH_TOKEN).toString('base64');

        await Promise.all (
            receiversList.map(async (receiver, index) => {
                let bodyData = {
                    Body: message,
                    From: process.env.REACT_APP_TWILIO_PHONE_NUMBER,
                    To: receiver
                } ;
                
                let body = qs.stringify(bodyData) ;

                try {
                    let res = await axios({
                        method : 'post',
                        url : "https://api.twilio.com/2010-04-01/Accounts/" + process.env.REACT_APP_TWILIO_ACCOUNT_SID + "/Messages.json",
                        headers : { 
                            'Authorization' : auth ,
                            'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        data : body
                    }) ;
                    
                    console.log(res.data.price) ;
                } catch(err) {
                    console.log(err) ;
                }
            })
        )
    } catch(err) {
        return false ;
    }
}

export const SendVerificationCodeByPhone = async (phoneNumber) => {
    try {
        let verify_code = Math.floor(100000 + Math.random() * 900000);

        let message = 'Verification Code : ' + verify_code + '\n';
        
        const auth = 'Basic ' + new Buffer.from(process.env.REACT_APP_TWILIO_ACCOUNT_SID + ':' + process.env.REACT_APP_TWILIO_AUTH_TOKEN).toString('base64');

        let bodyData = {
            Body: message,
            From: process.env.REACT_APP_TWILIO_PHONE_NUMBER,
            To: phoneNumber
        } ;

        let body = qs.stringify(bodyData) ;

        try {
            let res = await axios({
                method : 'post',
                url : "https://api.twilio.com/2010-04-01/Accounts/" + process.env.REACT_APP_TWILIO_ACCOUNT_SID + "/Messages.json",
                headers : { 
                    'Authorization' : auth ,
                    'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
                },
                data : body
            }) ;
            
            console.log(res.data.price) ;
            
            return verify_code ;
        } catch(err) {
            console.log(err) ;
        }
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}