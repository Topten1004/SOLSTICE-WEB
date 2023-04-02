

import ActionTypes from "../actions/actionTypes";

const INITIAL_STATE = {
    progress : 0,
    uploadLoading : false,
    
    solsForUpload : [],
    externalsForUpload : [],
    productName : '',

    solsProductDescription : '',
    legenResell : "NO",
    solsPriceType : 'legendary',
    solsProductType : '#Document',

    legenProductPrice : '',
    legenTicketPrice : '',
    legenPriceUnit : 0,
    legenTicketUnit : 0,
    legenTicketCount : 0,
    legenRoyalty : 10,
    legenStripeCard : "visa",

    rareBiddingPrice : '',
    rareBiddingUnit : 0,
    rareAvailableItems : '',
    rareRoyalty : 10,
    rareStripeCard : "visa",
    rareListingTime : {
        from :{
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
        },
        to : {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate(),
        }
    },
    rareUnlimited : true,

    recurringSubscriptionPrice : '',
    recurringPriceUnit : 0,
    recurringReleaseDate : {
        year : new Date().getFullYear(),
        month : new Date().getMonth() + 1,
        day : new Date().getDate()
    },

    freeSubscriptionPrice : '',
    freePriceUnit : 0,
    freeReleaseDate : {
        year : new Date().getFullYear(),
        month : new Date().getMonth() + 1,
        day : new Date().getDate()
    },

    uploadedCount : 0,
    totalProgress : 0,
    uploadedProduct : null 
} ;

export default function upload(state=INITIAL_STATE, action={}) {
    switch(action.type) {
        case ActionTypes.UploadRunning : 
            return ({
                ...state ,
                progress : action.payload
            })
        case ActionTypes.InputUploadFiles : 
            return ({
                ...state,
                solsForUpload : action.payload
            }) ;
        case ActionTypes.InputExternalLinks : 
            return ({
                ...state,
                externalsForUpload : action.payload
            }) ;
        case ActionTypes.InputProductName : 
            return ({
                ...state,
                productName : action.payload
            });
        case ActionTypes.InputProductType :
            return ({
                ...state,
                solsProductType : action.payload
            }) ;
        case ActionTypes.InputPriceConfig : 
            return ({
                ...state,
                solsProductDescription : action.payload.productDescription,
                legenResell : action.payload.resellTick,
                solsPriceType : action.payload.priceType,
                solsProductType : action.payload.productType
            }) ;
        case ActionTypes.InputLegenPriceConfig : 
            return ({
                ...state,
                legenProductPrice : action.payload.productPrice,
                legenTicketPrice : action.payload.resellPrice,
                legenPriceUnit : action.payload.priceUnit,
                legenTicketUnit : action.payload.resellUnit,
                legenTicketCount : action.payload.resellCount ,
                legenRoyalty : action.payload.royalty,
                legenStripeCard : action.payload.stripeCard
            });
        case ActionTypes.InputRarePriceConfig : 
            return ({
                ...state,
                rareBiddingPrice : action.payload.biddingPrice,
                rareBiddingUnit : action.payload.biddingUnit,
                rareAvailableItems : action.payload.availableItems,
                rareRoyalty : action.payload.royalty,
                rareStripeCard : action.payload.stripeCard,
                rareListingTime : action.payload.listingTime,
                rareUnlimited : action.payload.unlimited
            });
        case ActionTypes.InputRecurringPriceConfig :
            return ({
                ...state,
                recurringSubscriptionPrice : action.payload.subscriptionPrice,
                recurringPriceUnit : action.payload.recurringUnit,
                recurringReleaseDate : action.payload.releaseDate
            });
        case ActionTypes.InputFreePriceConfig :
            return ({
                ...state,
                freeSubscriptionPrice : action.payload.subscriptionPrice,
                freePriceUnit : action.payload.freeUnit,
                freeReleaseDate : action.payload.releaseDate
            }) ;
        case ActionTypes.UploadedProduct : 
            return ({
                ...state,
                uploadedProduct : action.payload
            }) ;
        case ActionTypes.UpdateUploadProgress :
            return ({
                ...state,
                totalProgress : action.payload
            }) ;
        case ActionTypes.UpdateUploadedCount : 
            return ({
                ...state,
                uploadedCount : state.uploadedCount + 1
            }) ;
        case ActionTypes.UploadLoading : 
            return ({
                ...state,
                uploadLoading : action.payload
            });
        case ActionTypes.InitUploadReducer : 
            return INITIAL_STATE ;
        default : 
            return state ;
    }
} 
