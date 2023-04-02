import { push, update, ref, child } from "firebase/database";
import { realDb } from "./config";

export const UpdateNotify = async (notify, notify_id) => {
    try {

        let updates = {} ;
        updates['Web_Notify/' + notify_id] = notify ;

        update(ref(realDb), updates) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}


export const CreateNotify = async (notify) => {
    try {

        let newNotifyKey = push(child(ref(realDb), 'Web_Notify')).key;

        let updates = {} ;
        updates['Web_Notify/' + newNotifyKey] = notify ;

        update(ref(realDb), updates) ;

        return newNotifyKey ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}