import * as React from 'react' ;

import { connect } from 'react-redux';
import { InputAccountName } from '../../redux/actions/auth';
import { CheckAccountName } from '../../firebase/user_collection';
import { validateInputValue } from '../../utils/Helper';

import swal from 'sweetalert';
import CloseIcon from '@mui/icons-material/Close';

import TickImage from '../../assets/common/tick.png';
import CloseImage from '../../assets/Close.png';

import Loading from 'react-loading-components' ;

import  {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Autocomplete,
    Box,
    Button,
    TextField,
    InputAdornment,
    Paper
} from '@mui/material' ;

import { makeStyles,useTheme } from '@mui/styles' ;

const useStyles = makeStyles((theme) => ({
    root : {

    },
    paper : {
        backgroundColor : '#011627 !important',
        border : '1px solid ' + theme.palette.green.G400 + ' !important',
        borderRadius : '10px !important',

        "& .MuiDialogTitle-root" : {
            color : '#43D9AD',
            display : 'flex',
            alignItems: 'center',
            justifyContent : 'space-between'
        },
        "& .MuiFormControl-root" : {
            borderRadius : 5,
            color : '#43D9AD',
            "& svg" :{
                color : '#43D9AD'
            },

            marginBottom : 30
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: theme.palette.green.G400 +  ' !important',
            },
            '&:hover fieldset': {
                borderColor: theme.palette.green.G400 +  ' !important',
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.green.G400 +  ' !important',
            },
        },
        "& .MuiButtonBase-root.Mui-disabled": {
            WebkitTextFillColor: '#283646',
        },
        "& .MuiInputBase-input" :{
            color : '#43D9AD !important',
        },
        "& .MuiFormHelperText-root" : {
            background : '#011627 !important',
            marginTop : '10px !important',
            color : 'red'
        },
        "& .MuiChip-root" : {
            color : "#43D9AD !important",
            backgroundColor : '#4D5BCE'
        },
    },
    selectDiv : {
        background : theme.palette.blue.B100 + ' !important',
        color : "white !important",
        margin : '0px !important',
    },
    lineDiv : {
        borderBottom : '2px solid #1E2D3D',
    },
    descriptionDiv : {
        color : "#43D9AD"
    },
    labelDiv : {
        color : theme.palette.green.G200 + " !important",
        padding : 5
    },
    buttonCss : {
        color : theme.palette.green.G200 + ' !important',
        textTransform : 'capitalize !important',
        minWidth : '150px !important',
        fontSize: '15px !important',
        borderRadius : '20px !important',
        border : '1px solid ' + theme.palette.green.G400 + ' !important'
    }
})) ;

const AccountNameModal = (props) => {

    const classes = useStyles() ;
    const theme = useTheme() ;

    const {
        open,
        handleClose,
        handleUpdatedName,
        accountName,
        handleChangeAccountName,
        detailAccountTypeList,
        handleDetailAccountTypeList,
        InputAccountName
    } = props ;

    const allTypeList = [
       "Creator",
       "Reseller",
       "Developer",
       "Miner(coming soon)",
       "IP Innovator"
    ];

    const [checkingName, setCheckingName] = React.useState(false) ;

    const handleNext = async () => {
        setCheckingName(true) ;
        
        if(await CheckAccountName(accountName)) {
            await InputAccountName(accountName, detailAccountTypeList) ;
        } else {
            setCheckingName(false) ;
            
            return swal({
                title : 'Warning',
                text : "Duplicate Account Name",
                buttons : false,
                timer : 3000,
                icon : 'warning'
            }) ;
        }

        setCheckingName(false) ;
        handleUpdatedName(true);
        handleClose();
    }

    return (
        <Box className={classes.root}>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                classes ={{
                    paper : classes.paper
                }}
                hideBackdrop={true}
            >
                <DialogTitle>
                    Account Information
                    {
                        !checkingName && <CloseIcon onClick={handleClose} sx={{cursor : 'pointer'}} />
                    }
                </DialogTitle>
                <Box className={classes.lineDiv}/>
                <DialogContent>
                    <Box className={classes.labelDiv}>Account Name</Box>
                    <TextField
                        placeholder='Name'
                        focused
                        size='medium'
                        fullWidth
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <Box component={'img'} src={accountName !== '' ? TickImage : CloseImage} sx={{width : '16px', height : '12px'}}/>
                            </InputAdornment>,
                        }}

                        helperText={(accountName !== null && accountName !== '' && !validateInputValue(accountName)) ? "Please, Dont't input any symbol." : null}
                        value={accountName}
                        onChange={handleChangeAccountName}
                    />
                    <Box className={classes.labelDiv}>Account Type</Box>
                    <Autocomplete
                        multiple
                        id="tags-standard"
                        options={allTypeList}
                        getOptionLabel={(option) => option}
                        value={detailAccountTypeList}
                        onChange={(e, value) => handleDetailAccountTypeList(value)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Type"
                                
                            />
                        )}
                        PaperComponent={({ children }) => (
                            <Paper className={classes.selectDiv}>{children}</Paper>
                        )}
                    />
                </DialogContent>
                <Box className={classes.lineDiv}/>
                <DialogActions>
                    <Button variant={'outlined'} className={classes.buttonCss} onClick={handleNext} disabled={ checkingName || !detailAccountTypeList.length || accountName===''}
                        startIcon={checkingName && <Loading type='tail_spin' width={30} height={30} fill={theme.palette.green.G200} />}
                    >
                        {
                            checkingName ? "...Checking Name" : "Next"
                        }
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

const mapStateToProps = state => ({
})
const mapDispatchToProps = {
    InputAccountName
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountNameModal) ;