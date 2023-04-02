import ActionTypes from '../actions/actionTypes' ;

const INITIAL_STATE = {
    topSellersList : null,
    productsList : null,
    activeProductsList : null
}

export default function cart(state=INITIAL_STATE, action) {
    switch(action.type) {
        case ActionTypes.TopSellersList :
            return ({
                ...state,
                topSellersList : action.payload
            })
        case ActionTypes.ActiveProductsList : 
            return ({
                ...state,
                activeProductsList : action.payload
            })
        case ActionTypes.ProductsListOrderBy :
            return ({
                ...state,
                productsList : action.payload
            })
        default : 
            return state ;
    }
}