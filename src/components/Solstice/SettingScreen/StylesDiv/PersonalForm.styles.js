import { makeStyles } from '@mui/styles' ;

export const useStyles = makeStyles((theme) => ({
    root : {
        "& .Mui-disabled": {
            color : '#484C56 !important',
            backgroundColor: 'rgb(28, 37, 49) !important',
        },

        borderRadius : 10,
        color : theme.palette.green.G200,
        maxWidth : 300,
        paddingTop : 30,
        paddingBottom : 30
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
        top: 450,

        background: '#4D5BCE',
        opacity: '0.35',
        filter: 'blur(55px)',
        transform: 'rotate(-140.38deg)'
    },
    formDiv : {
        display : 'flex !important', justifyContent : 'center', alignItems : 'center',

        maxWidth : 250,
        
        "& .MuiInputAdornment-root" : {
            "& p" :{
                color : 'white !important'
            } 
        },
        "& .MuiInputLabel-root" : {
            color : "white !important",
        },
        "& .MuiFormControl-root" : {
            borderRadius : 5,
            color : 'white',
            "& svg" :{
                color : 'white'
            }
        },
        '& .MuiOutlinedInput-root': {
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
        "& .MuiFormHelperText-root" : {
            background : '#010C15 !important',
            color : 'red !important',
            marginTop : '10px !important'
        },
        "& .MuiInputBase-input" :{
            color : theme.palette.green.G200 + ' !important',
        },
        "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: 'red',
        },
        "& .MuiFormHelperText-root" : {
            marginTop : '10px !important',
            color : 'red'
        }
    },
    buttonCss : {
        background : '#3772FF !important',
        textTransform : 'capitalize !important',
        width : '170px !important',
        borderRadius : '25px !important',
        height : '35px',
        fontSize : '17px !important',
    },
    flagDiv : {
        "& input" : {
            '&:focus': {
                border: "1px solid " + theme.palette.green.G400 + ' !important',
            },
            '&:hover': {
                border: "1px solid " + theme.palette.green.G400 + ' !important',
            },

            outline : 'none !important',
            padding : '10px !important',
            display : 'flex !important', alignItems : 'center !important',
            paddingLeft : '10px !important',
            color : '#43D9AD !important',
            background : theme.palette.blue.main,
            border: "1px solid " + theme.palette.green.G400 + ' !important',
            height : 48,
            borderRadius : 5
        },
    }
})) ;