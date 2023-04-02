import * as React from 'react' ;

// hooks
import { useLocation } from 'react-use';
import { useWalletInfo } from '../../contexts/WalletContext';

// redux
import {connect} from 'react-redux' ;
import PropTypes from 'prop-types' ;
import { SignInUserWithEmailAndPassword } from '../../redux/actions/auth';

// firebase 
import { 
    UserInfoByEmail, CreateUserWithoutPassword,
    SellerStripeInfo,
    UserInfoById, UpdateSellerCustomer,
    DeleteUserStripeAccountId, UpdateUserStripeCustomerId
} from '../../firebase/user_collection';

import { CheckBuyerOrOwner, FreeOfferProduct } from '../../firebase/product_collection';
import { CreateNotify } from '../../firebase/notify_collection';
import { CreatePayment } from '../../firebase/payment_collection';
import { PlaceBid } from '../../firebase/bid_collection';

// third party api
import { SendProductLink } from '../../email';
import { createPaymentIntent } from '../../stripe/payment_api';
import { retrieveAccount } from '../../stripe/account_api';

// web3
import { NFTBalance } from '../../web3/fetch';

// utils
import { setCookie, calcPaymentFee } from '../../utils/Helper';
import { errorPasswordHelper, errorEmailHelper, errorMandatoryHelper } from '../../utils/Error';

// others
import validator from 'validator';
import { toast } from 'react-toastify/dist/react-toastify';
import { v4 as uuidv4 } from 'uuid' ;

// icon & image
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SuccessImage from '../../assets/confirm/Success.svg' ;

// styles
import {
    Box,
    TextField,
    Grid,
    InputAdornment,
    Button,
    FormControl,
    Select,
    MenuItem,
    Tooltip
} from '@mui/material' ;

import { useStyles } from './StylesDiv/BuyerInfo.styles';
import { useTheme } from '@mui/styles' ;
import swal from 'sweetalert';

const BuyerInfo = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;
    const location = useLocation() ;

  
    const {
        productInfo,
        setClientSecret,
        setPaymentId,

        SignInUserWithEmailAndPassword
    } = props ;

    const {
        walletAddress,
        isWalletConnected
    } = useWalletInfo() ;

    const [email, setEmail] = React.useState(null) ;
    const [password,  setPassword] = React.useState(null) ;
    const [fullName, setFullName] = React.useState(null) ;
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [isValidUser, setIsValidUser] = React.useState(false) ;
    const [bidPrice, setBidPrice] = React.useState(0) ;
    const [bidAmount, setBidAmount] = React.useState(0) ;
    const [balanceOf, setBalanceOf] = React.useState(0) ;
    const [resellable, setResellable] = React.useState(false) ;
    const [purchaseType, setPurchaseType] = React.useState('general') ;
    const [userRole, setUserRole] = React.useState(false) ;
    
    const handleBidAmount = (value) => {
        setBidAmount(Number(Number(value).toFixed(0))) ;
    }

    const handlePlaceBid = async  () => {
        if(!walletAddress) {
            return swal({
                title : 'Warning',
                text : "Please, connect your wallet",
                buttons: false,
                timer : 3000,
                icon : 'warning'
            })
        }
        if(Number(productInfo?.minimum_bidding) > bidPrice) {
            return swal({
                title : 'Warning',
                text : "Bid price is too low",
                buttons: false,
                timer : 3000,
                icon : 'warning'
            })
        }
        if(Number(balanceOf < bidAmount)) {
            return swal({
                title : 'Warning',
                text : "Overflow Bid Amount",
                buttons: false,
                timer : 3000,
                icon : 'warning'
            })
        }
        if( await swal({
            title : 'Confirm',
            text : "Are you sure that you place bid?",
            buttons: [
                'No, I am not sure!',
                'Yes, I am sure!'
            ],
            icon : 'info'
        })) {
            let buyerInfo = await UserInfoByEmail(email) ;
            let creatorInfo = await UserInfoById(productInfo.creator_id) ;

            const id = toast.loading("[Place Bid] Tx is pending...");

            let txPlaceBid = await PlaceBid(
                productInfo.creator_id,
                productInfo.creator_wallet,
                creatorInfo.profile_picture_url,

                buyerInfo.id,
                fullName,
                buyerInfo.email,
                buyerInfo?.profile_picture_url || null,
                walletAddress,

                productInfo.id,
                productInfo.product_name,
                productInfo.product_type,
                productInfo.product_description,
                productInfo.nft_id,
                'rare',
                productInfo.minimum_bidding,
                bidAmount,
                bidPrice,
                productInfo.bid_unit,

                {
                    platform : productInfo.platform,
                    end_date : productInfo.end_date
                }
            ) ;

            if(txPlaceBid) {
                toast.update(id, { render: "[Place Bid] Tx is successful", type: "success", autoClose: 5000, isLoading: false });
                
                await CreateNotify({
                    buyer : {
                        email : buyerInfo.email,
                        profile_link : buyerInfo.profile_link,
                        account_name : buyerInfo.account_name ,
                        full_name : fullName 
                    },
                    price : bidPrice,
                    amount : bidAmount,
                    product : productInfo?.product_name,
                    unit : productInfo?.bid_unit,
                    purchased_at : new Date().toLocaleDateString(),
                    seller : productInfo?.creator_id,
                    type : 'rare'
                }) ;

                if(await swal({
                    title : 'Confirm',
                    text : "You can confirm your bid in Cart page",
                    buttons: {
                        confirm : {text  : 'Got it'}
                    },
                    icon : 'info'
                })) {
                    setCookie('_SOLSTICE_AUTHUSER', buyerInfo.id) ;
                    setCookie('_USER_TYPE', 'internal') ;
                    
                    window.open(location.origin + "/solstice/cart-screen", '_self') ;
                }
            }
            else {
                toast.update(id, { render:'[Place Bid] Tx is failed' , type: "error", autoClose: 5000, isLoading: false });
            }
        }
    }

    const handleBuyProduct = async () => {
        if(productInfo.price_type !== 'free') {
            let creatorInfo = await UserInfoById(productInfo.creator_id) ;

            if(!creatorInfo.stripe_account_id) {
                return swal({
                    title : 'Warning',
                    text : 'Creator stripe account is not created',
                    icon : 'warning',
                    buttons : false,
                    timer : 5000
                }) ;
            }
            
            let stripeAccount = await retrieveAccount(creatorInfo.stripe_account_id) ;

            if(!stripeAccount) {
                // await DeleteUserStripeAccountId(productInfo.creator_id) ;

                return swal({
                    title : 'Warning',
                    text : 'Creator stripe account is not created',
                    icon : 'warning',
                    buttons : false,
                    timer : 5000
                }) ;

            } else {
                if( stripeAccount?.details_submitted) {
                    if(stripeAccount.capabilities.transfers !== 'active') return swal({
                        title : 'Warning',
                        text : 'Creator stripe account transfer is inactive',
                        icon : 'warning',
                        buttons : false,
                        timer : 5000
                    }) ;
                } else return swal({
                    title : 'Warning',
                    text : 'Creator stripe account details is not submitted',
                    icon : 'warning',
                    buttons : false,
                    timer : 5000
                }) ;
            }
        }

        let buyerInfo = await UserInfoByEmail(email) ;

        if(!buyerInfo) {
            buyerInfo = await CreateUserWithoutPassword(fullName, email) ;
        } else {
            if(!buyerInfo.stripe_customer_id) {
                await UpdateUserStripeCustomerId(buyerInfo.id) ;

                buyerInfo = await UserInfoByEmail(email) ;
            }
            
            let role = await CheckBuyerOrOwner(productInfo.id, buyerInfo.id, productInfo.price_type) ;

            setUserRole(role) ;

            if(role) {
                return ;
            }
        }

        if(productInfo.price_type === 'recurring') {
            await payAboutRecurring(buyerInfo) ;
        }
        if(productInfo.price_type === 'legendary') {
            await payAboutLegen(false, buyerInfo) ;
        }
        if(productInfo.price_type === 'free') {
            await getOnFree(buyerInfo.id) ;
        }
    }

    const handleBuyNFT = async () => {
        if(!isWalletConnected) {
            swal({
                title : 'Please, connect your wallet',
                text : 'In order to purchase this product as NFT, you should connect to wallet.',
                icon : 'info',
                buttons : false,
                timer : 5000
            }) ;
            return ;
        }

        let res = await SignInUserWithEmailAndPassword(email, password) ;

        if( res === 200) {
            if(
                await swal({
                    title: "Let's get building!",
                    text: productInfo.price_type === 'rare' ? 'You can bid on this product' : 'You can get this product as NFT',
                    buttons: {
                        confirm : {text:'Got it'},
                    },
                    icon : 'success'
                })
            ) {
                setIsValidUser(true) ;

                let buyerInfo = await UserInfoByEmail(email) ;

                if(!buyerInfo.stripe_customer_id) {
                    await UpdateUserStripeCustomerId(buyerInfo.id) ;
    
                    buyerInfo = await UserInfoByEmail(email) ;
                }
                
                let role = await CheckBuyerOrOwner(productInfo.id, buyerInfo.id, productInfo.price_type) ;

                setUserRole(role) ;
    
                if(role === 'owner') {
                    return ;
                }

                if(productInfo.price_type === 'rare') {
                    setBidAmount(balanceOf);
                    setBidPrice(productInfo?.minimum_bidding) ;
                }
                if(productInfo.price_type === 'legendary') {
                    await payAboutLegen(true, buyerInfo ) ;
                }
            }
        }
        
        if(res === 201) {
            swal({
                title: 'Email Verify',
                text: 'Your email is not verified',
                buttons: {
                    confirm : {text:'Got it'},
                },
                icon : 'info'
            })
        }

        if( res === 'too-many-requests' ) {
            swal({
                title: 'Too Many Requests',
                text: 'Too many sign in requests with this email\nPlease, try it after about 30s',
                buttons: {
                    confirm : {text:'Got it'},
                },
                icon : 'error'
            })
        }
        if( res === 'wrong-password' ){
            swal({
                title: 'Wrong Password',
                text: 'You are using wrong password',
                buttons: {
                    confirm : {text:'Got it'},
                },
                icon : 'error'
            })
        }
        if( res === 'user-not-found' ){
            swal({
                title: 'User Not Found',
                text: 'This account is not exist',
                buttons: {
                    confirm : {text:'Got it'},
                },
                icon : 'error'
            })
        }
    }

    const payAboutRecurring = async (buyerInfo) => {
        let sellerStripeInfo = await SellerStripeInfo(productInfo.creator.id) ;

        let sols_fee = productInfo.recurring_price * 0.01 ;
        let stripe_fee = calcPaymentFee(productInfo.recurring_price) ;
        let transferred_amount = productInfo.recurring_price - sols_fee - stripe_fee ;

        let data = {
            "amount" : Number(amount * 100).toFixed(),
            "currency"  : 'usd',
            "automatic_payment_methods[enabled]" : 'true',
            "customer" : buyerInfo.stripe_customer_id,
            "transfer_data[destination]" : sellerStripeInfo.stripe_account_id,
            "transfer_data[amount]" : Number(transferred_amount * 100).toFixed(),
            // "application_fee_amount" : sols_fee.toFixed(0),
            "metadata[created_at]" : new Date().getTime() ,
            "metadata[creator_stripe_account_id]" : sellerStripeInfo.stripe_account_id,
            "metadata[creator_id]" :  productInfo.creator_id,
            "metadata[product_id]" : productInfo.id
        } ;
        
        let res = await createPaymentIntent(data) ;

        if(res) {
            await CreatePayment(
                res.id,
                res.client_secret,

                productInfo.creator_id,
                productInfo.creator_wallet,
                sellerStripeInfo.full_name,
                sellerStripeInfo.account_name,
                sellerStripeInfo.profile_picture_url,
                sellerStripeInfo.profile_link,
                sellerStripeInfo.email,
                sellerStripeInfo.stripe_account_id,

                buyerInfo.id,
                fullName,
                buyerInfo.email,
                buyerInfo?.profile_picture_url || null,
                null,
                'normal',

                productInfo.id,
                productInfo.product_name,
                `recurring`,
                productInfo.recurring_price,
                productInfo.recurring_unit,
                null,
                null,
                null,

                res.status,

                {
                    platform : productInfo.platform,
                    end_date : productInfo.end_date
                }
            ) ;

            setClientSecret(res.client_secret) ;
            setPaymentId(res.id) ;
            
            return ;
        }

        return swal({
            title : 'Error',
            text : "Your payment is failed",
            buttons : false,
            icon : "error",
            timer : 5000
        })
    }

    const getOnFree = async (buyerId) => {
        if(await swal({
            title : "Confirm",
            text : "This product will be uploaded on your SOLSCloud",
            buttons: [
                'No, I am not sure!',
                'Yes, I am sure!'
            ],
            icon : 'info'
        })) {
            const id = toast.loading("pending...");

            let access_key = uuidv4() ;

            if( await FreeOfferProduct(productInfo.id, buyerId, access_key)) {
                let buyerInfo = await UserInfoById(buyerId) ;

                await CreateNotify({
                    buyer : {
                        email : buyerInfo.email,
                        profile_link : buyerInfo.profile_link,
                        account_name : buyerInfo.account_name,
                        full_name : fullName
                    },
                    price : 0,
                    product : productInfo.product_name,
                    purchased_at : new Date().toLocaleDateString(),
                    seller : productInfo.creator_id,
                    type : 'free'
                }) ;

                await UpdateSellerCustomer(productInfo.creator_id, buyerId) ;
                await SendProductLink(productInfo.creator_id, buyerId, fullName, productInfo.id, access_key) ;

                toast.update(id, { render: "Success", type: "success", autoClose: 5000, isLoading: false });

                swal({
                    title : 'Please, Confirm your email box',
                    text : 'Product URL is sent to your email box.',
                    buttons: {
                        confirm : {text:'Got it'},
                    },
                    icon : 'success',
                    timer : 4000
                }) ;

            } else {
                toast.update(id, { render: "failed" , type: "error", autoClose: 5000, isLoading: false });
            }
        }
    }

    const payAboutLegen = async (resell, buyerInfo) => {
        let sellerStripeInfo = await SellerStripeInfo(productInfo.creator_id) ;

        let amount ;
        
        if(resell) amount = productInfo.ticket_price ;
        else amount = productInfo.product_price;

        let sols_fee = amount * 0.01 ;
        let stripe_fee = calcPaymentFee(amount) ;
        let transferred_amount = amount - sols_fee - stripe_fee ;

        let data = {
            "amount" : Number(amount * 100).toFixed(),
            "currency"  : 'usd',
            "automatic_payment_methods[enabled]" : 'true',
            "customer" : buyerInfo.stripe_customer_id,
            "transfer_data[destination]" : sellerStripeInfo.stripe_account_id,
            "transfer_data[amount]" : Number(transferred_amount * 100 ).toFixed(),
            // "application_fee_amount" : sols_fee.toFixed(0),
            "metadata[created_at]" : new Date().getTime() ,
            "metadata[creator_stripe_account_id]" : sellerStripeInfo.stripe_account_id,
            "metadata[creator_id]" :  productInfo.creator_id,
            "metadata[product_id]" : productInfo.id
        } ;

        let res = await createPaymentIntent(data) ;

        if(res) {
            await CreatePayment(
                res.id,
                res.client_secret,

                productInfo.creator_id,
                productInfo.creator_wallet,
                sellerStripeInfo.full_name,
                sellerStripeInfo.account_name,
                sellerStripeInfo.profile_picture_url,
                sellerStripeInfo.profile_link,
                sellerStripeInfo.email,
                sellerStripeInfo.stripe_account_id,

                buyerInfo.id,
                fullName,
                buyerInfo.email,
                buyerInfo?.profile_picture_url || null,
                walletAddress,
                resell ? 'reseller' : 'normal',

                productInfo.id,
                productInfo.product_name,
                `legendary`,
                resell ? productInfo.ticket_price : productInfo.product_price ,
                resell ? productInfo.ticket_unit : productInfo.product_unit,
                null,
                null,
                resell ? productInfo.nft_id : null,

                res.status,

                {
                    platform : productInfo.platform,
                    end_date : productInfo.end_date
                }
            ) ;

            setClientSecret(res.client_secret) ;
            setPaymentId(res.id) ;
            
            return ;
        }

        return swal({
            title : 'Failed',
            text : 'Your payment is failed',
            buttons: {
                confirm : {text:'Got it'},
            },
            icon : 'error',
            timer : 3000
        }) ;
    }

    React.useEffect(async () => {
        if(productInfo?.price_type === 'rare') {
            console.log(productInfo);
            let balanceOf = await NFTBalance( productInfo.nft_id, productInfo.creator_wallet) ;
            setBalanceOf(balanceOf) ;
        }
    }, [productInfo]) ;

    return (
        <Box className={classes.root}>
            <Box className={classes.infoDiv}>
                {
                    !userRole ? <>
                        {
                            productInfo?.price_type === 'legendary' && <>
                                <Box className={classes.ctrlGroup}>
                                    {
                                        productInfo.resellable && <>
                                            <Box className={classes.labelDiv}>
                                                Purchase Type
                                            </Box>
                                            <FormControl
                                                fullWidth
                                            >
                                                <Select
                                                    value={purchaseType}
                                                    MenuProps={{
                                                        className : classes.selectDiv
                                                    }}
                                                    onChange={(e) =>  setPurchaseType(e.target.value)}
                                                >
                                                    {
                                                        <MenuItem value={'general'}>General</MenuItem>
                                                    }
                                                    {
                                                        productInfo?.resellable && <MenuItem value={'nft'}>NFT</MenuItem>
                                                    }
                                                </Select>
                                            </FormControl>
                                        </>
                                    }
                                    {
                                        purchaseType === 'general' ? <>
                                            <Box className={classes.ctrlGroup} sx={{mt : '10px'}}>
                                                <Box className={classes.labelDiv}>
                                                    Full Name
                                                </Box>
                                                <TextField 
                                                    placeholder='Enter your full name'
                                                    name={'fullName'}
                                                    value={fullName || ''}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    fullWidth
                                                    helperText={errorMandatoryHelper(fullName)}
                                                />
                                            </Box>
                                            <Box className={classes.ctrlGroup}>
                                                <Box className={classes.labelDiv}>
                                                    Email
                                                </Box>
                                                <TextField 
                                                    placeholder='Enter your email'
                                                    name={'email'}
                                                    value={email || ''}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    helperText={ errorEmailHelper(email) }
                                                    fullWidth
                                                />
                                            </Box>
                                            <Box className={classes.ctrlGroup} sx={{ display :'flex', justifyContent : 'flex-end', mt : '20px'}}>
                                                <Button variant={'contained'} 
                                                    onClick={() => handleBuyProduct()} className={classes.buttonCss1}
                                                    disabled={!validator.isEmail(email || '') || !fullName }
                                                >
                                                    Buy with Stripe
                                                </Button>
                                                {/* <Button variant={'contained'} 
                                                    onClick={() => handleBuyProduct()} className={classes.buttonCss1}
                                                    disabled={!validator.isEmail(email || '') || !fullName }
                                                >
                                                    Buy with Wallet
                                                </Button> */}
                                            </Box>
                                        </> 
                                        : <>
                                            <Box className={classes.ctrlGroup} sx={{mt : '10px'}}>
                                                <Box className={classes.labelDiv}>
                                                    Email
                                                </Box>
                                                <TextField 
                                                    name={'email'}
                                                    placeholder='Enter your email'
                                                    value={email || ''}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    helperText={ errorEmailHelper(email) }
                                                    fullWidth
                                                />
                                            </Box>
                                            <Box className={classes.ctrlGroup}>
                                                <Box className={classes.labelDiv}>
                                                    Password
                                                </Box>
                                                <TextField
                                                    placeholder='Enter your password'
                                                    type={!passwordVisible ? 'password' : 'text'}
                                                    size='medium'
                                                    fullWidth
                                                    InputProps={{
                                                        endAdornment: <InputAdornment position="end" sx={{cursor : 'pointer'}} onClick={() => setPasswordVisible(!passwordVisible)}>
                                                        {
                                                            !passwordVisible ? <VisibilityIcon/> : <VisibilityOffIcon/>
                                                        }
                                                    </InputAdornment>,
                                                    }}
        
                                                    helperText={
                                                        errorPasswordHelper(password)
                                                    }
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    value={password || ''}
                                                />
                                            </Box>
                                            <Box className={classes.ctrlGroup}>
                                                <Box className={classes.labelDiv} sx={{fontSize : '13px', color  : theme.palette.blue.B100}}>
                                                    In order to purchaset this product as NFT, you should use your SOLSTICE account email and password.
                                                </Box>
                                            </Box>
                                            <Box className={classes.ctrlGroup}>
                                                <Box className={classes.labelDiv} sx={{fontSize : '12px', color  : theme.palette.green.G100}}>
                                                    Don't you have SOLSTICE account? <a href='auth/' target={'_blank'}>Sign Up</a>
                                                </Box>
                                            </Box>
                                            <Box className={classes.ctrlGroup} sx={{ display :'flex', justifyContent : 'flex-end', mt : '20px'}}>
                                                <Button variant={'contained'} onClick={() => handleBuyNFT()} className={classes.buttonCss1}
                                                    disabled={  !validator.isEmail(email || '') 
                                                                || !password || password?.length < 8
                                                    }
                                                >
                                                    Buy NFT
                                                </Button>
                                            </Box>
                                        </>
                                    }
                                </Box>
                                
                            </>
                        }
                        {
                            productInfo?.price_type === 'recurring' && <> 
                                <Box className={classes.ctrlGroup}>
                                    <Box className={classes.labelDiv}>
                                        Full Name
                                    </Box>
                                    <TextField 
                                        placeholder='Enter your full name'
                                        value={fullName || ''}
                                        onChange={(e) => setFullName(e.target.value)}
                                        fullWidth
                                        helperText={errorMandatoryHelper(fullName)}
                                    />
                                </Box>
                                <Box className={classes.ctrlGroup}>
                                    <Box className={classes.labelDiv}>
                                        Email
                                    </Box>
                                    <TextField 
                                        placeholder='Enter your email'
                                        value={email || ''}
                                        onChange={(e) => setEmail(e.target.value)}
                                        helperText={ errorEmailHelper(email) }
                                        fullWidth
                                    />
                                </Box>
                                <Box className={classes.ctrlGroup} sx={{ display :'flex', justifyContent : 'flex-end', mt : '20px'}}>
                                    <Button variant={'contained'} onClick={() => handleBuyProduct()} className={classes.buttonCss1}
                                        disabled={!validator.isEmail(email || '') || !fullName }
                                    >
                                        Buy with Stripe
                                    </Button>
                                </Box>
                            </>
                        }
                        {
                            productInfo?.price_type === 'free' && <> 
                                <Box className={classes.ctrlGroup}>
                                    <Box className={classes.labelDiv}>
                                        Full Name
                                    </Box>
                                    <TextField 
                                        value={fullName || ''}
                                        onChange={(e) => setFullName(e.target.value)}
                                        fullWidth
                                        helperText={errorMandatoryHelper(fullName)}
                                    />
                                </Box>
                                <Box className={classes.ctrlGroup}>
                                    <Box className={classes.labelDiv}>
                                        Email
                                    </Box>
                                    <TextField 
                                        value={email || ''}
                                        onChange={(e) => setEmail(e.target.value)}
                                        helperText={ errorEmailHelper(email) }
                                        fullWidth
                                    />
                                </Box>
                                <Box className={classes.ctrlGroup} sx={{ display :'flex', justifyContent : 'flex-end', mt : '20px'}}>
                                    <Button variant={'contained'} onClick={() => handleBuyProduct()} className={classes.buttonCss1}
                                        disabled={!validator.isEmail(email || '') || !fullName }
                                    >
                                        Get On Free
                                    </Button>
                                </Box>
                            </>
                        }
                        {
                            productInfo?.price_type === 'rare' && (
                                isValidUser ? <>
                                    <Box className={classes.ctrlGroup}>
                                        <Box className={classes.labelDiv}>
                                            Wallet Address
                                        </Box>
                                        <Box className={classes.valueDiv}>
                                            { walletAddress || 'Lock' }
                                        </Box>
                                    </Box>
                                    <Box className={classes.ctrlGroup}>
                                        <Box className={classes.labelDiv}>
                                            Bid Price
                                        </Box>
                                        <TextField
                                            type={'number'}
                                            min={productInfo?.minimum_bidding || 0}
                                            value={bidPrice}
                                            onChange={(e) => setBidPrice(e.target.value)}
                                            fullWidth
                                        />
                                    </Box>
                                    <Box className={classes.ctrlGroup}>
                                        <Box className={classes.labelDiv}>
                                            Bid Amount
                                        </Box>
                                        <TextField 
                                            type={'number'}
                                            min={productInfo?.available_items || 0}
                                            value={bidAmount}
                                            onChange={(e) => handleBidAmount(e.target.value)}
                                            fullWidth
                                        />
                                    </Box>
                                    <Box className={classes.ctrlGroup} sx={{ display :'flex', justifyContent : 'flex-end', mt : '20px'}}>
                                        <Button variant={'contained'} onClick={() => handlePlaceBid()} className={classes.buttonCss1}>
                                            Place Bid
                                        </Button>
                                    </Box>
                                </>: <>
                                    <Box className={classes.ctrlGroup}>
                                        <Box className={classes.labelDiv}>
                                            Email
                                        </Box>
                                        <TextField 
                                            placeholder='Enter your email'
                                            value={email || ''}
                                            onChange={(e) => setEmail(e.target.value)}
                                            helperText={ errorEmailHelper(email) }
                                            fullWidth
                                        />
                                    </Box>
                                    <Box className={classes.ctrlGroup}>
                                        <Box className={classes.labelDiv}>
                                            Password
                                        </Box>
                                        <TextField
                                            placeholder='Enter your password'
                                            type={!passwordVisible ? 'password' : 'text'}
                                            size='medium'
                                            fullWidth
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end" sx={{cursor : 'pointer'}} onClick={() => setPasswordVisible(!passwordVisible)}>
                                                {
                                                    !passwordVisible ? <VisibilityIcon/> : <VisibilityOffIcon/>
                                                }
                                            </InputAdornment>,
                                            }}

                                            helperText={
                                                errorPasswordHelper(password)
                                            }
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password || ''}
                                        />
                                    </Box>
                                    <Box className={classes.ctrlGroup}>
                                        <Box className={classes.labelDiv} sx={{fontSize : '12px', color  : theme.palette.green.G100}}>
                                            Don't you have SOLSTICE account? <a href='auth/' target={'_blank'}>Sign Up</a>
                                        </Box>
                                    </Box>
                                    <Box className={classes.ctrlGroup} sx={{ display :'flex', justifyContent : 'flex-end', mt : '20px'}}>
                                        <Button variant={'contained'} onClick={() => handleBuyNFT()} className={classes.buttonCss1}
                                            disabled={  !validator.isEmail(email || '') 
                                                        || !password || password?.length < 8
                                            }
                                        >
                                            Sign In
                                        </Button>
                                    </Box>
                                </>
                            )
                        }
                    
                    </> : <>
                        <img src={SuccessImage} className={classes.iconCss} />
                        <>
                            {
                                userRole === 'owner' ? <>
                                    <Box className={classes.ctrlGroup}>
                                        <Box className={classes.descriptionDiv} >
                                            You are owner of this NFT.
                                        </Box>
                                        <Box className={classes.descriptionDiv} sx={{mt : '20px',}}>
                                            Product Link
                                        </Box>
                                        <Tooltip title={ location.origin + '/product-link?access_key=' + productInfo.access_key }>
                                            <Box className={classes.descriptionDiv}>
                                                <a href={location.origin + '/product-link?access_key=' + productInfo.access_key}>
                                                    { new String(location.origin + '/product-link?access_key=' + productInfo.access_key).slice(0 , 30) }...
                                                </a>
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                </> : <>
                                    <Box className={classes.ctrlGroup}>
                                        <Box className={classes.descriptionDiv} >
                                            You had already bought this product.
                                        </Box>
                                        <Box className={classes.descriptionDiv} sx={{mt : '20px',}}>
                                            Product Link
                                        </Box>
                                        <Tooltip title={ location.origin + '/product-link?access_key=' + productInfo.access_key }>
                                            <Box className={classes.descriptionDiv}>
                                                <a href={location.origin + '/product-link?access_key=' + productInfo.access_key}>
                                                    { new String(location.origin + '/product-link?access_key=' + productInfo.access_key).slice(0 , 30) }...
                                                </a>
                                            </Box>
                                        </Tooltip>
                                    </Box>
                                    {
                                        productInfo.price_type === 'legendary' && <Box className={classes.ctrlGroup} sx={{ display :'flex', justifyContent : 'flex-end', mt : '20px'}}>
                                            <Button variant='contained' className={classes.buttonCss1} onClick={() => {
                                                setUserRole(false) ;
                                                setPurchaseType('nft') ;
                                            }}>
                                                Got it
                                            </Button>
                                        </Box>
                                    }
                                </>
                            }
                        </>
                    </>
                }
            
            </Box>
        </Box>
    )
}
BuyerInfo.propTypes= {
    SignInUserWithEmailAndPassword : PropTypes.func.isRequired
}
const mapStateToProps = state => ({

})
const mapDispatchToProps = {
    SignInUserWithEmailAndPassword
}

export default connect(mapStateToProps, mapDispatchToProps) (BuyerInfo) ;