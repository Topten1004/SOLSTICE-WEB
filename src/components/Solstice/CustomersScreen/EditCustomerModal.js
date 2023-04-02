import * as React from 'react' ;

import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;
import { UserAccountInfo } from '../../../redux/actions/profile';

import CloseIcon from '@mui/icons-material/Close';
import Loading from 'react-loading-components' ;

import { errorEmailHelper, errorMandatoryHelper } from '../../../utils/Error' ;

import validator from 'validator';
import { getCookie } from '../../../utils/Helper';

import PhoneInput, { isValidPhoneNumber , parsePhoneNumber} from 'react-phone-number-input' ;
import countries from 'react-select-country-list' ;

import { UpdateUserCustomer } from '../../../firebase/user_collection';

import EmailImage from '../../../assets/platform/Email.svg';
import SMSImage from '../../../assets/platform/SMS.svg' ;
import FacebookImage from '../../../assets/platform/Facebook.svg' ;
import TikTokImage from '../../../assets/platform/TikTok.svg' ;
import InstagramImage from '../../../assets/platform/Instagram.svg';
import LinkedInImage from '../../../assets/platform/LinkedIn.svg';

import  {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Box,
    Button,
    Grid,
    TextField,
    FormControl,
    Select,
    MenuItem
} from '@mui/material' ;

import { useStyles } from './StylesDiv/EditCustomer.styles';
import { useTheme } from '@mui/styles';

const EditCustomerModal = (props) => {

    const classes = useStyles() ;
    const theme = useTheme() ;

    const {
        open,
        handleClose,

        selectedCustomer,
        customers,
        UserAccountInfo
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

    const [email, setEmail] = React.useState(null) ;
    const [fullName, setFullName] = React.useState(null) ;
    const [phoneNumber, setPhoneNumber] = React.useState('') ;
    const [platform, setPlatform] = React.useState('none') ;
    const [socialUserName, setSocialUserName] = React.useState(null) ;
    const [country, setCountry] = React.useState('none') ;
    const [loading, setLoading] = React.useState(false) ;

    let countryList = React.useMemo(() => countries().getData() , []) ;

    const handleEditCustomer = async () => {
        setLoading(true) ;

        let temp = {
            email : email,
            full_name : fullName,
            phone_number : phoneNumber || null,
            social_platform : platform === 'none' ? null : platform,
            social_user_name : socialUserName || null,
            location : country === 'none' ? null : country,
            
            id : selectedCustomer?.id
        }

        await UpdateUserCustomer(getCookie('_SOLSTICE_AUTHUSER'), [
            ...customers.filter(customer => customer.email !== email),
            temp
        ]) ;

        await UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;

        handleClose() ;
        
        setLoading(false) ;
    }

    const checkPlatform = ( platform ) => {
        if(platform.indexOf('email') >= 0) {
            setPlatform('email') ;
            return ;
        }
        if(platform.indexOf('sms') >= 0 || platform.indexOf('text') >= 0) {
            setPlatform('sms') ;
            return ;
        }
        if(platform.indexOf('tiktok') >= 0) {
            setPlatform('tiktok') ;
            return ;
        }
        if(platform.indexOf('linkedin') >= 0) {
            setPlatform('linkedin');
            return ;
        }
        if(platform.indexOf('facebook') >= 0) {
            setPlatform('facebook');
            return ;
        }
        if(platform.indexOf('instagram') >= 0) {
            setPlatform('facebook') ;
            return ;
        }
    }

    React.useEffect(() => {
        if(selectedCustomer) {
            setEmail(selectedCustomer.email);
            setFullName(selectedCustomer.full_name) ;
            setSocialUserName(selectedCustomer.social_user_name) ;
            if(selectedCustomer?.phone_number) setPhoneNumber(selectedCustomer.phone_number) ;
            if(selectedCustomer?.social_platform) checkPlatform(selectedCustomer.social_platform) ;
            if(selectedCustomer?.location) {
                setCountry(selectedCustomer.location) ;
            }
        } 
    }, [selectedCustomer]) ;

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
                        Edit Customer 
                    </Box>
                    <CloseIcon onClick={handleClose} sx={{cursor : 'pointer'}} className={classes.closeButtonCss} />
                </DialogTitle>
                <Box className={classes.dividerDiv} />
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12}>
                            <Box className={classes.labelDiv}>Full Name</Box>
                            <Box>
                                <TextField
                                    placeholder="Enter Customer's Full Name"
                                    size='small'
                                    fullWidth
                                    value={fullName || ''}
                                    onChange={(e) => setFullName(e.target.value)}
                                    helperText={errorMandatoryHelper(fullName)}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{mt : '15px'}}>
                            <Box className={classes.labelDiv}>Email</Box>
                            <Box>
                                <TextField
                                    placeholder="Enter Customer's Email"
                                    size='small'
                                    fullWidth
                                    value={email || ''}
                                    onChange={(e) => setEmail(e.target.value)}
                                    helperText={errorEmailHelper(email)}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{mt : '15px'}}>
                            <Box className={classes.labelDiv}>Phone Number</Box>
                            <Box className={classes.flagDiv}>
                                <PhoneInput
                                    placeholder="Enter phone number"
                                    value={phoneNumber}
                                    onChange={setPhoneNumber}
                                />
                                <Box sx={{color : 'red', fontSize : 13}}>
                                    {
                                        phoneNumber ? (isValidPhoneNumber(phoneNumber) ? undefined : 'Invalid phone number') : ''
                                    }
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{mt : '15px'}}>
                            <Box className={classes.labelDiv}>Social Media Platform</Box>
                            <FormControl fullWidth>
                                <Select
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    MenuProps={{
                                        className : classes.selectDiv
                                    }}
                                >
                                    {
                                        platform === 'none' && <MenuItem value='none'>No select platform</MenuItem>
                                    }
                                    {
                                        platformList.map( (platform , index) => {
                                            return (
                                                <MenuItem value={platform.name} key={index}>
                                                    <img src={platform.img} width={30} height={30}/>&nbsp;&nbsp;
                                                    {
                                                        platform.official_name 
                                                    }
                                                </MenuItem>
                                            )
                                        } )
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{mt : '15px'}}>
                            <Box className={classes.labelDiv}>Social Media User Name</Box>
                            <Box>
                                <TextField
                                    placeholder="Enter Social Media User Name"
                                    size='small'
                                    fullWidth
                                    value={socialUserName || ''}
                                    onChange={(e) => setSocialUserName(e.target.value)}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} sx={{mt : '15px'}}>
                            <Box className={classes.labelDiv}>Location</Box>
                            <FormControl fullWidth>
                                <Select
                                    value={ country }
                                    onChange={(e) => setCountry(e.target.value)}
                                    MenuProps={{
                                        className : classes.selectDiv
                                    }}
                                >
                                    {
                                        country === 'none' && <MenuItem value='none'>No select country</MenuItem>
                                    }
                                    {
                                        selectedCustomer?.location &&  <MenuItem value={selectedCustomer?.location}>
                                            { selectedCustomer?.location }
                                        </MenuItem>
                                    }
                                    {
                                        countryList.map( (country , index) => {
                                            return (
                                                <MenuItem value={country.label} key={index}>{country.label}</MenuItem>
                                            )
                                        } )
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <Box className={classes.dividerDiv} />
                <DialogActions>
                    <Button variant={'contained'}
                        startIcon={ loading && <Loading type='tail_spin' width={30} height={30} fill='#e83e8c' />}
                        disabled={ (!validator.isEmail(email || '') || !fullName || (phoneNumber && !isValidPhoneNumber(phoneNumber))) || loading || !customers}
                        className={classes.buttonCss}
                        onClick={handleEditCustomer}
                    >
                        Edit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
EditCustomerModal.propTypes = {
    UserAccountInfo : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
})
const mapDispatchToProps = {
    UserAccountInfo
}
export default connect(mapStateToProps, mapDispatchToProps)(EditCustomerModal) ;