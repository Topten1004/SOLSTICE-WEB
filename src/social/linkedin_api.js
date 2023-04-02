import axios from "axios";
import qs from 'qs' ;

export const SendPaymentLinkByLinkedIn = async () => {
    try {
    
        // let rqData = qs.stringify({
        //     'grant_type' : 'authorization_code',
        //     'redirect_uri' : 'https://solsapp.com',
        //     'client_id' : process.env.REACT_APP_LINKEDIN_CLIENT_ID,
        //     'client_secret' : process.env.REACT_APP_LINKEDIN_CLIENT_SECRET
        // }) ;

        // let re = await axios({
        //     method : 'post',
        //     url : 'https://www.linkedin.com/oauth/v2/accessToken',
        //     headers : { 
        //         'Content-Type':'application/x-www-form-urlencoded'
        //     },
        //     body : rqData
        // }) ;

        // console.log(re) ;
        
        // return re ;

        let body = {
            "recipients": [
                "urn:li:person:8b1a73244",
            ],
            "subject": "Group conversation title",
            "body": "Hello everyone! This is a message conversation to demo the Message API.",
            "messageType": "MEMBER_TO_MEMBER",
        } 

        let bodyData = qs.stringify(body) ;

        let res = await axios({
            method : 'post',
            url : 'https://api.linkedin.com/v2/messages',
            headers : { 
                'Authorization': `Bearer ${process.env.REACT_APP_LINKEDIN_AUTH_TOKEN}`,
                'Access-Control-Allow-Methods':'GET,PUT,PATCH,POST,DELETE',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Request-Headers':'Origin, X-Requested-With, Content-Type, Accept',
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body : bodyData
        }) ;

        return res ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
