import React,{ useEffect } from 'react' ;

import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;

import { FetchCustomersList } from '../redux/actions/customers';
import { FetchAllPayments } from '../redux/actions/payment';
import { FetchAllNotify } from '../redux/actions/notify' ;

import Routing from './Routes';

import { WalletProvider } from '../contexts/WalletContext';
import { StripeProvider } from '../contexts/StripeContext';

import { ToastContainer } from 'react-toastify/dist/react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-number-input/style.css'


import {
    Box
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root : {
    }
}))

const Main = (props) => {
    const classes = useStyles() ;

    const {
        FetchCustomersList,
        FetchAllNotify,
        FetchAllPayments
    } = props ;

    const {
        provider,
        walletAddress,
        chainData,
        isWalletConnected,
        web3Provider,
        stripeProvider,
        isStripeConnected
    } = props ;

    useEffect(() => {
        FetchCustomersList() ;
        FetchAllNotify() ;
        FetchAllPayments() ;
    }, []) ;

    return (
        <Box className={classes.root}>
            <WalletProvider 
                value={{
                    provider,
                    web3Provider ,
                    walletAddress ,
                    chainData ,
                    isWalletConnected
                }}
            >
                <StripeProvider
                    value={{
                        stripeProvider,
                        isStripeConnected
                    }}
                >
                    <Routing />
                </StripeProvider>
            </WalletProvider>
            <ToastContainer />
        </Box>
    )
}

Main.propTypes = {
    FetchCustomersList : PropTypes.func.isRequired,
    FetchAllNotify : PropTypes.func.isRequired,
    FetchAllPayments : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    provider : state.wallet.provider,
    walletAddress : state.wallet.walletAddress,
    chainData : state.wallet.chainData,
    isWalletConnected : state.wallet.isWalletConnected,
    web3Provider: state.wallet.web3Provider,

    stripeProvider : state.stripe.stripeProvider,
    isStripeConnected : state.stripe.isStripeConnected
}) ;
const mapDispatchToProps = {
    FetchCustomersList,
    FetchAllNotify,
    FetchAllPayments
} ;
export default connect(mapStateToProps, mapDispatchToProps)(Main) ;