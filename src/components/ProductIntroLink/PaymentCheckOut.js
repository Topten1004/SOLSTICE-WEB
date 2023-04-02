import React, { useEffect, useState } from "react";

import Loading from 'react-loading-components' ;

import { connect } from 'react-redux' ;
import PropTypes from 'prop-types' ;

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

import { useStyles } from "./StylesDiv/Checkout.styles";

const PaymentCheckOut = (props) => {
    const stripe = useStripe();
    const elements = useElements();
    const theme = useTheme() ;
    const classes = useStyles() ;
    
    const  {
        clientSecret,
        id
    }  = props ;

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {

            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: location.origin + '/confirm/payment-intent-create',
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
            <Box className={classes.root}>
                {
                    <form id="payment-form" onSubmit={handleSubmit}>
                        <PaymentElement id="payment-element" />
                        {message && <Box id="payment-message" sx={{mt: '20px'}}>{message}</Box>}
                        <Box sx={{mt : '20px', display : 'flex', justifyContent : 'flex-end'}}>
                            <button disabled={isLoading || !stripe || !elements || !clientSecret} id="submit">
                                {
                                    isLoading ? <>
                                        <Loading type='oval' width={30} height={30} fill={theme.palette.green.G200} /> ...Pending
                                    </>
                                    : "Pay now"
                                }
                            </button>
                        </Box>
                    </form>
                }
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