import btoa from 'btoa';

export const ipfs_auth =   "Basic " + btoa(process.env.REACT_APP_IPFS_INFURA_ID + ":" + process.env.REACT_APP_IPFS_INFURA_SECRECT);

export const ipfs_origin = 'https://solsapp.infura-ipfs.io/ipfs/';

export const stripe_api_origin = "https://api.stripe.com/v1/" ;

export const productTypeList = [
    "#Document",
    "#Audio",
    "#Video",
    "#Image"
]

export const acceptableList = {
    "#Document" : '.pdf,.doc,.docx',
    "#Audio" : 'audio/*',
    "#Video" : '.ogm, .mp4, .wmv, .mpg, .webm, .ogv, .mov, .asx, .mpeg, .m4v, .avi',
    "#Image" : '.tif, .pjp, .xbm, .jxl, .svgz, .jpg, .jpeg, .ico, .tiff, .gif, .svg, .jfif, .webp, .png, .bmp, .pjpeg, .avif'
};