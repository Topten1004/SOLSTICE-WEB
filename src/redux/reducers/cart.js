import ActionTypes from '../actions/actionTypes' ;

const INITIAL_STATE = {
    bidsInfoList : null,
    ordersInfoList : null,
    txsInfoList : null,
}

export default function cart(state=INITIAL_STATE, action) {
    switch(action.type) {
        case ActionTypes.UserBidsInfoList :
            return ({
                ...state,
                bidsInfoList : action.payload
            });
        case ActionTypes.UserOrdersInfoList:
            return ({
                ...state,
                ordersInfoList : action.payload
            });
        case ActionTypes.UserTxsInfoList :
            return ({
                ...state,
                txsInfoList : action.payload
            });
        default : 
            return state ;
    }
}