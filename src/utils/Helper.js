import axios from 'axios';
import qs from 'qs' ;
import { validate as uuidValidate } from 'uuid' ; 
import { version as uuidVersion } from 'uuid' ; 
import CryptoJS from 'crypto-js' ;

export const setCookie = async (cname, cvalue) => {
    const d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));
    let expires = "expires="+ d.toUTCString();

    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
}

export const eraseCookie = async (cname) => {
    document.cookie = cname+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    return ;
}

export const bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export const validateInputValue = (inputValue) => {
    var inputValueRegex = /^[a-zA-Z0-9]+$/;
    return inputValueRegex.test(inputValue);
}

export const getYoutubeId = (url) => {
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
}
export const isYoutubeUrl = (url) => {
    return url && url.match(/(?:youtu|youtube)(?:\.com|\.be)\/([\w\W]+)/i);
}

export const getFileExtension = (raw_file_type) => {
    if(!raw_file_type) return 'unknown' ;
    
    let extension = raw_file_type.split('/')[1] ;
    if(extension === 'vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return "docx"
    } else {
        return extension ;
    }
}

export const removeExtension = (filename) => {
    return filename?.substring(0, filename.lastIndexOf('.')) || filename;
}

export const convertObjToString = (obj) => {
    if(!obj) return new Date().getTime();

    return  obj.month + "/" + obj.day + "/" + obj.year ;
}

export const walletAddressFormat = (walletAddress) => {
    if(!walletAddress) return "Lock" ;
    return walletAddress.slice(0, 6) + "..." + walletAddress.slice(walletAddress.length - 4, walletAddress.length) ;
}

export const fileNameFormat = (fileName) => {
    if(!fileName) return "Unknown" ;
    if(fileName.legnth > 10)  return fileName.slice(0, 6) + "..." + fileName.slice(fileName.length - 4, fileName.length) ;
    else return fileName ;
}

export const getUnit = (unit_id) => {
    switch(unit_id) {
        case 0 :
            return "USD";
        case 1 : 
            return "SOLT";
        default :
            return "" ;
    }
}

export const getDecimal = (unit_id) => {
    switch(Number(unit_id)) {
        case 0 :
            return "6";
        case 1 : 
            return "6";
        default :
            return "" ;
    }
}
 
export const getProductId = (product_type) => {
    if(product_type === '' || !product_type) return "Unknown";

    switch(product_type.toString().toLowerCase().replaceAll('#', '')) {
        case "document" : 
            return 0 ;
        case "audio" :
            return 1 ;
        case "video" : 
            return 2;
        case "image" :
            return 3 ;
        default :
            return false ;
    }
}

export const getProductType = (product_id) => {
    switch(product_id) {
        case 0 : 
            return "#Document" ;
        case 1 :
            return "#Audio" ;
        case 2 : 
            return "#Video";
        case 3 :
            return "#Image" ;
        default :
            return false ;
    }
}
export const getPriceId = (price_type) => {
    switch(price_type.toLowerCase().replaceAll('#', '')) {
        case "legendary" : 
            return 0 ;
        case "rare" :
            return 1 ;
        case "recurring" : 
            return 2;
        case "free" :
            return 3 ;
        default :
            return false ;
    }
}

export const getPriceType = (price_id) => {
    switch(price_id) {
        case 1 :
            return "Legendary" ;
        case 2:
            return "Rare" ;
        case 3:
            return "Recurring" ;
        case 4 :
            return "Free";
        default :
            return '';
    }
}

export const getUuid = (authObj) => {
    return JSON.parse(authObj)?.uuid ;
}
export const getPlatform = (authObj) => {
    return JSON.parse(authObj)?.platform
} 

export const uuidValidateV4 = async (uuid) => {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4 ;
}

export const isset = (value) => {
    try {
        if(typeof value === 'undefined') return false ;
        return true ;     
    } catch(err) {
        console.log(err) ;
        return false ;
    }
}

export const authorization = () => {
    return {
        headers: { Authorization: `Bearer ` + getCookie('idToken') }
    }
}

export const errorHandler = (err) => {
    try {
        if(err.response.status === 429){
            return "Too Many Requests." ;
        }
        if(err.response.status === 401){
            return "Unauthorized" ;
        }
        if(err.response.status >= 400 && err.response.status < 500){
            console.log(err.response.data.message) ;
            return err.response.data.message ;
        }
    } catch(error){
        console.log("error" , err);
        return "Server Side Error" ;
    }
}

export const isAuthenticated = () => {
    if(getCookie('_SOLSTICE_AUTHUSER')) {
        return true ;
    }
    return false ;
}

export const refreshTokenSetup = (res) => {
    let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60 ) * 1000 ;

    const refreshToken  = async () => {
        const newAuthRes = await res.reloadAuthResponse() ;

        refreshTiming = ( newAuthRes.expires_in || 3600 - 5 * 60 ) * 1000 ;

        console.log(refreshToken, refreshTiming) ;
    } ;

    setTimeout(refreshToken, refreshTiming) ;
}

export const calcPaymentFee = amount => {
    return amount * 0.029 + 0.3 ;
}