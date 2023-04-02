import * as React from 'react' ;

import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;
import {UserAccountInfo} from '../../../redux/actions/profile' ;

import CloseIcon from '@mui/icons-material/Close';
import Loading from 'react-loading-components' ;

import { errorEmailHelper, errorMandatoryHelper } from '../../../utils/Error' ;
import { UpdateUserCustomer } from '../../../firebase/user_collection';
import { getCookie } from '../../../utils/Helper';

import CSVImage from '../../../assets/files/CSV.png' ;

import validator from 'validator';

import PhoneInput, { isValidPhoneNumber , parsePhoneNumber} from 'react-phone-number-input' ;
import countries from 'react-select-country-list'

import CSVList from './CSVList';

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
    InputLabel,
    InputAdornment,
    Tooltip,
    FormControl,
    Select,
    MenuItem
} from '@mui/material' ;

import { useStyles } from './StylesDiv/AddCustomer.styles';
import { useTheme } from '@mui/styles';

const AddCustomerModal = (props) => {

    const classes = useStyles() ;
    const theme = useTheme() ;

    const {
        open,
        handleClose,

        UserAccountInfo,
        customers
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

    const reader = new FileReader();
    const [email, setEmail] = React.useState(null) ;
    const [fullName, setFullName] = React.useState(null) ;
    const [loading, setLoading] = React.useState(false) ;
    const [method, setMethod] = React.useState('input') ;
    const [csvData, setCsvData] = React.useState([]) ;
    const [phoneNumber, setPhoneNumber] = React.useState('') ;
    const [platform, setPlatform] = React.useState('none') ;
    const [socialUserName, setSocialUserName] = React.useState(null) ;
    const [country, setCountry] = React.useState('none') ;

    const countryList = React.useMemo(() => countries().getData() , []) ;

    const handleImportCSV = async (e) => {
        setLoading(true) ;

        console.log(customers) ;

        if(!e.target.files.length)  return ;

        reader.onload = (e) => {
            let data = e.target.result;

            const tempList = [...customers] ;

            data = data.split("\r\n"); 

            for (let i in data) { 
                data[i] = data[i].split(",");

                if(data[i].length >= 5) {
                    if(validator.isEmail(data[i][1])) {
                        let tmp =   {
                            full_name : data[i][0],
                            email : data[i][1],
                            id : null,
                            phone_number : data[i][2],
                            social_platform : data[i][3],
                            social_user_name : data[i][4],
                            location : data[i][5],
                        } ;

                        let find_idx_csv = tempList.findIndex( item => item.email === data[i][1] );

                        if( find_idx_csv === -1 ){
                            tempList.push({
                                ...tmp
                            }) ;
                            find_idx_csv = tempList.length - 1 ;
                        } else {
                            tempList[find_idx_csv] = {
                                ...tempList[find_idx_csv],
                                full_name : tempList[find_idx_csv].full_name || data[i][0],
                                phone_number : tempList[find_idx_csv].phone_number || data[i][2],
                                social_platform : tempList[find_idx_csv].social_platform || data[i][3],
                                social_user_name : tempList[find_idx_csv].social_user_name || data[i][4],
                                location : tempList[find_idx_csv].location || data[i][5]
                            }
                        }
                    }
                }
            }

            setCsvData([...tempList]) ;

            setLoading(false) ;
        };

        reader.readAsText(e.target.files[0]);
    }

    const handleAddCustomerINPUT = async () => {
        setLoading(true) ;
    
        let temp = customers.filter(customer => customer.email === email) ;

        if(temp.length) {
            temp = {
                ...temp[0],
                full_name : fullName,
                phone_number : phoneNumber || temp[0].phone_number ,
                social_user_name : socialUserName || temp[0].social_user_name ,
                social_platform : platform === 'none' ? temp[0].social_platform : platform ,
                location : country === 'none' ? temp[0].location : country
            }
        } else {
            temp = {
                email : email,
                full_name : fullName,
                phone_number : phoneNumber || null,
                social_user_name : socialUserName || null ,
                social_platform : platform === 'none' ? null : platform,
                location : country === 'none' ? null : country,
                id : null
            }
        } ;

        await UpdateUserCustomer(getCookie('_SOLSTICE_AUTHUSER'), [
            ...customers.filter(customer => customer.email !== email),
            temp
        ]) ;

        await UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;

        handleClose() ;
        
        setLoading(false) ;
    }

    const handleAddCustomerCSV = async () => {
        setLoading(true) ;

        await UpdateUserCustomer(getCookie('_SOLSTICE_AUTHUSER'), csvData) ;

        await UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;

        handleClose() ;

        setLoading(false) ;
    }

    React.useEffect(() => {
        if(open) {
            setEmail(null);
            setFullName(null) ;
            setSocialUserName(null);
            setPhoneNumber('') ;
            setPlatform('none') ;
            setCountry('none') ;
        }
    }, [open]) ;

    React.useEffect(() => {
        UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
    }, []) ;

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
                        Add Customer 
                    </Box>
                    <CloseIcon onClick={handleClose} sx={{cursor : 'pointer'}} className={classes.closeButtonCss} />
                </DialogTitle>
                <Box className={classes.dividerDiv} />
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12}>
                            <Box className={classes.methodDiv}>
                                <Box onClick={() => setMethod('input')} 
                                    sx={{ borderBottom : method === 'input' && '1px solid ' + theme.palette.green.G200}}
                                >
                                    INPUT
                                </Box>
                                <Box onClick={() => setMethod('csv')} 
                                    sx={{borderBottom : method === 'csv' && '1px solid ' + theme.palette.green.G200}}
                                >
                                    CSV
                                </Box>
                            </Box>
                        </Grid>
                        {
                            method === 'input' && <>
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
                                                countryList.map( (country , index) => {
                                                    return (
                                                        <MenuItem value={country.label} key={index}>{country.label}</MenuItem>
                                                    )
                                                } )
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </>
                        }
                        {
                            method === 'csv' && <>
                                <Box className={classes.importDiv}>
                                    <InputLabel htmlFor="import-csv-file" className={classes.fileSelectDiv}>
                                    {
                                        <>
                                            <img src={CSVImage} />
                                        </> 
                                    }
                                    </InputLabel>
                                    <input
                                        type="file"
                                        id="import-csv-file"
                                        style={{ display: "none" }}
                                        accept={'text/csv'}
                                        onChange={handleImportCSV}
                                    />
                                </Box>
                                <Grid item xs={12}>
                                    <CSVList 
                                        csvList={csvData}
                                    />
                                </Grid>
                            </>
                        }
                    </Grid>
                </DialogContent>
                <Box className={classes.dividerDiv} />
                <DialogActions>
                    <Button variant={'contained'}
                        onClick={method === 'input' ? handleAddCustomerINPUT : handleAddCustomerCSV}
                        startIcon={ loading && <Loading type='tail_spin' width={30} height={30} fill='#e83e8c' />}
                        className={classes.buttonCss}
                        disabled={
                            ( (!validator.isEmail(email || '') || !fullName || (phoneNumber && !isValidPhoneNumber(phoneNumber))) && method === 'input') ||
                            ( !csvData.length && method === 'csv'  )
                            || loading
                        }
                    >
                        + Add Customer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
AddCustomerModal.propTypes = {
    UserAccountInfo : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    customers : state.profile.customers
})
const mapDispatchToProps = {
    UserAccountInfo
}
export default connect(mapStateToProps, mapDispatchToProps)(AddCustomerModal) ;