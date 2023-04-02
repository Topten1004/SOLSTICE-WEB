
import { makeStyles } from '@mui/styles' ;

export const useStyles = makeStyles((theme) => ({
    root : {
        position : 'relative',
        backgroundColor : theme.palette.blue.main + ' !important',
        color : theme.palette.green.G200 + " !important",
        minHeight : '100vh',

        display : 'flex', alignItems : 'center', justifyContent : 'center',

        paddingTop : 50,
        paddingBottom : 50,

        overflowY : 'hidden',
        
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
            fontSize : '18px !important',
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
        "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: 'gray',
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
    selectDiv : {
        "& .MuiList-root" : {
            backgroundColor : theme.palette.blue.main + ' !important',
            padding : '0px !important',
        },
        "& .MuiMenuItem-root" : {
            borderBottom : '1px solid '+theme.palette.green.G400+' !important',
            "&:last-child" : {
                borderBottom : 'none !important',
            },
            background : theme.palette.blue.B300 + " !important",
            color : theme.palette.green.G200 + " !important",
            fontSize : 20,
            borderRadius : '5px !important',
        },
       "& .MuiBackdrop-root" : {
           background : 'transparent !important'
       }
    },
    productInfoDiv : {
        border : '1px solid ' + theme.palette.blue.B100,
        padding : 20,
        borderRadius : 20,
        width : '80%',
        ['@media (max-width : 745px)'] : {
            width : '90%'
        },
        ['@media (max-width : 650px)'] : {
            width : '95%'
        }
    },
    greenBlur : {
        width: 200, height: 150,
        position : 'absolute', left: 45, top: 170,
        background: '#43D9AD',
        opacity: '0.35',
        filter: 'blur(55px)',
        transform: 'rotate(-140.38deg)',
        zIndex : 2
    },
    blueBlur : {
        width: 200, height: 150,
        position : 'absolute', right: 45, top: 400,
        background: '#4D5BCE',
        opacity: '0.35',
        filter: 'blur(55px)',
        transform: 'rotate(-140.38deg)'
    },
})) ;