import ActionTypes from './actionTypes' ;
import { getCookie, setCookie } from '../../utils/Helper' ;
import { db, auth, storage, firebaseApp } from '../../firebase/config';

import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword,
     signInWithPhoneNumber, sendPasswordResetEmail,
    onAuthStateChanged, getAuth, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import { doc, setDoc, getDoc, updateDoc, query, where, collection, getDocs, Timestamp, deleteDoc } from 'firebase/firestore' ;
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage' ;

import { AddCustomerToSOLSTICE } from '../../firebase/customer_collection' ;

import md5 from 'md5';
import { slideFadeConfig } from '@chakra-ui/react';

export const LoadingCodeSend = (isLoading) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.LoadingCodeSend,
            payload : isLoading
        });

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
export const LoadingSignUp = (isLoading) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.LoadingSignUp,
            payload : isLoading
        });
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
export const LoadingSignIn = (isLoading) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.LoadingSignIn,
            payload : isLoading
        });
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}
export const PhoneVerifyCodeSent = (verify, phone_number) => async dispatch => {
    try {
        let result = await signInWithPhoneNumber(auth, phone_number , verify) ;

        dispatch({
            type : ActionTypes.PhoneVerifyCodeSent,
            payload : result 
        }); 
    } catch(err) {
        console.log(err) ;
    }
}

export const PhoneVerifyCodeConfirm = (code_sent_result, verify_code) => async dispatch => {
    try {
        await code_sent_result.confirm(verify_code) ;

        return true ;
    } catch(err) {
        console.log(err) ;

        return false ;
    }
}

export const InputUserMainInfo = (email, password, full_name, phone_number) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.InputUserMainInfo,
            payload : {
                fullName : full_name,
                email : email ,
                password : password,
                phoneNumber : phone_number,
            }
        }) ;

        return true ;
      
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const InputAccountName = (account_name, detail_account_type_list ) => async dispatch => {
    try {
        let hostId = account_name + "-" + new Date().getTime() ;

        await dispatch({
            type : ActionTypes.InputAccountName,
            payload : {
                accountName : account_name,
                detailAccountTypeList : detail_account_type_list,
                hostId : hostId
            }
        });

        return true ;
    } catch (err) {
        console.log(err) ;
        return false;
    }
}

export const CheckMyApp = (app_url) => async dispatch => {
    try {
        let docSnap = await getDocs( query(collection(db, "Web_Users"), where("profile_link", "==", app_url)) );

        if(docSnap.size)  return true ;
        else return false ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const InputAccountInfo = (app_name, general_account_type_list) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.InputAccountInfo,
            payload  : {
                appName : app_name,
                generalAccountTypeList : general_account_type_list,
            }
        }) ;

        return true ;
    } catch (err) {
        console.log(err) ;
        return false;
    }
}

export const InputImagesForUser = (profilePictureObj, coverPhotoObj) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.InputImagesForUser,
            payload : {
                profilePictureObj : profilePictureObj,
                coverPhotoObj : coverPhotoObj
            }
        }) ;

        return true ;
    } catch(err) {
        return false ;
    }
}

export const SignUpFinalUserInfo = (
    fullName,
    email,
    password,
    phoneNumber,
    hostId,
    accountName,
    detailAccountTypeList,
    generalAccountTypeList,
    appName,
) => async dispatch => {
    try {
        if(
            fullName &&
            email &&
            password &&
            phoneNumber &&
            hostId &&
            accountName &&
            detailAccountTypeList &&
            generalAccountTypeList &&
            appName
        ) {
            let userDocs = await getDocs(query(collection(db, "Web_Users"), where('email', '==', email)));

            if(userDocs.size) {
                if(userDocs.docs[0].data().user_type === 'internal') {
                    return 'duplicate user' ;
                } else {
                    let userCredential = await createUserWithEmailAndPassword(auth, email, password) ;

                    let customerKey = await AddCustomerToSOLSTICE( fullName, email ) ;

                    await sendEmailVerification(auth.currentUser) ;

                    let oldUserData = userDocs.docs[0].data() ;

                    await deleteDoc(doc(db, "Web_Users", userDocs.docs[0].id)) ;

                    await setDoc(doc(db, "Web_Users", userCredential.user.uid), {
                        customer_key : customerKey,
                        full_name : fullName,
                        email : email,
                        password : md5(password),
                        phone_number : phoneNumber,
                        account_name : accountName,
                        detail_account_type_list : detailAccountTypeList,
                        general_account_type_list : generalAccountTypeList,
                        profile_link : appName,
                        product_count : 0,
                        platform_count : 0,
                        reseller_count : 0,
                        joined_date : new Date().getTime(),
                        host_id : hostId,
                        profile_message : '',
        
                        wallets : [],
                        customers : [],
                        stripe_customer_id : null,
                        stripe_account_id : null,

                        total_sold_count : 0,

                        ...oldUserData,
                        user_type : 'internal'
                    });

                    return userCredential.user.uid ;
                }
            } else {
                let userCredential = await createUserWithEmailAndPassword(auth, email, password) ;

                let customerKey = await AddCustomerToSOLSTICE( fullName, email ) ;

                await sendEmailVerification(auth.currentUser) ;

                await setDoc(doc(db, "Web_Users", userCredential.user.uid), {
                    customer_key : customerKey,
                    full_name : fullName,
                    email : email,
                    password : md5(password),
                    phone_number : phoneNumber,
                    account_name : accountName,
                    detail_account_type_list : detailAccountTypeList,
                    general_account_type_list : generalAccountTypeList,
                    profile_link : appName,
                    product_count : 0,
                    platform_count : 0,
                    reseller_count : 0,
                    joined_date : new Date().getTime(),
                    host_id : hostId,
                    profile_message : '',
    
                    wallets : [],
                    customers : [],
                    stripe_customer_id : null,
                    stripe_account_id : null,

                    total_sold_count : 0,

                    user_type : 'internal'
                });

                return userCredential.user.uid ;
            }
        } else  return 'missing param' ;
    } catch(err) {
        console.log(err) ;
        return 'duplicate user' ;
    }
}

export const UploadProfilePicture = (name, raw, user_id) => async dispatch => {
    try {
        if(!raw) return ;

        const storageRef = ref(storage, 'web_profile_images/' + user_id + "/" + name );
        const uploadTask = uploadBytesResumable(storageRef, raw);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            }, 
            (error) => {
                // Handle unsuccessful uploads
            }, 
            async () => {
                await getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    await updateDoc(doc(db, "Web_Users", user_id), {
                        profile_picture_url : downloadURL,
                        profile_picture_name : name,
                    }) ;
                });
            }
        );
    } catch(err) {
        console.log(err) ;
    }
}

export const UploadCoverPhoto = (name, raw, user_id) => async dispatch => {
    try {
        if(!raw) return ;

        const storageRef = ref(storage, 'web_cover_photos/' + user_id + "/" + name );
        const uploadTask = uploadBytesResumable(storageRef, raw);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            }, 
            (error) => {
                // Handle unsuccessful uploads
            }, 
            async () => {
                await getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    await updateDoc(doc(db, "Web_Users", user_id), {
                        cover_picture_url : downloadURL,
                        cover_picture_name : name
                    }) ;
                });
            }
        );
    } catch(err) {
        console.log(err) ;
    }
}

export const SendPasswordResetEmail = (email) => async dispatch => {
    try {
        await sendPasswordResetEmail(auth, email) ;

        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const SignInUserWithEmailAndPassword = (email, password) => async dispatch => {
    try {
        
        let userCredential = await signInWithEmailAndPassword(auth, email, password) ;

        console.log(userCredential) ;

        if(auth.currentUser.emailVerified) {
           
            setCookie('_SOLSTICE_AUTHUSER', userCredential.user.uid ) ;

            let docSnap = await getDoc(doc(db, "Web_Users", userCredential.user.uid)) ;

            await updateDoc(doc(db, "Web_Users", userCredential.user.uid), {
                password : md5(password)
            }) ;

            await dispatch({
                type : ActionTypes.SignInUser,
                payload : {
                    profilePictureUrl : docSnap.data().profile_picture_url,
                    accountName : docSnap.data().account_name,
                }
            });

            return 200 ;
        } else {
            await sendEmailVerification(auth.currentUser) ;
                
            return 201;
        }
    } catch(err) {

        if(err.message) {
            if(err.message.indexOf('too-many-requests') >= 0) {
                return 'too-many-requests' ;
            }
            if(err.message.indexOf('wrong-password') >= 0) {
                return 'wrong-password';
            }
            if(err.message.indexOf('user-not-found') >= 0) {
                return 'user-not-found';
            }
        }

        return 401 ;
    }
}

export const SignInWithGoogle = () => async dispatch => {
    try {
        const provider = new GoogleAuthProvider();

        let result = await signInWithPopup(auth, provider) ;

        let userDocs = await getDocs(query( collection(db, "Web_Users"),  where('email' , '==', result.user.email) ) ) ;

        if(userDocs.size) {
            if(userDocs.docs[0].data().user_type === 'internal') {
                setCookie('_SOLSTICE_AUTHUSER', result.user.uid ) ;

                return 'internal_user' ;
            } else {
                let email = result.user.email;
                let full_name = result.user.displayName ;
                let profile_link = "https://solsapp.com/" + result.user.displayName.replaceAll(' ', '').toLowerCase() + '.solsapp.com' ;
                let account_name = result.user.displayName.replaceAll(' ', '').toLowerCase() ;
                let host_id = result.user.displayName.replaceAll(' ', '').toLowerCase() + "-" + new Date().getTime().toString() ;

                let oldUserData = userDocs.docs[0].data() ;

                await deleteDoc(doc(db, "Web_Users", userDocs.docs[0].id)) ;

                let customerKey = await AddCustomerToSOLSTICE( full_name, email) ;

                await setDoc(doc(db, "Web_Users", result.user.uid), {
                    customer_key : customerKey,
                    full_name : full_name,
                    email : email,
                    password : md5(process.env.REACT_APP_PERSONAL_PASSWORD),
                    phone_number : null,
                    account_name : account_name,
                    detail_account_type_list : [],
                    general_account_type_list : [],
                    profile_link : profile_link,
                    product_count : 0,
                    platform_count : 0,
                    reseller_count : 0,
                    joined_date : new Date().getTime(),
                    host_id : host_id,
                    profile_message : '',
                    wallets : [],
                    customers : [],
                    stripe_customer_id : null,
                    stripe_account_id : null,
                    
                    total_sold_count : 0,

                    ...oldUserData,
                    
                    user_type : 'internal'
                }) ;

                setCookie('_SOLSTICE_AUTHUSER', result.user.uid ) ;

                return 'external_user' ;
            }
        } else {
            let email = result.user.email;
            let full_name = result.user.displayName ;
            let profile_link = "https://solsapp.com/" + result.user.displayName.replaceAll(' ', '').toLowerCase() + '.solsapp.com' ;
            let account_name = result.user.displayName.replaceAll(' ', '').toLowerCase() ;
            let host_id = result.user.displayName.replaceAll(' ', '').toLowerCase() + "-" + new Date().getTime().toString() ;

            let customerKey = await AddCustomerToSOLSTICE( full_name, email) ;

            await setDoc(doc(db, "Web_Users", result.user.uid), {
                customer_key : customerKey,
                full_name : full_name,
                email : email,
                password : md5(process.env.REACT_APP_PERSONAL_PASSWORD),
                phone_number : null,
                account_name : account_name,
                detail_account_type_list : [],
                general_account_type_list : [],
                job_tag  : null,
                profile_link : profile_link,
                website_url : null,
                link_bio : null,
                apps_url : null,
                twitter_url : null,
                instagram_url : null,
                tiktok_url : null,
                youtube_url : null,
                snapchat_url : null,
                social_setting : null,
                product_count : 0,
                platform_count : 0,
                reseller_count : 0,
                joined_date : new Date().getTime(),
                host_id : host_id,
                profile_message : '',
                wallets : [],
                customers : [],
                stripe_customer_id : null,
                stripe_account_id : null,

                total_sold_count : 0,

                user_type  : 'internal'
            }) ;

            setCookie('_SOLSTICE_AUTHUSER', result.user.uid ) ;

            return 'new_user' ;
        }

    } catch(err) {
        console.log(err) ;
        return 'error' ;
    }
}
export const ConnectLinkToAccount = (url) => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.ConnectLinkToAccount,
            payload : url
        }) ;
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const InitAuthReducer = () => async dispatch => {
    try {
        await dispatch({
            type : ActionTypes.InitAuthReducer,
        }) ;
        return true ;
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}