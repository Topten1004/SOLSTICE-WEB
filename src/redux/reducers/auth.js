import { getCookie, getUuid } from "../../utils/Helper";
import ActionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
    error : null ,
    isLogin : getCookie('_SOLSTICE_AUTHUSER') ? true : false,

    loadingCodeSend : false,
    loadingSignUp : false ,
    loadingSignIn : false,
    codeSentResult : null,

    fullName : null,
    email : null,
    password : null,
    phoneNumber : null,
    credentialId : null,

    hostId : null,
    accountName : null,
    generalAccountTypeList : null,
    detailAccountTypeList : null,
    productTypeList : null,

    appName : null,

    profilePictureUrl : null,

    profilePictureObj : null,
    coverPhotoObj : null,

    customers : null
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type){
        case ActionTypes.SignUpUserError :
            return({
                ...state,
                error : action.payload,
            });

        case ActionTypes.PhoneVerifyCodeSent :
            return ({
                ...state,
                codeSentResult : action.payload
            });
        case ActionTypes.InputUserMainInfo : 
            return ({
                ...state,
                fullName : action.payload.fullName,
                email : action.payload.email,
                password : action.payload.password,
                phoneNumber : action.payload.phoneNumber
            });
        case ActionTypes.InputAccountName : 
            return ({
                ...state,
                accountName : action.payload.accountName,
                detailAccountTypeList : action.payload.detailAccountTypeList,
                hostId : action.payload.hostId
            });
        case ActionTypes.InputAccountInfo : 
            return ({
                ...state,
                appName : action.payload.appName,
                generalAccountTypeList : action.payload.generalAccountTypeList
            });
        case ActionTypes.InputImagesForUser :
            return ({
                ...state,
                profilePictureObj : action.payload.profilePictureObj,
                coverPhotoObj : action.payload.coverPhotoObj
            })
        case ActionTypes.SignInUser :
            return ({
                ...state,
                profilePictureUrl : action.payload.profilePictureUrl,
                accountName : action.payload.accountName
            });
        case ActionTypes.LoadingCodeSend :
            return ({
                ...state,
                loadingCodeSend : action.payload
            });
        case ActionTypes.LoadingSignUp : 
            return ({
                ...state,
                loadingSignUp : action.payload
            });
        case ActionTypes.LoadingSignIn :
            return ({
                ...state,
                loadingSignIn : action.payload
            }) ;
        case ActionTypes.InitAuthReducer : 
            return ({
                ...INITIAL_STATE
            });
        default :
            return state ;
    }
}