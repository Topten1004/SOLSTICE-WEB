import ActionTypes from "./actionTypes" ;
import { loadStripe } from '@stripe/stripe-js' ;

export const ConnectStripe = () => async dispatch => {
    try { 
        let stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY) ;

        await dispatch({
            type : ActionTypes.ConnectStripe,
            payload : {
                stripeProvider : stripePromise,
                isStripeConnected : true
            }
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const DisconnectStripe = () => async dispatch => {
    try { 
        await dispatch({
            type : ActionTypes.DisconnectStripe,
            payload : {
                stripeProvider : null,
                isStripeConnected : false
            }
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
export const ConnectAppToStripe = () => async dispatch => {
    try {

        let stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY) ;

        await dispatch({
            type : ActionTypes.ConnectAppToStripe,
            payload : {
                stripeProvider : stripePromise,
                isStripeConnected : true
            }
        }) ;

        return true ;
    }
    catch(err) {
        console.log(err);

        return false ;
    }
}
