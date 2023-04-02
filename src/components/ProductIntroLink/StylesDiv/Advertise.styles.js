
import { makeStyles } from '@mui/styles' ;

export const useStyles = makeStyles((theme) => ({
    root : {
        position : 'relative',
        minHeight : '100vh',
        backgroundColor : theme.palette.blue.main + ' !important',
        color : theme.palette.green.G200 + " !important",

        display : 'flex', alignItems : 'center', justifyContent : 'center', flexDirection : 'column',
        
        paddingTop : 50, paddingBottom : 50,

        "& .MuiButtonBase-root" : {
            textTransform : 'capitalize !important',
            minWidth : '150px !important',
            borderRadius : 25,
            backgroundColor : theme.palette.blue.B300 + ' !important',
            '&:disabled': {
                cursor: 'not-allowed !important',
                pointerEvents: 'all !important',
                color : '#90b9c3 !important'
            }
        },

        "& .MuiInputAdornment-root" : {
            "& p" :{
                color : '#43D9AD !important'
            } 
        },
        "& .MuiInputLabel-root" : {
            color : "#43D9AD !important",
        },

        "& .MuiFormControl-root" : {
            borderRadius : 5,
            padding : '0px !important',
            color : '#43D9AD',
            "& svg" :{
                color : 'white'
            }
        },

        '& .MuiOutlinedInput-root': {
            fontSize : '16px !important',
            '& fieldset': {
                borderColor: theme.palette.green.G400 + ' !important',
            },
            '&:hover fieldset': {
                borderColor: theme.palette.green.G400 + ' !important',
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.green.G400 + ' !important'
            },
        },

        "& .MuiInputBase-input" :{
            padding : '10px !important',
            display : 'flex !important', alignItems : 'center !important',
            paddingLeft : '10px !important',
            color : '#43D9AD !important',
        },
        "& .MuiFormHelperText-root" : {
            fontSize: 15,
            color : '#ff2929 !important',
            marginTop : '5px !important'
        },
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
        {
            display: 'none',
        },
    },
    paymentDiv : {
        border : '1px solid ' + theme.palette.blue.B100,
        padding : 20,
        borderRadius : 20,
        maxWidth : 1160,
        ['@media (max-width : 1195px)'] : {
            maxWidth : 650
        },
        ['@media (max-width : 1195px)'] : {
            width : '95%'
        },
        ['@media (max-width : 325px)'] : {
            padding : 10,
            borderRadius : 10
        },
    },
    solsListDiv : {
        position : 'relative',
        marginTop: 20,
        border : '1px solid ' + theme.palette.green.G400,
        padding : 20,
        borderRadius : 20,

        width : 1160,
        ['@media (max-width : 1195px)'] : {
            width : 650
        },
        ['@media (max-width : 1195px)'] : {
            width : '95%'
        },
        ['@media (max-width : 325px)'] : {
            padding : 10,
            borderRadius : 10
        },
    },
    greenBlur : {
        width: 200, height: 150,
        position : 'absolute', left: 45, top: 170,
        background: '#43D9AD',
        opacity: '0.35',
        filter: 'blur(55px)',
        transform: 'rotate(-140.38deg)'
    },
    blueBlur : {
        width: 200, height: 150,
        position : 'absolute', right: 45, top: 400,
        background: '#4D5BCE',
        opacity: '0.35',
        filter: 'blur(55px)',
        transform: 'rotate(-140.38deg)'
    },
    cardPaymentDiv : {
        width : '90%',
        display : 'flex', alignItems : 'center',justifyContent : 'center',
        ['@media (max-width : 630px)'] : {
            width : '100%'
        }
    },
    welcomeDiv : {
        position : 'absolute',
        top : -20,
        left : 20,
        background : theme.palette.blue.main,
        textTransform : 'capitalize',
        padding : 5
    }
})) ;