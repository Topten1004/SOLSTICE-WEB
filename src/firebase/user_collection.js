import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where, updateDoc, increment } from "firebase/firestore";
import { db, storage } from "./config";
import { deleteObject, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { createCustomer } from "../stripe/customer_api";
import { createAccount, createAccountLink } from "../stripe/account_api";
import { getCookie } from "../utils/Helper";
import { v4 as uuidv4 } from 'uuid' ;

export const CheckEmail = async (email) => {
    try {
        let userDcos = await getDocs(query(collection(db, "Web_Users"), where('email', '==', email.toLowerCase()))) ;
        
        if(userDcos.size) {
            if( userDcos.docs[0].data().user_type === 'external' ) return true ; 
            return false ;
        }
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const CheckAccountName = async (account_name) => {
    try {
        let docSnap = await getDocs( query(collection(db, "Web_Users"), where("account_name", "==", account_name)) );

        if(docSnap.size)  return false ;
        else return true ;
       
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UserInfoById = async (uuid) => {
    try {
        let userDoc = await getDoc(doc(db, "Web_Users", uuid)) ;

        if(!userDoc.exists()) return false ;

        return {
            id : userDoc.id,
            ...userDoc.data()
        } ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UserInfoByEmail = async (email) => {
    try {
        let buyerDocs = await getDocs(query(collection(db, "Web_Users"), where('email', '==', email.toLowerCase()))) ;

        if(buyerDocs.size) {
            return {
                id : buyerDocs.docs[0].id,
                ...buyerDocs.docs[0].data()
            }
        } else false ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdateResellerCount = async (creator_id) => {
    try {
        await updateDoc(doc(db, "Web_Users", creator_id), {
            reseller_count : increment(1)
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdateSellerCustomer = async (creator_id, customer_id) => {
    try {   
        let creatorDoc = await getDoc(doc(db, "Web_Users" , creator_id)) ;
        let customerDoc = await getDoc(doc(db, "Web_Users", customer_id)) ;

        let customers = creatorDoc.data().customers ;

        let target_idx = customers.findIndex(customer => customer.email === customerDoc.data().email) ;

        if(target_idx >= 0) {
            if(!customers[target_idx].id || customers[target_idx].id !== customer_id) {
                customers[target_idx].id = customer_id ;

                await updateDoc(doc(db, "Web_Users", creator_id), {
                    customers : [...customers]
                }) ;
            } 
        } else  {
            await updateDoc(doc(db, "Web_Users", creator_id), {
                customers : [...customers, {
                    id : customerDoc.id || null,
                    email : customerDoc.data().email || null,
                    full_name : customerDoc.data().full_name || null
                }]
            }) ;
        }
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdateUserCustomer = async (seller_id, newCustomers) => {
    try {
        await updateDoc(doc(db, "Web_Users", seller_id), {
            customers : [...newCustomers]
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const CreateUserWithoutPassword = async (fullName, email, phoneNumber) => {
    try {
        let newUser = await addDoc(collection(db, "Web_Users"), {
            email : email.toLowerCase(),
            full_name : fullName,
            profile_picture_url : null,
            cover_photo_url : null,
            password: null,
            user_type : 'external',
            customers : [],
            stripe_customer_id : null,
            stripe_account_id : null,
            joined_date : new Date().getTime()
        }) ;

        let req_create_customer =  {
            name : fullName,
            email: email,

            "metadata[user_id]" : newUser.id,
        }

        let res_create_customer = await createCustomer( req_create_customer ) ;

        await updateDoc(doc(db, 'Web_Users', newUser.id), {
            stripe_customer_id : res_create_customer.id,
            stripe_balance_incoming : 0,
            stripe_balance_available : 0,
        }) ;

        let newUserDoc = await getDoc(doc(db, "Web_Users", newUser.id)) ;

        return {
            ...newUserDoc.data(),
            id : newUserDoc.id
        }
    } catch(err) {
        console.log(err);
        return false ;
    }
}

export const UpdateUserStripeCustomerId = async (buyerId) => {
    try {

        console.log(buyerId) ;

        let buyerDoc = await getDoc(doc(db, "Web_Users", buyerId));

        let req_create_customer =  {
            name : buyerDoc.data().full_name,
            email: buyerDoc.data().email,
            // default_currency : "usd",
            // payment_method: 'pm_card_visa',
            "metadata[user_id]" : buyerId,
            // invoice_settings: { default_payment_method: 'pm_card_visa' }
        }

        let res_create_customer = await createCustomer(req_create_customer) ;

        await updateDoc(doc(db, "Web_Users", buyerId), {
            stripe_customer_id : res_create_customer.id,
            stripe_balance_incoming : 0,
            stripe_balance_available : 0
        }) ;

        return true ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const SellerStripeInfo = async (seller_id) => {
    try {   
        let sellerDoc = await getDoc(doc(db, "Web_Users", seller_id)) ;

        return {
            id : sellerDoc.id,
            stripe_account_id : sellerDoc.data().stripe_account_id,
            stripe_customer_id : sellerDoc.data().stripe_customer_id,
            full_name : sellerDoc.data().full_name,
            account_name : sellerDoc.data().account_name,
            profile_link : sellerDoc.data().profile_link,
            profile_picture_url : sellerDoc.data().profile_picture_url,
            email : sellerDoc.data().email
        }
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const CreateCustomerAccount = async (req_create_customer) => {
    try {
        
        let res_create_customer = await createCustomer(req_create_customer) ;

        console.log(res_create_customer) ;
        
        if(!res_create_customer) {
            return "create_customer_error" ;
        }

        await updateDoc(doc(db, "Web_Users", getCookie('_SOLSTICE_AUTHUSER')), {
            stripe_customer_id : res_create_customer.id,
            stripe_balance_incoming : 0,
            stripe_balance_available : 0
        }) ;

        return 200 ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const CreateStripeAccount = async (req_create_account) => {
    try {
        let res_create_account = await createAccount(req_create_account) ;

        if(!res_create_account)  return 'create_account_error' ;

        let confirm_code = uuidv4() ;

        await updateDoc(doc(db, "Web_Users", getCookie('_SOLSTICE_AUTHUSER')), {
            stripe_account_id : res_create_account.id 
        }) ;

        let req_create_account_link  = {
            'account': res_create_account.id,
            'refresh_url': location.origin + '/solstice/setting-screen',
            'return_url':   location.origin + "/confirm/stripe-account-create?stripe_account_id=" + res_create_account.id ,
            'type': 'account_onboarding'
        }

        let res_create_account_link = await createAccountLink(req_create_account_link) ;

        if(!res_create_account_link) {
            // await deleteAccount(res_create_account.id) ;
            
            // await updateDoc(doc(db, "Web_Users", getCookie('_SOLSTICE_AUTHUSER')), {
            //     stripe_account_id : null,
            //     stripe_account_create_confirm_code : null
            // }) ;

            return 'create_account_link_error' ;
        }

        window.open(res_create_account_link.url, '_self') ;

    } catch(err) {
        console.log(err) ;
    }
}

export const CompleteStripeAccount = async (stripe_account_id) => {
    try {
        let req_create_account_link  = {
            'account': stripe_account_id,
            'refresh_url': location.origin + '/solstice/setting-screen',
            'return_url':   location.origin + "/confirm/stripe-account-create?stripe_account_id=" + stripe_account_id ,
            'type': 'account_onboarding'
        }

        let res_create_account_link = await createAccountLink(req_create_account_link) ;

        if(!res_create_account_link) {
            // await deleteAccount(stripe_account_id) ;
            
            // await updateDoc(doc(db, "Web_Users", getCookie('_SOLSTICE_AUTHUSER')), {
            //     stripe_account_id : null,
            //     stripe_account_create_confirm_code : null
            // }) ;

            return 'create_account_link_error' ;
        }

        window.open(res_create_account_link.url, '_self') ;
        
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const DeleteUserStripeAccountId = async (user_id) => {
    try {
        await updateDoc(doc(db, "Web_Users", user_id), {
            stripe_account_id : null,
        }) ;

        return false ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdateUserProfilePic = async (profilePicName, userId, raw) => {
    try {
        if(profilePicName) {
            const removableRef = ref(storage, 'web_profile_images/' + userId + "/" + profilePicName) ;
            await deleteObject(removableRef) ;
        }

        let file_name = profilePicName || uuidv4() ;

        const storageRef = ref(storage, 'web_profile_images/' + userId + "/" + file_name );
        const uploadTask = await uploadBytesResumable(storageRef, raw);

        const downloadURL =  await getDownloadURL(uploadTask.ref) ;

        await updateDoc(doc(db, "Web_Users", userId), {
            profile_picture_url : downloadURL,
            profile_picture_name : file_name
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdateUserCoverPic = async (coverPhotoName, userId, raw) => {
    try {
        console.log("sdfdf") ;
        console.log(coverPhotoName, userId, raw);
        
        if(coverPhotoName) {
            const removableRef = ref(storage, 'web_cover_photos/' + userId + "/" + coverPhotoName) ;
            await deleteObject(removableRef) ;
        }
        
        let file_name = coverPhotoName || uuidv4() ;

        const storageRef = ref(storage, 'web_cover_photos/' + userId + "/" + file_name );
        const uploadTask = await uploadBytesResumable(storageRef, raw);

        const downloadURL =  await getDownloadURL(uploadTask.ref) ;

        await updateDoc(doc(db, "Web_Users", userId), {
            cover_picture_url : downloadURL,
            cover_picture_name : file_name
        }) ;

        return true ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdateUserMainInfo = async (full_name, phone_number, account_name ,user_id) => {
    try {
        await updateDoc(doc(db, "Web_Users", user_id), {
            phone_number : phone_number,
            full_name : full_name,
            account_name : account_name
        }) ;

        return true ;
        
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdateCreatorSoldCount = async (creator_id) => {
    try {
        await updateDoc(doc(db, "Web_Users", creator_id), {
            total_sold_count :  increment(1)
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const WithdrawUserStripeBalance = async (stripe_balance_available, user_id) => {
    try {
        await updateDoc(doc(db, "Web_Users", user_id), {
            stripe_balance_available : stripe_balance_available
        }) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const CheckAccessibleCustomer = async (check_value, product_id) => {
    try {

        let productInfo = await getDoc(doc(db, "Web_Products", product_id)) ;

        if(productInfo.data().accessible_customers_to_restricted.includes(check_value)) return true ;

        return false ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const UpdateAccessibleCustomersToRestricted = async (product_id, accessible_customers) => {
    try {
        let productInfo  = await getDoc(doc(db, "Web_Products", product_id)) ;

        let accessible_list = productInfo.data().accessible_customers_to_restricted ;

        await Promise.all(
            accessible_customers.map(customer => {
                if(!accessible_list.includes(customer)) accessible_list.push(customer) ;
            })
        )

        await updateDoc(doc(db, "Web_Products", product_id), {
            accessible_customers_to_restricted : accessible_list
        }) ;

        return true ;

    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const AdminUser = async () => {
    try {
        // let userDocs = await getDocs(collection(db, "Web_Users")) ;

        // await Promise.all(
        //     userDocs.docs.map(async userDoc => {
                
        //             // await updateDoc(doc(db, "Web_Users", userDoc.id), {
                     
        //             // }) ;
                
        //     })
        // )

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}