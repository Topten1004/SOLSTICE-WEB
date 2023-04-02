import ActionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
    loadingProductsList : false,

    accountName : null,
    fullName : null,

    coverPictureUrl : null,
    profilePictureUrl : null,

    productTypeList : [],
    jobTag : null,

    productCount : 0,
    platformCount : 0,
    resellerCount : 0,

    joinedDate : null,
    hostId : null,
    profileMessage : null,

    productsList : [] ,

    loadingProfileLink : false ,

    loadingBuyTx : false,
}

export default function link(state=INITIAL_STATE, action={}){
    switch(action.type) {
        case ActionTypes.SellerProfileInfo : 
            return ({
                ...state,
                coverPictureUrl : action.payload.coverPictureUrl,
                profilePictureUrl : action.payload.profilePictureUrl,

                productTypeList : action.payload.productTypeList,
                jobTag : action.payload.jobTag,

                accountName : action.payload.accountName,
                fullName : action.payload.fullName,

                productCount : action.payload.productCount,
                platformCount : action.payload.platformCount,
                resellerCount : action.payload.resellerCount,

                joinedDate : action.payload.joinedDate,
                hostId : action.payload.hostId,
                profileMessage : action.payload.profileMessage
            }) ;
        case ActionTypes.LoadingSellerProductsList : 
            return ({
                ...state,
                loadingProductsList : action.payload
            }) ;
        case ActionTypes.LoadingProfileLink : 
            return ({
                ...state,
                loadingProfileLink : action.payload
            }) ;
        case ActionTypes.SellerAllProducts : 
            return ({
                ...state,
                productsList : action.payload
            });
        case ActionTypes.LoadingBuyTransaction : 
            return ({
                ...state,
                loadingBuyTx : action.payload 
            }) ;
        case ActionTypes.InitLinkReducer : 
            return {
                ...INITIAL_STATE
            } ;
        default :
            return state ;
    }
}