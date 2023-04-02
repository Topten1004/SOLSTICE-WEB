import * as React from 'react' ;

import {connect} from 'react-redux' ;
import PropTypes from 'prop-types' ;
import { UpdateWalletData } from '../../../redux/actions/wallet';
import { ConnectStripe, DisconnectStripe } from '../../../redux/actions/stripe' ;

import { useStripeInfo } from '../../../contexts/StripeContext' ;

import swal from 'sweetalert';

import {
    Button,
} from '@mui/material' ;

import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    buttonCss : {
        backgroundImage: 'linear-gradient(to right, #f46b45 0%, #eea849  51%, #f46b45  100%)',
        marginTop : '20px !important',
        textAlign: 'center',
        textTransform: 'capitalize !important',
        transition: '0.5s !important',
        backgroundSize: '200% auto !important',
        color: 'white',          
        boxShadow: '0 0 15px #eee !important',
        borderRadius: '30px !important',
        height : '50px !important',
        padding : '25px 25px !important',
        fontSize : '17px !important', fontWeight : 'bold !important',
 
        "&:hover" : {
            backgroundPosition: 'right center',
            color: '#fff',
            textDecoration: 'none',
        }
        // backgroundImage: 'linear-gradient(to right, #f46b45 0%, #eea849  51%, #f46b45  100%)',
        // height: 45,
        // borderRadius : '30px !important',
        // margin: 10,
        // textAlign: 'center',
        // textTransform: 'uppercase',
        // transition: '0.5s !important',
        // backgroundSize: '200% auto !important',
        // color: 'white',            
        // boxShadow: '0 0 20px #eee !important',
        // "&:hover" : {
        //     backgroundPosition: 'right center !important', /* change the direction of the change here */
        //     color: '#fff !important',
        //     textDecoration: 'none !important',
        // }
    },
}))

const StripeConn = (props) => {
    const classes = useStyles() ;
    
    const {
        UpdateWalletData,
        ConnectStripe,
        DisconnectStripe
    } = props ;

    const {
        stripeProvider
    } = useStripeInfo() ;

    const handleClick = async () => {
        if(stripeProvider) {
            await DisconnectStripe() ;
            return ;
        } 

        await ConnectStripe() ;
    }
    
    return (
           
        <Button variant={'contained'} className={classes.buttonCss} onClick={handleClick}>
            {
                stripeProvider ? 'Disconnect Stripe' : 'Connect Stripe'
            }
        </Button>
    )
}
StripeConn.propTypes = {
    UpdateWalletData : PropTypes.func.isRequired,
    ConnectStripe : PropTypes.func.isRequired,
    DisconnectStripe : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    
})
const mapDispatchToProps = {
    UpdateWalletData,
    ConnectStripe,
    DisconnectStripe
}
export default connect(mapStateToProps, mapDispatchToProps)(StripeConn) ;