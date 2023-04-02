import ActionTypes from './actionTypes' ;

import { realDb } from '../../firebase/config' ;
import { ref, onValue, push, child, update} from "firebase/database";

export const FetchAllNotify = () => async dispatch =>{
    try {
        const starCountRef = ref(realDb, 'Web_Notify/');
        
        onValue(starCountRef, async (snapshot) => {
            const data = snapshot.val();
            
            await dispatch({
                type : ActionTypes.FetchAllNotify,
                payload : data || {}
            }) ;
        });

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
