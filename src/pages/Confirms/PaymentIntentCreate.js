import * as React from 'react' ;
import { useLocation, useSearchParams,useNavigate } from 'react-router-dom';

import { connect } from 'react-redux';

import NotFound from '../../components/Common/NotFound';
import { retrievePaymentIntent , cancelPaymentIntent} from '../../stripe/payment_api';

import SuccessImage from '../../assets/confirm/Success.svg' ;
import CancelImage from '../../assets/confirm/Cancel.png' ;
import Loading from 'react-loading-components' ;

import {
    Box,
    Button
} from '@mui/material' ;

import  { useTheme } from '@mui/styles' ;
import { useStyles } from './StylesDiv/PaymentIntent.styles';
import { ConfirmPayment, DeletePayment, UpdatePayment } from '../../firebase/payment_collection';

const PaymentIntentCreate = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;
    const navigate = useNavigate() ;

    const [urlParams, setUrlParams] = useSearchParams() ;
    const [isPassed, setPassed] = React.useState(false) ;
    const [loading, setLoading] = React.useState(true) ;
    const [title, setTitle] = React.useState(null) ;
    const [message, setMessage] = React.useState(null) ;
    const [confirmStatus, setConfirmStatus] = React.useState(null) ;

    const {
        allPaymentsList
    } = props ;

    const failLoading = () => {
        setPassed(false) ;
        setLoading(false) ;
    }

    const successLoading = () => {
        setPassed(true) ;
        setLoading(false) ;
    }

    const handleConfirmCancel = () => {
        window.open('https://mail.google.com', '_self') ;
    }

    const handleConfirmSuccess = async () => {
        window.open('https://mail.google.com', '_self') ;
    }

    React.useEffect(async () => {
        if(!confirmStatus && urlParams && allPaymentsList) {
            setLoading(true) ;

            if(!urlParams.get('payment_intent') || !urlParams.get('payment_intent_client_secret') ) {
                failLoading() ;
                return ;
            }

            if(!allPaymentsList[urlParams.get('payment_intent')]){
                failLoading() ;
                return ;
            }

            if(allPaymentsList[urlParams.get('payment_intent')]?.confirmed) {
                setTitle('You payment is already confirmed') ;
                setConfirmStatus('succeeded') ;
                successLoading() ;
                return ;
            }

            let paymentIntent = await retrievePaymentIntent(urlParams.get('payment_intent')) ;

            if(!paymentIntent) {
                await DeletePayment(urlParams.get('payment_intent')) ;
            }

            if(paymentIntent.status !== 'succeeded') {
                await DeletePayment(urlParams.get('payment_intent')) ;
                await cancelPaymentIntent(urlParams.get('payment_intent')) ;

                setTitle('Your payment is canceled') ;
                setMessage('Please, Try again') ;
                setConfirmStatus('canceled') ;
                successLoading() ;
                return ;
            }
            
            setTitle('You payment is successful') ;
            setMessage('Please, Check your email box.') ;
            setConfirmStatus('succeeded') ;

            await ConfirmPayment(allPaymentsList[urlParams.get('payment_intent')]) ;

            successLoading() ;
        }
    }, [urlParams, allPaymentsList]) ;

    React.useEffect(() => {
        return () => {
            
        }
    }, []) ;

    return (
        <>
            {
                loading ? <Box className={classes.loadingDiv}>
                    <Loading type='puff' width={100} height={100} fill='#43D9AD' />
                    <Box sx={{color : theme.palette.green.G200, fontSize : '30px', letterSpacing : '5px'}}>...Confirming</Box>
                </Box> :
                (
                    !isPassed  ? <NotFound /> : <Box className={classes.root}>
                        <Box className={classes.greenBlur} />
                        <Box className={classes.blueBlur} />
                        <Box className={classes.successDiv}>
                            <img src={confirmStatus === 'succeeded' ? SuccessImage : CancelImage} className={classes.iconCss}/>
                            <Box className={classes.titleDiv} sx={{color : confirmStatus !== 'succeeded' && 'red !important'}}>
                                {title}
                            </Box>
                            <Box className={classes.textDiv} sx={{color : confirmStatus !== 'succeeded' && 'red !important'}}>
                                {message}
                            </Box>
                            {
                                confirmStatus === 'succeeded' && <Button className={classes.confirmButtonCss} 
                                    onClick={() => handleConfirmSuccess()}
                                >
                                    Got it
                                </Button>
                            }
                            {
                                confirmStatus === 'canceled' && <Button className={classes.confirmButtonCss} 
                                    onClick={() => handleConfirmCancel()}
                                >
                                    Got it
                                </Button>
                            }
                        </Box>
                    </Box>
                )
            }
        </>
    )
}

PaymentIntentCreate.propTypes = {
}
const mapStateToProps = state => ({
    allPaymentsList : state.payment.allPaymentsList
}) ;
const mapDispatchToProps = {
} ;
export default connect(mapStateToProps, mapDispatchToProps)(PaymentIntentCreate) ;