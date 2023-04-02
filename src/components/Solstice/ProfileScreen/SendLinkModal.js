import * as React from 'react' ;

import { useLocation } from 'react-use' ;

import { connect } from 'react-redux';

import PhoneInput, { isValidPhoneNumber , parsePhoneNumber} from 'react-phone-number-input' ;
import CustomersList from './CustomersList';

import { SendPaymentLinkByEmail } from '../../../email';
import { SendPaymentLinkByTwilio } from '../../../twilio';

import CloseIcon from '@mui/icons-material/Close';
import validator from 'validator';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Loading from 'react-loading-components' ;

import swal from 'sweetalert';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

import EmailImage from '../../../assets/platform/Email.svg';
import SMSImage from '../../../assets/platform/SMS.svg' ;
import FacebookImage from '../../../assets/platform/Facebook.svg' ;
import TikTokImage from '../../../assets/platform/TikTok.svg' ;
import InstagramImage from '../../../assets/platform/Instagram.svg';
import LinkedInImage from '../../../assets/platform/LinkedIn.svg';

import { UpdateAccessibleCustomersToRestricted } from '../../../firebase/user_collection';
import { ActiveProductLink } from '../../../firebase/product_collection';

import { retrieveAccount } from '../../../stripe/account_api';
import { SendPaymentLinkByLinkedIn } from '../../../social/linkedin_api';

import  {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Box,
    Button,
    Grid,
    TextField,
    InputAdornment,
    Tooltip,
    FormControl,
    Select,
    MenuItem
} from '@mui/material' ;

import { useStyles } from './StylesDiv/SendLink.styles';
import { useTheme } from '@mui/styles';

const SendLinkModal = (props) => {

    const classes = useStyles() ;
    const theme = useTheme() ;
    const location = useLocation() ;

    const linkCtrl = React.useRef(null) ;

    const {
        open,
        handleClose,

        productInfo,
        creator_email,
        creator_name,
        creator_phone_number,

        customersList,
        stripe_account_id,
    } = props ;

    const platformList = [
        {
            img : EmailImage,
            name : "email",
            official_name : "Email"
        }, 
        {
            img : SMSImage,
            name : "sms",
            official_name : "Text Message"
        }, 
        {
            img : TikTokImage,
            name : "tiktok",
            official_name : "TikTok Direct Message"
        },  
        {
            img :LinkedInImage,
            name : 'linkedin',
            official_name : "LinkedIN Direct Message"
        }, 
        {
            img : FacebookImage,
            name : "facebook",
            official_name : "Facebook Messenger"
        }, 
        {
            img : InstagramImage,
            name : 'instagram',
            official_name : "Instagram Direct Message"
        }
    ] ;

    const [receiverEmail, setReceiverEmail] = React.useState('') ;
    const [isCopied , setIsCopied] = React.useState(false) ;
    const [loading, setLoading] = React.useState(false) ;
    const [searchStr, setSearchStr] = React.useState('') ;

    const [accessMethod, setAccessMethod] = React.useState('restricted') ;
    const [introLink, setIntroLink] = React.useState('') ;

    const [selectedPlatform,  setSelectedPlatfrom] = React.useState(0) ;
    const [filterList, setFilterList] = React.useState(null) ;

    const [emailMessage, setEmailMessage] = React.useState('') ;
    const [emailSubject, setEmailSubject] = React.useState('') ;

    const [phoneNumber, setPhoneNumber] = React.useState('') ;
    const [textMessage, setTextMessage] = React.useState('') ;

    const [stripeStatus, setStripeStatus] = React.useState(null) ;

    const handleSendLinkByEmail = async () => {

        setLoading(true) ;

        let receiversList = [] ;

        for(let i = 0 ; i < filterList.length ; i++) {
            if(document.getElementById('check_send_link_' + i).checked ) {
                if(validator.isEmail(filterList[i]?.email)) receiversList.push(filterList[i].email) ;
            }
        }

        if(validator.isEmail(receiverEmail || '') && !receiversList.includes(receiverEmail)) {
            receiversList.push(receiverEmail) ;
        }

        if(!receiversList.length) {
            swal({
                title : 'Warning',
                text : "Please, Select or Input receiver's email" ,
                buttons : false,
                icon : 'info',
                timer : 5000
            }) ;

            setLoading(false) ;

            return ;
        }

        await SendPaymentLinkByEmail(
            introLink + "&platform=email&end=" + new Date().getTime(),
            productInfo,
            creator_name,
            creator_email,
            receiversList,
            emailSubject,
            emailMessage,
        )

        await ActiveProductLink(productInfo.id, receiversList.length) ;

        if(accessMethod === 'restricted') await UpdateAccessibleCustomersToRestricted(productInfo.id, receiversList) ;

        swal({
            title : 'Success',
            text : 'You sent product url successfully!',
            buttons : false,
            icon : 'info',
            timer : 5000
        }) ;

        setLoading(false) ;
        handleClose() ;
    }

    const handleSendLinkByPhone = async () => {
        setLoading(true) ;

        let receiversList = [] ;

        for(let i = 0 ; i < filterList.length ; i++) {
            if(document.getElementById('check_send_link_' + i).checked ) {
                if(isValidPhoneNumber(filterList[i].phone_number)) receiversList.push(filterList[i].phone_number) ;
            }
        }

        console.log(receiversList) ;

        if(isValidPhoneNumber(phoneNumber || '') && !receiversList.includes(phoneNumber)) {
            receiversList.push(phoneNumber) ;
        }

        if(!receiversList.length) {
            swal({
                title : 'Warning',
                text : "Please, Select or Input receiver's phone number" ,
                buttons : false,
                icon : 'info',
                timer : 5000
            }) ;

            setLoading(false) ;

            return ;
        }

        await SendPaymentLinkByTwilio(
            introLink + "&platform=phone&end=" + new Date().getTime(),
            productInfo,
            creator_name,
            creator_email,
            creator_phone_number,
            receiversList,
            textMessage
        )

        await ActiveProductLink(productInfo.id, receiversList.length) ;

        if(accessMethod === 'restricted') await UpdateAccessibleCustomersToRestricted(productInfo.id, receiversList) ;

        swal({
            title : 'Success',
            text : 'You sent product url successfully!' ,
            buttons : false,
            icon : 'info',
            timer : 5000
        }) ;

        setLoading(false) ;
        handleClose() ;
    }

    const handleSendLinkByIn = async () => {
        console.log('linkedin') ;
        
        let res = await SendPaymentLinkByLinkedIn() ;

        console.log(res) ;
    }

    const handleSendLinkByIns = async () => {

    }

    const handleSendLinkByTik = async () => {

    }

    const handleSendLinkByBook = async () => {

    }

    const emitCopyEvent = () => {
        setIsCopied(true) ;
        linkCtrl.current.select() ;
        document.execCommand("copy");
    }

    const handleSelectPlatform = (selectedPlatform) => {
        setSelectedPlatfrom(selectedPlatform) ;
    }

    React.useEffect(() => {
        if(customersList) {
            let temp = customersList.filter( customer => 
                customer.full_name.toLowerCase().search(searchStr.toLowerCase()) >= 0 
                || customer.email.toLowerCase().search(searchStr.toLowerCase()) >= 0
            ) ;

            setFilterList(temp) ;
        } 
    }, [customersList, searchStr]) ;

    React.useEffect(() => {
        if(accessMethod === 'restricted') setIntroLink(location?.origin + "/product-intro?linkId=" + productInfo?.intro_link_restricted) ;
        if(accessMethod === 'anyone') setIntroLink(location?.origin + "/product-intro?linkId=" + productInfo?.intro_link_anyone) ;
    }, [accessMethod, productInfo]) ;

    React.useEffect(async () => {
        if(stripe_account_id !== 'loading') {
            if(stripe_account_id) {
                let stripeAccount = await retrieveAccount(stripe_account_id) ;
    
                if(stripeAccount) {
                    if( stripeAccount.details_submitted) {
                        if(stripeAccount.capabilities.transfers === 'pending') setStripeStatus('pending') ;
                        else if(stripeAccount.capabilities.transfers === 'active') setStripeStatus('active') ;
                        else setStripeStatus('inactive') ;
                    } else setStripeStatus('incomplete') ;
                } else {
                    setStripeStatus('disconnected') ;
                }
            } else {
                setStripeStatus('not created') ;
            }
        }
    }, [stripe_account_id]) ;

    return (
        <Box className={classes.root}>
            <Dialog
                open={open}
                fullWidth
                classes ={{
                    paper : classes.paper
                }}
                hideBackdrop={true}
            >
                <Box className={classes.greenBlur} />
                <Box className={classes.blueBlur} />
                <DialogTitle>
                    <Box>
                        Product : { productInfo?.product_name }
                    </Box>
                    <CloseIcon onClick={handleClose} sx={{cursor : 'pointer'}} className={classes.closeButtonCss} />
                </DialogTitle>
                <Box className={classes.dividerDiv} />
                <DialogContent>
                   <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{color : stripeStatus !== 'active' && 'red'}}>
                                {
                                    productInfo?.price_type !== 'free' && "** Your stripe account is " + stripeStatus
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box className={classes.labelDiv}>Platform : { platformList[selectedPlatform].official_name }</Box>
                            <Box className={classes.platformDiv}>
                                {
                                    platformList.map((item, index) => {
                                        return (
                                            <Box className={classes.imgDiv} key={index} onClick={() => handleSelectPlatform(index)}
                                            >
                                                <img src={item.img}
                                                    className={classes.socialIconCss}
                                                />
                                            </Box>
                                        )
                                    })
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box className={classes.labelDiv}>General Access</Box>
                            <FormControl fullWidth>
                                <Select
                                    value={accessMethod}
                                    onChange={(e) => setAccessMethod(e.target.value)}
                                    MenuProps={{
                                        className : classes.selectDiv
                                    }}
                                    size={'small'}
                                >
                                    
                                    <MenuItem value={'restricted'} >
                                        Restricted
                                    </MenuItem>
                                    <MenuItem value={'anyone'} >
                                        Anyone with the link
                                    </MenuItem>      
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Box className={classes.labelDiv}>URL</Box>
                            <Box sx={{fontSize : '20px',}}>
                                <TextField
                                    size='small'
                                    fullWidth
                                    value={introLink}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">
                                            <Tooltip title={isCopied ? "Copied" : 'Copy'}>
                                                <Box className={classes.copyDiv}  onClick={() => emitCopyEvent()} onMouseLeave={() => setIsCopied(false)}>
                                                    <ContentCopyIcon fontSize={"small"}  />
                                                </Box>
                                            </Tooltip>
                                        </InputAdornment>,
                                    }}
                                />
                                <Box sx={{position : 'fixed', top : '10000px !important', right: '10000px !important'}}>
                                    <input type={'text'} value={introLink} ref={linkCtrl}
                                        onChange={(e) => setIntroLink(e.target.value)}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{mt : '10px'}}>
                            <Box className={classes.labelDiv}>Customer List</Box>
                            <TextField
                                placeholder='Search customer by email or name'
                                size='small'
                                fullWidth
                                onChange={(e) => setSearchStr(e.target.value)}
                                value={searchStr}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        <ManageSearchIcon/>
                                    </InputAdornment>,
                                }}
                            />
                            <CustomersList
                                filterList={filterList}
                            />
                        </Grid>
                        {
                            platformList[selectedPlatform].name === 'email' && <>
                                <Grid item xs={12} sx={{mt : '10px'}}>
                                    <Box className={classes.labelDiv}>Receiver Email</Box>
                                    <Box >
                                        <TextField
                                            size='small'
                                            fullWidth
                                            onChange={(e) => setReceiverEmail(e.target.value)}
                                            value={receiverEmail}
                                            helperText={!validator.isEmail(receiverEmail) && receiverEmail !== '' ? 'Invalid Email' : ''}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sx={{mt : '10px'}}>
                                    <Box className={classes.labelDiv}>Subject</Box>
                                    <Box >
                                        <TextField
                                            size='small'
                                            fullWidth
                                            onChange={(e) => setEmailSubject(e.target.value)}
                                            value={emailSubject}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sx={{mt : '10px'}}>
                                    <Box className={classes.labelDiv}>Message</Box>
                                    <Box >
                                        <TextField
                                            size='small'
                                            fullWidth
                                            onChange={(e) => setEmailMessage(e.target.value)}
                                            value={emailMessage}
                                            multiline
                                            rows={3}
                                        />
                                    </Box>
                                </Grid>
                            </>
                        }
                        {
                            platformList[selectedPlatform].name === 'sms' &&  <>
                                <Grid item xs={12} sx={{mt : '10px'}}>
                                    <Box className={classes.labelDiv}>Receiver Phone Number</Box>
                                    <Box className={classes.flagDiv}>
                                        <PhoneInput
                                            placeholder="Enter phone number"
                                            value={phoneNumber}
                                            onChange={setPhoneNumber}
                                        />
                                        <Box sx={{color : 'red', fontSize : 13}}>
                                            {
                                                phoneNumber ? (isValidPhoneNumber(phoneNumber) ? undefined : 'Invalid phone number') : 'Phone number required'
                                            }
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sx={{mt : '10px'}}>
                                    <Box className={classes.labelDiv}>Text Message</Box>
                                    <Box >
                                        <TextField
                                            size='small'
                                            fullWidth
                                            onChange={(e) => setTextMessage(e.target.value)}
                                            value={textMessage}
                                            multiline
                                            rows={3}
                                        />
                                    </Box>
                                </Grid> 
                            </>
                        }
                    </Grid>
                </DialogContent>
                <Box className={classes.dividerDiv} />
                <DialogActions>
                    <Button variant={'contained'} onClick={
                        (platformList[selectedPlatform].name === 'email' && handleSendLinkByEmail) ||
                        (platformList[selectedPlatform].name === 'sms' && handleSendLinkByPhone) || 
                        (platformList[selectedPlatform].name === 'linkedin' && handleSendLinkByIn) || 
                        (platformList[selectedPlatform].name === 'tiktok' && handleSendLinkByTik) || 
                        (platformList[selectedPlatform].name === 'instagram' && handleSendLinkByIns) || 
                        (platformList[selectedPlatform].name === 'facebook' && handleSendLinkByBook)
                    } 
                        disabled={!productInfo || loading || (stripeStatus !== 'active' && productInfo?.price_type !== 'free')}
                        startIcon={ loading && <Loading type='tail_spin' width={30} height={30} fill='#e83e8c' />}
                        className={classes.buttonCss}
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

const mapStateToProps = state => ({
    creator_email : state.profile.email,
    creator_name : state.profile.accountName,
    creator_phone_number : state.profile.phoneNumber,
    customersList : state.profile.customers
})
const mapDispatchToProps = {
}
export default connect(mapStateToProps, mapDispatchToProps)(SendLinkModal) ;