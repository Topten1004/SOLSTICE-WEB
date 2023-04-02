import * as React from 'react' ;
import { useLocation, useSearchParams,useNavigate } from 'react-router-dom';

import { connect } from 'react-redux';

import { retrieveAccount } from '../../stripe/account_api';
import NotFound from '../../components/Common/NotFound';

import SuccessImage from '../../assets/confirm/Success.svg' ;
import Loading from 'react-loading-components' ;

import {
    Box,
    Button
} from '@mui/material' ;

import  {makeStyles, useTheme} from '@mui/styles' ;
import { useStyles } from './StylesDiv/AccountCreate.styles';

const StripeAccountCreate = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;
    const navigate = useNavigate() ;

    const [urlParams, setUrlParams] = useSearchParams() ;
    const [isPassed, setPassed] = React.useState(false) ;
    const [loading, setLoading] = React.useState(true) ;

    const {
    } = props ;

    const failLoading = () => {
        setPassed(false) ;
        setLoading(false) ;
    }

    const successLoading = () => {
        setPassed(true) ;
        setLoading(false) ;
    }

    const handleGoConfigure = () => {
        navigate('/solstice/setting-screen') ;
    }

    React.useEffect(async () => {
        if(urlParams) {
            setLoading(true) ;

            if(!urlParams.get('stripe_account_id')) {
                failLoading() ;
                return ;
            }

            let stripeAccount = await retrieveAccount(urlParams.get('stripe_account_id')) ;

            console.log(stripeAccount) ;

            if(!stripeAccount || !stripeAccount?.metadata?.user_id || !stripeAccount?.details_submitted) {
                failLoading() ;
                return ;
            }
            successLoading() ;
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
                    <Box sx={{color : theme.palette.green.G200, fontSize : '30px', letterSpacing : '5px'}}>...Confirming</Box>
                </Box> :
                (
                    !isPassed  ? <NotFound /> : <Box className={classes.root}>
                        <Box className={classes.greenBlur} />
                        <Box className={classes.blueBlur} />
                        <Box className={classes.successDiv}>
                            <img src={SuccessImage} className={classes.iconCss}/>
                            <Box className={classes.titleDiv}>
                                Your SOLSTICE Stripe Account Created Successfully.
                            </Box>
                            <Box className={classes.textDiv}>
                                You can purchase solstice products with your stripe account.
                            </Box>
                            <Button className={classes.confirmButtonCss} onClick={() => handleGoConfigure()}>
                                Got it
                            </Button>
                        </Box>
                    </Box>
                )
            }
        </>
    )
}

StripeAccountCreate.propTypes = {
}
const mapStateToProps = state => ({
}) ;
const mapDispatchToProps = {
} ;
export default connect(mapStateToProps, mapDispatchToProps)(StripeAccountCreate) ;