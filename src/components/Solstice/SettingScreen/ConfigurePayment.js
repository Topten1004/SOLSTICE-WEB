import * as React from 'react' ;

import { useLocation } from 'react-use';

import {connect} from 'react-redux' ;
import PropTypes from 'prop-types' ;
import { ExpandedItem } from '../../../redux/actions/setting';
import { UserAccountInfo } from '../../../redux/actions/profile' ;

import { getCookie } from '../../../utils/Helper';
import swal from 'sweetalert' ;
import clsx from 'clsx' ;
import Loading from 'react-loading-components' ;

import ExpandMoreIcon from '@mui/icons-material/ExpandMore' ;

import { 
    CreateStripeAccount, DeleteUserStripeAccountId, CompleteStripeAccount, CreateCustomerAccount 
} from '../../../firebase/user_collection';

import {
    Box ,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button
} from '@mui/material' ;

import { useStyles } from './StylesDiv/Payment.styles';
import { useTheme } from '@mui/material' ;
import { deleteAccount, retrieveAccount, listAccount, rejectAccount } from '../../../stripe/account_api';
import { listCustomer, deleteCustomer  } from '../../../stripe/customer_api';
import { createTransfer } from '../../../stripe/transfer_api' ; 

let scanTimer ;

const ConfigurePayment = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;
    const location = useLocation() ;
    
    const {
        ExpandedItem,
        UserAccountInfo,
        expandedItem,
        profileLink,
        accountName,
        email,
        phoneNumber,
        fullName,
        stripe_account_id,
        stripe_customer_id,
    } = props ;

    const [expand, setExpand] = React.useState(false) ;
    const [stripeStatus, setStripeStatus] = React.useState(null) ;
    const [mounted, setMounted] = React.useState(false) ;
    const [loading, setLoading] = React.useState(false) ;
    const [stripeAccount, setStripeAccount] = React.useState(null) ;
 
    const TriggerExpandedItem = (e, expanded, itemIndex) => {
        ExpandedItem(itemIndex) ;
        setExpand(expanded) ;
    }
    
    const handleCreateStripeAccount = async () => {
        // let list_customers = await listCustomer(100) ;

        // console.log(list_customers) ;

        // await Promise.all(
        //     list_customers.map(async customer => {
        //         await deleteCustomer(customer.id) ;
        //     })
        // )

        // let list_accounts = await listAccount(100) ;
        // console.log(list_accounts) ;

        // await Promise.all(
        //     list_accounts.map(async account => {
        //         if(account.id !== 'acct_1LIVZw2Ec2zq7IxG')
        //         await deleteAccount(account.id) ;
        //         // await rejectAccount(account.id , {
        //         //     "reason" : 'fraud'
        //         // }) ;
        //     })
        // )

        // return ;
        setLoading(true) ;

        if(!stripe_customer_id) {
            // await deleteCustomer('cus_M01AfDglu3wUyy') ;
            // return ;
            let req_create_customer =  {
                name : fullName,
                email: email,
                // phone : phoneNumber,
                // default_currency : "usd",
                // payment_method: 'pm_card_visa',
                "metadata[user_id]" : getCookie('_SOLSTICE_AUTHUSER'),
                // invoice_settings: { default_payment_method: 'pm_card_visa' }
            }
          
            let api_result = await CreateCustomerAccount(req_create_customer) ;
    
            if(api_result !== 200) {
                return swal({
                    title : 'Error',
                    text : "Account Creation Failed",
                    buttons : false,
                    timer : 5000,
                    icon : 'error'
                }) ; 
            }
        }

        let req_create_account = {
            "type" : "standard" ,
            // "email" : email,
            "default_currency" : "usd",
            "business_profile[url]" : profileLink,
            "business_profile[name]" : accountName,
            "business_type" : 'individual',
            // "capabilities[card_payments][requested]" : true,
            // "capabilities[transfers][requested]" : true,
            // 'individual[email]' : email,
            // "individual[phone]" : phoneNumber,
            "metadata[user_id]" : getCookie('_SOLSTICE_AUTHUSER')
        } ;

        let api_result = await CreateStripeAccount(req_create_account) ;

        if(api_result == 'create_account_error') {
            setLoading(false) ;
            return swal({
                title : 'Error',
                text : "Account Creation Failed",
                buttons : false,
                timer : 5000,
                icon : 'error'
            }) ;
        }

        if(api_result === 'create_account_link_error')  {
            setLoading(false) ;
            return swal({
                title : 'Error',
                text : "Account Creation Failed",
                buttons : false,
                timer : 5000,
                icon : 'error'
            }) ;
        }

    }

    const handleCompleteStripeAccount = async () => {
        setLoading(true) ;

        let api_result = await CompleteStripeAccount(stripe_account_id) ;

        if(api_result == 'create_account_error') {
            setLoading(false) ;
            
            return swal({
                title : 'Error',
                text : "Account Creation Failed",
                buttons : false,
                timer : 5000,
                icon : 'error'
            }) ;
        }

        if(api_result === 'create_account_link_error')  {
            setLoading(false) ;

            return swal({
                title : 'Error',
                text : "Account Creation Failed",
                buttons : false,
                timer : 5000,
                icon : 'error'
            }) ;
        }
    }

    const handleActivateStripeAccount = async () => {
        window.open('https://dashboard.stripe.com/login', '_blank') ;
    }

    React.useEffect(() => {
        if(expandedItem !== 0){
            setExpand(false) ;
        }
    }, [expandedItem]) ;

    React.useEffect(() => {
        UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;

        return () => {
        }
    }, []) ;

    React.useEffect(async () => {
        if(stripe_account_id !== 'loading') {
            if(stripe_account_id) {
                let stripeAccount = await retrieveAccount(stripe_account_id) ;

                console.log(stripeAccount) ;

                if(!stripeAccount) {
                    await DeleteUserStripeAccountId(getCookie('_SOLSTICE_AUTHUSER')) ;
                    await UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;

                    setStripeStatus('not created') ;
                } else {
                    if( stripeAccount.details_submitted ) {

                        if(stripeAccount.capabilities?.transfers === 'pending') setStripeStatus('pending') ;
                        else if(stripeAccount.capabilities?.transfers === 'active') {
                            setStripeAccount(stripeAccount) ;
                            setStripeStatus('active') ;
                        }
                        else setStripeStatus('inactive') ;

                    } else setStripeStatus('incomplete') ;
                }

                return ;
            } 
            setStripeStatus('not created') ;
        }
    }, [stripe_account_id]) ;

    return (
        <Box className={classes.root} >
            <Accordion
                expanded={expand}
                onChange={(e, expanded) => TriggerExpandedItem(e, expanded, 0)}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{backgroundColor : 'rgba(51, 139, 239, 0.21) !important'}}
                >
                    <Box sx={{display : 'flex', justifyContent : 'flex-start', alignItems : 'center'}}>
                        <Box className={clsx(classes.circlePrefix, stripeStatus === 'active' && classes.active)} /><Box>Configure payments</Box>
                    </Box>
                </AccordionSummary>
                <AccordionDetails
                    sx={{padding : '10px'}}
                >
                    {
                        stripeStatus === 'incomplete' && <>
                            <Box className={classes.descriptionDiv}>
                                In order to begin accepting payments, you should complete your stripe account information.
                                Please, complete your stripe account.
                            </Box>
                            <Button variant={'contained'} className={classes.buttonCss1} onClick={() => handleCompleteStripeAccount()} 
                                disabled={loading}
                                startIcon={ loading && <Loading type='tail_spin' width={25} height={25} fill='white' />}
                            >Submit Detail</Button>
                        </>
                    }
                    {
                        stripeStatus === 'pending' && <>
                            <Box className={classes.descriptionDiv}>
                                Your request of creating stripe account is pending...
                                Please, wait for while.
                            </Box>
                        </>
                    }
                    {
                        stripeStatus === 'active' && <Box className={classes.descriptionDiv}>
                           Stripe Account Email : {stripeAccount.email} <br/><br/>
                            Your stripe account is created successfully.
                            Stripe is a payment processing platform used by millions of online businesses including Google, Apple, Amazon, Facebook, and Discord.
                            You're in good hands.
                        </Box>
                    }
                    {
                        stripeStatus === 'not created' && <>
                            <Box className={classes.descriptionDiv}>
                                In order to begin accepting payments, you should create a Stripe account.
                            </Box>
                            <Button variant={'contained'} className={classes.buttonCss1} onClick={() => handleCreateStripeAccount()} 
                                disabled={loading}
                                startIcon={loading && <Loading type='oval' width={25} height={25} fill='white' />}
                            >Create Account</Button>
                        </>
                    }
                    {
                        stripeStatus === 'inactive' && <>
                            <Box className={classes.descriptionDiv}>
                                We can't transfer money to your stripe account.
                                Please, activate your transfer.
                            </Box>
                            <Button variant={'contained'} className={classes.buttonCss1} onClick={() => handleActivateStripeAccount()} >Active Transfer</Button>
                        </>
                    }
                    {
                        stripeStatus === null && <>
                            <Box className={classes.descriptionDiv}>
                                Checking your stripe account...
                            </Box>
                        </>
                    }
                </AccordionDetails>
            </Accordion>
        </Box>
       
    )
}
ConfigurePayment.propTypes = {
    ExpandedItem : PropTypes.func.isRequired,
    UserAccountInfo : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    expandedItem : state.setting.expandedItem,
    stripe_account_id : state.profile.stripe_account_id,
    stripe_customer_id : state.profile.stripe_customer_id,

    profileLink : state.profile.profileLink,
    accountName : state.profile.accountName,
    fullName : state.profile.fullName,
    email : state.profile.email,
    phoneNumber : state.profile.phoneNumber
})
const mapDispatchToProps = {
    ExpandedItem,
    UserAccountInfo
}
export default connect(mapStateToProps, mapDispatchToProps)(ConfigurePayment) ;