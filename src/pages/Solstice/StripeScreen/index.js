import * as React from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;
import { UserAccountInfo } from '../../../redux/actions/profile' ;

import Loading from 'react-loading-components' ;

import PaymentsList from '../../../components/Solstice/StripeScreen/PaymentsList';

import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import { getCookie } from '../../../utils/Helper';

import { WithdrawUserStripeBalance } from '../../../firebase/user_collection';

import { retrieveAccount } from '../../../stripe/account_api';
import { retrieveBalance } from '../../../stripe/balance_api';
import { createTransfer } from '../../../stripe/transfer_api';

import swal from 'sweetalert' ;

import {
    Box,
    TextField,
    InputAdornment,
    Grid,
    Button,
    useMediaQuery
} from '@mui/material' ;

import { useStyles } from './StylesDiv/index.styles';
import {useTheme} from '@mui/styles' ;

const StripeScreen = (props) => {

    const classes = useStyles() ;
    const theme = useTheme() ;

    const match715 = useMediaQuery('(min-width : 715px)') ;
    
    const {
        UserAccountInfo,
        stripeBalanceIncoming,
        stripeBalanceAvailable,
        stripe_account_id,
    } = props ;

    const [searchStr, setSearchStr] = React.useState('') ;
    const [withdrawAmount, setWithdrawAmount] = React.useState('') ;
    const [stripeStatus, setStripeStatus] = React.useState(null) ;
    const [loading, setLoading] = React.useState(false) ;

    const handleWithdraw = async () => {
        setLoading(true) ;

        if(stripeBalanceAvailable < withdrawAmount) {
            setLoading(false) ;

            return swal({
                title : 'Overflow Amount',
                icon : 'warning',
                buttons : {
                    confirm : {text : 'Got it'}
                },
            })
        }

        let balance = await retrieveBalance() ;

        let usdBalance = balance.available.filter(bal => bal.currency === 'usd')?.[0] ;

        if(usdBalance.amount / 100 < withdrawAmount) {
            setLoading(false) ;

            return swal({
                title : 'Currently on the way to solstice bank account',
                icon : 'info',
                buttons : {
                    confirm : {text : 'Got it'}
                },
            }) ;
        }

        let withdrawal_value = Number(withdrawAmount * 100).toFixed(0) ;

        let reqTransfer = {
            "amount" : withdrawal_value,
            "currency" : "usd",
            "destination" : stripe_account_id
        } ;
        
        let resTransfer = await createTransfer(reqTransfer) ;

        if(!resTransfer) {
            setLoading(false) ;
            return swal({
                title : 'Withdraw is failed',
                text : 'Please, contact us via admin@solsapp.com with details for assistance.',
                icon : 'error',
                buttons : {
                    confirm : {text : 'Got it'}
                },
            }) ;
        }

        await WithdrawUserStripeBalance(stripeBalanceAvailable -  withdrawAmount, getCookie('_SOLSTICE_AUTHUSER')) ;

        await UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;

        setLoading(false) ;

        return swal({
            title : 'Withdraw is successful',
            icon : 'success',
            buttons : {
                confirm : {text : 'Got it'}
            },
        }) ;
    }

    React.useEffect(() => {
        UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
    }, []) ;

    React.useEffect(async () => {
        if(stripe_account_id !== 'loading') {
            if(stripe_account_id) {
                let stripeAccount = await retrieveAccount(stripe_account_id) ;

                if(!stripeAccount) {
                    setStripeStatus('not created') ;
                } else {
                    if( stripeAccount.details_submitted ) {

                        if(stripeAccount.capabilities?.transfers === 'pending') setStripeStatus('pending') ;
                        else if(stripeAccount.capabilities?.transfers === 'active') setStripeStatus('active') ;
                        else setStripeStatus('inactive') ;

                    } else setStripeStatus('incomplete') ;
                }

                return ;
            } 
            setStripeStatus('not created') ;
        }
    }, [stripe_account_id]) ;

    return (
        <Box className={classes.root}>
            <Box className={classes.greenBlur} />
            <Box className={classes.blueBlur} />
            <Box className={classes.pageTitleDiv}>
                Transactions
            </Box>
            <Box >
                {/* <Box className={classes.listTypeDiv}>
                    <img src={IncomeImage} />
                    <img src={OutcomeImage} />
                </Box> */}
                {/* <Box className={classes.stripeInfoDiv}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Box className={classes.stripeStatusDiv} sx={{color : stripeStatus !== 'active' && 'red !important'}}>
                                {
                                   stripeStatus && stripeStatus !== 'active' && "Your stripe account is " + stripeStatus
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={match715 ? 6 : 12}>
                            Incoming Balance :
                        </Grid>
                        <Grid item xs={match715 ? 6 : 12} sx={{paddingLeft : '15px'}}>
                            { stripeBalanceIncoming } USD
                        </Grid>
                        <Grid item xs={match715 ? 6 : 12}>
                            Available Balance :
                        </Grid>
                        <Grid item xs={match715 ? 6 : 12} sx={{paddingLeft : '15px'}}>
                            { stripeBalanceAvailable } USD
                        </Grid>
                        <Grid item xs={match715 ? 6 : 12}>
                            Withdrawal Amount :
                        </Grid>
                        <Grid item xs={match715 ? 6 : 12} sx={{paddingLeft : '15px'}}>
                            <TextField 
                                size='small'
                                type='number'
                                placeholder='Enter your amount'
                                fullWidth
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                                disabled={!stripeBalanceAvailable || stripeStatus !== 'active'}

                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        <MonetizationOnIcon/> &nbsp;|
                                    </InputAdornment>,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{display : 'flex', justifyContent : 'flex-end', marginBottom : '0px !important'}}>
                            <Button variant={'contained'} className={classes.buttonCss} onClick={handleWithdraw}
                                disabled={stripeStatus !== 'active' || !stripeBalanceAvailable || !withdrawAmount || loading}
                                startIcon={loading && <Loading type='oval' width={15} height={15} fill={theme.palette.green.G200} />}
                            > 
                                Withdraw
                            </Button>
                        </Grid>
                    </Grid>
                </Box> */}
                <Box className={classes.searchDiv}>
                    <TextField 
                        size='small'
                        placeholder='Search customer by email, full name and user name.'
                        fullWidth
                        value={searchStr}
                        onChange={(e) => setSearchStr(e.target.value)}

                        InputProps={{
                            startAdornment: <InputAdornment position="start">
                                <ManageSearchIcon/>&nbsp;|
                            </InputAdornment>,
                        }}
                    />
                </Box>
            </Box>
            <PaymentsList 
                searchStr={searchStr}
            />
        </Box>
    );
}
StripeScreen.propTypes = {
    UserAccountInfo : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    stripeBalanceIncoming : state.profile.stripe_balance_incoming,
    stripeBalanceAvailable : state.profile.stripe_balance_available,
    stripe_account_id : state.profile.stripe_account_id,
}) ;
const mapDispatchToProps = {
    UserAccountInfo
}
export default connect(mapStateToProps, mapDispatchToProps)(StripeScreen) ;