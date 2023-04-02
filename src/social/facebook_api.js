// import facebook_login from 'facebook-chat-api' ;

export const SendPaymentLinkByFacebook = async (payment_link, productInfo, creator_name, creator_email, creator_phone_number, receiversList, textMessage) => {
    try {
        let message = 'Creator Name : ' + creator_name + '\n';
        
        message += 'Creator Email : ' + creator_email + '\n' ;
        message += 'Creator Phone Number : ' + creator_phone_number + "\n" ;
        message += 'Product Link : ' + payment_link + '\n' ;

        message += 'Message : ' + textMessage ;

        // facebook_login({email: "FB_EMAIL", password: "FB_PASSWORD"}, async (err, api) => {
        //     await Promise.all (
        //         receiversList.map(async receiver => {
        //             await api.sendMessage(msg, receiver);
        //         })
        //     )
        // });
        
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}