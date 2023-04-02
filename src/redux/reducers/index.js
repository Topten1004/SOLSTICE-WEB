import  { combineReducers } from 'redux' ;

import authReducer from './auth';
import dashboardReducer from './dashboard' ;
import profileReducer from './profile';
import uploadReducer from './upload';
import cloudReducer from './cloud' ;
import cartReducer from './cart' ;
import settingReducer from './setting' ;
import customersReducer from './customers' ;
import notifyReducer from './notify' ;
import transactionReducer from './transaction' ;
import stripeReducer from './stripe' ;
import linkReducer from './link' ;
import paymentReducer from './payment' ;
import walletReducer from './wallet' ;

export default combineReducers({
    auth : authReducer,
    dashboard: dashboardReducer,
    profile : profileReducer,
    cloud : cloudReducer,
    cart : cartReducer,
    setting : settingReducer,
    customers : customersReducer,
    stripe : stripeReducer,
    notify : notifyReducer,
    transaction : transactionReducer,
    link : linkReducer,
    payment : paymentReducer,
    wallet : walletReducer ,
    upload : uploadReducer 
});