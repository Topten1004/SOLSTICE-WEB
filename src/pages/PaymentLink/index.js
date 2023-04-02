import * as React from 'react' ;
import { useLocation, useSearchParams } from 'react-router-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;

import NotFound from '../../components/Common/NotFound';

import Loading from 'react-loading-components' ;

import PaymentCheckOut from './PaymentCheckOut';

import { retrievePaymentIntent } from '../../stripe/payment_api';
import { loadStripe } from "@stripe/stripe-js";

import {
    Elements,
} from "@stripe/react-stripe-js";

import {
    Box
} from '@mui/material' ;

import  {makeStyles, useTheme} from '@mui/styles' ;

const useStyles = makeStyles((theme) => ({
    root : {

    },
    loadingDiv : {
        width : '100%' , minHeight : '100vh',
        display : 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column', gap : '10px',
        background : theme.palette.blue.main
    }
})) ;

const stripePromise =  loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY);

const PaymentLink = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;

    const {
    } = props ;
    
    const [urlParams, setUrlParams] = useSearchParams() ;
    const [isPassed, setPassed] = React.useState(false) ;
    const [clientSecret, setClientSecret] = React.useState(false) ;
    const [metaData, setMetaData] = React.useState(null) ;
    const [loading, setLoading] = React.useState(true) ;

    const appearance = {
        theme: 'stripe',

        variables: {
            colorPrimary: '#0570de',
            colorBackground: theme.palette.blue.main,
            colorText: theme.palette.green.A200,
            colorDanger: '#df1b41',
            fontFamily: 'Montserrat !important',
            fontSizeBase : '20px',
            borderRadius: '4px',
        }
    };

    const options = {
        clientSecret,
        appearance,
    };

    const failLoading = async () => {
        setPassed(false) ;
        setLoading(false) ;
    }

    const successLoading = async () => {
        setPassed(true);
        setLoading(false) ;
    }
    
    React.useEffect(async () => {
        if(urlParams) {
            if(!urlParams.get('payment_intent') || !urlParams.get('payment_intent_client_secret')) {
                failLoading() ;
                return ;
            }

            let res = await retrievePaymentIntent(urlParams.get('payment_intent')) ;

            if(!res) {
                failLoading() ;
                return ;
            }

            if(res.client_secret !== urlParams.get('payment_intent_client_secret')) {
                failLoading() ;
                return ;
            }

            setMetaData({
                ...res.metadata,
                amount : Number(res.amount) / 100,
                currency : res.currency
            }) ;

            setClientSecret(res.client_secret) ;
            successLoading() ;

            return ;
        }
    }, [urlParams]) ;

    React.useEffect(() => {
        return () => {

        }
    }, []) ;

    return (
        <>
            {
                loading ? <Box className={classes.loadingDiv}>
                    <Loading type='puff' width={100} height={100} fill='#43D9AD' />
                    <Box sx={{color : theme.palette.green.A200, fontSize : '30px', letterSpacing : '5px'}}>...Checking Payment Intent</Box>
                </Box> :
                (
                    !isPassed  ? <NotFound /> :
                    <Elements options={options} stripe={stripePromise}>
                        <PaymentCheckOut
                            metaData={metaData}
                        />
                    </Elements>
                )
            }
        </>
    )
}

PaymentLink.propTypes = {
}
const mapStateToProps = state => ({
}) ;
const mapDispatchToProps = {
} ;
export default connect(mapStateToProps, mapDispatchToProps)(PaymentLink) ;