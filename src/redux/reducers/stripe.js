import ActionTypes from '../actions/actionTypes' ;

const INITIAL_STATE = {
    stripeProvider: null,
    isStripeConnected : null
}

export default (state=INITIAL_STATE , action={}) => {
    switch(action.type) {
        case ActionTypes.ConnectAppToStripe : 
            return ({
                ...state,
                stripeProvider : action.payload.stripeProvider,
                isStripeConnected : action.payload.isStripeConnected
            }) ;
        case ActionTypes.ConnectStripe : 
            return ({
                ...state,
                stripeProvider : action.payload.stripeProvider,
                isStripeConnected : action.payload.isStripeConnected
            }) ;
        case ActionTypes.DisconnectStripe : 
            return ({
                ...state,
                stripeProvider : action.payload.stripeProvider,
                isStripeConnected : action.payload.isStripeConnected
            }) ;
        default :
            return state ; 
    }
}