import ActionTypes from './actionTypes' ;

import { realDb } from '../../firebase/config' ;
import { ref, onValue, push, child, update} from "firebase/database";

export const FetchCustomersList = () => async dispatch =>{
    try {
        const starCountRef = ref(realDb, 'Web_Customers/');
        
        onValue(starCountRef, async (snapshot) => {
            const data = snapshot.val();
            
            await dispatch({
                type : ActionTypes.FetchCustomersList,
                payload : data || {}
            }) ;
        });

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}