import axios from "axios";
import { ref, onValue  } from 'firebase/database' ;
import { realDb } from "../../firebase/config";
import ActionTypes from "./actionTypes";

export const FetchAllPayments = () => async dispatch =>{
    try {
        const starCountRef = ref(realDb, 'Web_Payments/');
        
        onValue(starCountRef, async (snapshot) => {
            const data = snapshot.val();
            
            await dispatch({
                type : ActionTypes.FetchAllPayments,
                payload : data || {}
            }) ;
        });

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}


