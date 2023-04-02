
import { realDb } from './config' ;
import { ref, push, child, update} from "firebase/database";


export const AddCustomerToSOLSTICE = async (fullName, email) => {
    try {

        let newCustomer = {
            fullName: fullName,
            email: email,
        };
        
        // Get a key for a new Post.
        let newCustomerKey = push(child(ref(realDb), 'Web_Customers')).key;

        let updates = {} ;
        updates['Web_Customers/' + newCustomerKey] = newCustomer ;

        update(ref(realDb), updates) ;

        return newCustomerKey ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}