import ActionTypes from "../actions/actionTypes";

const INITAL_STATE = {
   allPaymentsList : null
}

export default (state=INITAL_STATE, action) => {
    switch(action.type) {
        case ActionTypes.FetchAllPayments :
            return ({
                ...state,
                allPaymentsList : action.payload
            })
        default :
            return state ;
    }
}