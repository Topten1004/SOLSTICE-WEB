import React, { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import Loading from 'react-loading-components' ;

import { connect } from 'react-redux' ;
import PropTypes from 'prop-types' ;

import { UserInfoById } from "../../firebase/user_collection";

import {
    Elements,
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";

import {
    Box,
    Button,
    Grid
} from '@mui/material' ;

import { useTheme, makeStyles } from "@mui/styles";

import { useStyles } from "./StylesDiv/Payment.styles";

const PaymentCheckOut = (props) => {
    const stripe = useStripe();
    const elements = useElements();
    const theme = useTheme() ;
    const classes = useStyles() ;
    
    const  {
        metaData,
    }  = props ;

    const [urlParams, setUrlParams] = useSearchParams() ;
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [creatorProfile, setCreatorProfile] = useState(null) ;
    const [payable,setPayable] = useState(false) ;

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const confirm_client_secret = urlParams.get(
            "payment_intent_client_secret"
        );

        if (!confirm_client_secret) {
            return;
        }
        
        stripe.retrievePaymentIntent(confirm_client_secret).then(({ paymentIntent }) => {
            console.log(paymentIntent) ;

            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    setPayable(false);
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    setPayable(false);
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    setPayable(true) ;
                    break;
                default:
                    setMessage("Something went wrong.");
                    setPayable(true) ;
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
            e.preventDefault();

            if (!stripe || !elements) {

                return;
            }

            setIsLoading(true);

            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: location.origin + '/solstice/stripe-screen',
                },
            });

            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }

            setIsLoading(false);
    };

    useEffect(async () => {
        if(metaData) {
            let profile = await UserInfoById(metaData.creator_id) ;

            setCreatorProfile(profile) ;

            console.log(profile) ;
        }
    }, [metaData]) ;

    return (
            <Box className={classes.root}>
                <Box className={classes.greenBlur} />
                <Box className={classes.blueBlur} />

                <Box className={classes.paymentDiv}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Box>
                                <img src={ creatorProfile?.profile_picture_url } width={70} height={70}/>
                            </Box>
                            <Box className={classes.accountNameDiv}>
                                {
                                    creatorProfile?.account_name
                                }
                            </Box>
                            <Box className={classes.fullNameDiv}>
                                { creatorProfile?.full_name }
                            </Box>
                            <Box className={classes.productNameDiv}>
                                Product Name : {metaData?.product_name}
                            </Box>
                            <Box className={classes.priceDiv}>
                                $ {Number(metaData?.amount).toFixed(2)}
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <form id="payment-form" onSubmit={handleSubmit}>
                                <PaymentElement id="payment-element" />
                                {message && <Box id="payment-message" sx={{mt: '20px'}}>{message}</Box>}
                                <Box sx={{mt : '20px', display : 'flex', justifyContent : 'flex-end'}}>
                                    <button disabled={isLoading || !stripe || !elements || !payable} id="submit">
                                        {
                                            isLoading ? <>
                                                <Loading type='oval' width={30} height={30} fill={theme.palette.green.G200} /> ...Pending
                                            </>
                                            : "Pay now"
                                        }
                                    </button>
                                </Box>
                            </form>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
  );
}
PaymentCheckOut.propTypes = {
}
const mapStateToProps = state => ({

})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(PaymentCheckOut) ;