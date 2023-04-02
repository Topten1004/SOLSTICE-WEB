import * as React from 'react' ;

import Analysis from './Analysis';
import BuyerInfo from './BuyerInfo';
import PaymentCheckOut from './PaymentCheckOut' ;
import ConnectPayment from './ConnectPayment';
import SolsList from './SolsList' ;

import { loadStripe } from "@stripe/stripe-js";

import {
    Elements,
} from "@stripe/react-stripe-js";

import {
    Box,
    Grid,
    TextField,
    useMediaQuery
} from '@mui/material' ;

import { useTheme } from '@mui/styles';
import { useStyles } from './StylesDiv/Advertise.styles';

const stripePromise =  loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY);

const ProductAdvertise = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;

    const match1195 = useMediaQuery('(min-width : 1195px)') ;

    const {
        productInfo,
    } = props ;

    const [clientSecret, setClientSecret] = React.useState(false) ;
    const [paymentId, setPaymentId] = React.useState(false) ;

    const appearance = {
        theme: 'stripe',

        variables: {
            colorPrimary: '#0570de',
            colorBackground: theme.palette.blue.main,
            colorText: theme.palette.green.G200,
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

    React.useEffect(() => {
        console.log(productInfo?.sols) ;
    }, [productInfo]) ;

    return (
        <Box className={classes.root}>
            <ConnectPayment />
            <Box className={classes.blueBlur} />
            <Box className={classes.greenBlur} />
            <Box className={classes.paymentDiv}>
                <Grid container>
                    <Grid item xs={match1195 ? 6 : 15} 
                        sx={{borderRight : match1195 && '1px solid ' + theme.palette.green.G300, paddingRight : match1195 && '20px', 
                        display : 'flex', justifyContent : 'center'
                    }}>
                        <Analysis 
                            productInfo={productInfo}
                        />
                    </Grid>
                    <Grid item xs={match1195 ? 6 : 12} sx={{display : 'flex', justifyContent : 'center', mt : '20px'}}>
                        {
                            (clientSecret && paymentId) ?  <Box className={classes.cardPaymentDiv}>
                                    <Elements options={options} stripe={stripePromise}>
                                        <PaymentCheckOut
                                            clientSecret={clientSecret}
                                            id={paymentId}
                                        />
                                    </Elements>
                                </Box> : <BuyerInfo
                                productInfo={productInfo}
                                setClientSecret={setClientSecret}
                                setPaymentId={setPaymentId}
                            />
                        }
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default ProductAdvertise ;