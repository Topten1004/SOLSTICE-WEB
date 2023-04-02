import * as React from 'react' ;

import { useWalletInfo } from '../../contexts/WalletContext' ;
import { useStripeInfo } from '../../contexts/StripeContext';

import {connect} from 'react-redux' ;
import PropTypes from 'prop-types' ;

import clsx from 'clsx' ;

import MetamaskConn from '../../components/Common/Wallets/MetamaskConn';
import StripeConn from '../Common/Stripes/StripeConn';

import WalletCancelImage from '../../assets/setting/WalletCancel.png' ;
import MetamaskImage from '../../assets/setting/Metamask.webp' ;
import AppleImage from '../../assets/setting/Apple.png' ;
import ConnectImage from '../../assets/links/Connect.png'
import DisconnectImage from '../../assets/links/Disconnect.png'
import StripeImage from '../../assets/common/Stripe.png' ;
import DisableStripeImage from '../../assets/common/DisableStripe.png' ;

import {
    Box ,
    Grid,
    useMediaQuery
} from '@mui/material' ;

import { useStyles } from './StylesDiv/Payment.styles';

const ConnectPayment = (props) => {
    const classes = useStyles() ;
    const match880 = useMediaQuery('(min-width : 880px)') ;
    const match775 = useMediaQuery('(min-width : 775px)') ;
    const match330 = useMediaQuery('(min-width : 330px)') ;
    const match520 = useMediaQuery('(min-width : 520px)') ;

    
    const [selWallet, setSelWallet] = React.useState('metamask') ;
    const [expanded, setExpanded] = React.useState(false) ;

    const {
        provider ,
        web3Provider,
        walletAddress,
        chainData,
        isWalletConnected,
    } = useWalletInfo() ;

    const {
        isStripeConnected
    } = useStripeInfo() ;
 
    const handleExpanded = () => {
        setExpanded(!expanded) ;
    }

    React.useEffect(() => {
      
    }, [isWalletConnected]) ;

    return (
        <Box className={expanded ? classes.rootExpand : classes.rootLess}>
            <Box className={classes.mainDiv}>
                <Box className={classes.hintDiv} onClick={handleExpanded}>
                    <Box className={classes.iconButton}>
                        {
                            (isWalletConnected || isStripeConnected) ? <img src={ConnectImage}/> : <img src={DisconnectImage} />
                        }
                    </Box>
                </Box>
                <Box className={classes.descriptionDiv}>
                    In order to begin accepting payments, you must connect a Stripe account. 
                    Stripe is a payment processing platform used by millions of online businesses including Google, Apple, Amazon, Facebook, and Discord. 
                    You're in good hands.
                </Box>
                <Grid container sx={{mt :'10px', pl : '10px'}}>
                    <Grid item xs={12} >
                        <Grid container>
                            <Grid item xs={12} sx={{display : 'flex',  justifyContent : 'flex-start',alignItems : 'flex-end', pb : '10px',}}>
                                <StripeConn />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Box className={classes.descriptionDiv} sx={{mt : '20px', borderTop : '1px solid gray'}}>
                    In order to purchase products, you have to connect to your wallet or stripe account.<br/>
                    You can select Metamask and Apple wallet.
                </Box>
                <Grid container sx={{mt :'20px'}}>
                    <Grid item xs={12} >
                        <Grid container>
                            <Grid item xs={match520 ? 6 : 12} >
                                <Box className={classes.buttonDiv} sx={{alignItems : !match520 && 'flex-start'}}>
                                    <Box className={clsx(classes.walletDiv, selWallet === 'metamask' && classes.activeWalletDiv)} onClick={() => setSelWallet('metamask')}>
                                        <img src={MetamaskImage}  width={30} height={30}/>
                                        <Box>Metamask Wallet</Box>
                                    </Box>
                                    <Box className={clsx(classes.walletDiv, selWallet === 'apple' && classes.activeWalletDiv)} onClick={() => setSelWallet('apple')}>
                                        <img src={AppleImage} width={30} height={30}/>
                                        <Box>Apple Wallet</Box>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={match520 ? 6 : 12} sx={{display : 'flex',  justifyContent : match520 ? 'center' : 'flex-start',alignItems : 'flex-end',pb : '10px',}}>
                                {
                                    selWallet === 'metamask' && <MetamaskConn />
                                }
                                {
                                    selWallet === 'apple' && <MetamaskConn />
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
ConnectPayment.propTypes = {
}
const mapStateToProps = state => ({
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(ConnectPayment) ;