import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
    root : {
        backgroundColor : "#011627",
        minHeight : '100vh',
        position : 'relative',
    },
    greenBlur : {
        position : 'absolute',
        width: 200,
        height: 150,
        left: 45,
        top: 170,

        background: '#43D9AD',
        opacity: '0.35',
        filter: 'blur(55px)',
        transform: 'rotate(-140.38deg)'
    },
    blueBlur : {
        position : 'absolute',
        width: 200,
        height: 150,
        right: 45,
        top: 400,

        background: '#4D5BCE',
        opacity: '0.35',
        filter: 'blur(55px)',
        transform: 'rotate(-140.38deg)'
    },
    pageTitleDiv : {
        paddingLeft : 30,
        paddingTop : 30,
        paddingBottom : 10,
        color : theme.palette.green.G200, fontSize : 35, fontWeight : 'bold',

        borderBottom : '1px solid gray' 
    },
    searchDiv : {
        color : theme.palette.green.G200,
        display : 'flex', justifyContent : 'center' , alignItems : 'center', gap : '20px',
        background : theme.palette.blue.B200,
        padding : 10, paddingLeft : 10, paddingRight : 10,
        marginBottom : 20,
        marginLeft : 30, marginTop : 20,
        borderRadius : theme.border.borderRadius.tiny,
        width : 400 ,
        
        "& svg" : {
            color : theme.palette.green.G200 + " !important"
        },

        ['@media (max-width: 800px)'] : {
            flexDirection : 'column !important',
            alignItems : 'flex-start',
            width : 'calc(100% - 20px)',
            marginLeft : 10
        },

        "& .MuiFormControl-root" : {
            borderRadius : 5,
            color : '#43D9AD',
            "& svg" :{
                color : 'white'
            },
        },
        "& .MuiInputBase-input" :{
            color : '#43D9AD !important',
        },

        '& .MuiOutlinedInput-root': {
            minWidth : '100px !important',
            '& fieldset': {
                border: "1px solid " + theme.palette.green.G400 + ' !important',
            },
            '&:hover fieldset': {
                border: "1px solid " + theme.palette.green.G400 + ' !important',
            },
            '&.Mui-focused fieldset': {
                border: "1px solid " + theme.palette.green.G400 + ' !important',
            },
        },

        "& .MuiInputAdornment-root" : {
            color : theme.palette.green.G200
        },
    },
    stripeInfoDiv : {
        color : theme.palette.green.G200, fontSize : 18,
        display : 'flex', justifyContent : 'center' , alignItems : 'center', gap : '20px',
        background : theme.palette.blue.B200,
        padding : 20,
        marginBottom : 20,
        marginLeft : 30, marginTop : 20,
        borderRadius : theme.border.borderRadius.tiny,
        width : 500 ,

        ['@media (max-width: 800px)'] : {
            flexDirection : 'column !important',
            alignItems : 'flex-start',
            width : 'calc(100% - 20px)',
            marginLeft : 10
        },

        "& svg" : {
            color : theme.palette.green.G200 + " !important"
        },
        
        "& .MuiFormControl-root" : {
            borderRadius : 5,
            color : '#43D9AD',
            "& svg" :{
                color : 'white'
            },
        },
        "& .MuiInputBase-input" :{
            color : '#43D9AD !important',
        },

        '& .MuiOutlinedInput-root': {
            minWidth : '100px !important',
            '& fieldset': {
                border: "1px solid " + theme.palette.green.G400 + ' !important',
            },
            '&:hover fieldset': {
                border: "1px solid " + theme.palette.green.G400 + ' !important',
            },
            '&.Mui-focused fieldset': {
                border : "1px solid " + theme.palette.green.G400 + ' !important'
            },
        },
        "& .MuiInputAdornment-root" : {
            color : theme.palette.green.G200
        },

        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
        {
            display: 'none',
        },

        "& .MuiGrid-item" : {
            display : 'flex',
            alignItems : 'center',
            marginBottom : 10
        }
    },
    buttonCss : {
        height : 35,
        width : 120,
       
        marginTop : '10px !important',
        backgroundImage: 'linear-gradient(to right, #FDFC47 0%, #24FE41  51%, #FDFC47  100%)',
        textAlign: 'center',
        textTransform: 'capitalize !important',
        transition: '0.5s !important',
        backgroundSize: '200% auto !important',
        color: '#40581f !important',          
        boxShadow: '0 0 20px #eee !important',
        borderRadius: '30px !important',
        fontSize : '15px !important', fontWeight : 'bold !important',
 
        "&:hover" : {
            backgroundPosition: 'right center',
            color: '#fff',
            textDecoration: 'none',
        },

        '&:disabled': {
            cursor: 'not-allowed !important',
            pointerEvents: 'all !important',
            color : '#90b9c3 !important'
        }
    },
    accountStatusDiv : {
        paddingLeft : 10
    }
}));