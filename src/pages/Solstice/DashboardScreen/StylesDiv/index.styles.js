import {makeStyles} from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
    root : {
        backgroundColor : "#011627",
        minHeight : '100vh',
        position : 'relative',

        color : theme.palette.green.G200,
        paddingBottom : 20
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

    brandDiv : {
        backgroundImage: 'linear-gradient(120deg, #2c093e 0%, #ea4c89 100%)',
        
        height : 180,
       
        borderRadius : 20,
        padding : 30,
        display : 'flex', justifyContent : 'space-between', gap : 10, alignItems : 'center',

        ['@media (max-width : 680px)'] : {
            flexDirection : 'column',
            alignItems : 'flex-start',
            padding : 20,
            height : 220,
            gap : 5
        }
    },
    profilePhoto : {
        width : 100, height : 100,
        borderRadius : '50%',
        
        ['@media (max-width : 1300px)'] : {
            width : 90, height : 90,
        },
        ['@media (max-width : 750px)'] : {
            width : 80, height : 80,
        }
    },
    brandLetterDiv : {
        color : 'white !important',

        fontWeight : 'bold',
        fontSize : 35,

        ['@media (max-width : 1310px)'] : {
            fontSize : 30
        },
        ['@media (max-width : 1210px)'] : {
            fontSize : 25
        },
        // ['@media (max-width : 1210px)'] : {
        //     fontSize : 35
        // },
        ['@media (max-width : 855px)'] : {
            fontSize : 30
        },
        ['@media (max-width : 795px)'] : {
            fontSize : 25
        },
        ['@media (max-width : 795px)'] : {
            fontSize : 20
        },
    },
    saleButtonCss : {
        backgroundImage: 'linear-gradient(to right, #f46b45 0%, #eea849  51%, #f46b45  100%)',
        marginTop : '20px !important',  marginLeft : '20px !important',
        textAlign: 'center',
        textTransform: 'capitalize !important',
        transition: '0.5s !important',
        backgroundSize: '200% auto !important',
        color: 'white !important',          
        boxShadow: '0 0 15px #eee !important',
        borderRadius: '30px !important',
        height : 50,
        fontSize : '17px !important', fontWeight : 'bold !important',
 
        "&:hover" : {
            backgroundPosition: 'right center',
            color: '#fff',
            textDecoration: 'none',
        },

        ['@media (max-width : 1310px)'] : {
            height : 40,
        },
        ['@media (max-width : 1210px)'] : {
            height : 35,
        },
        ['@media (max-width : 855px)'] : {
            height : 35,
        },
    },
    cardGroupDiv : {
        marginTop : 30,
        padding : 10,
        display : 'flex', justifyContent : 'space-around', alignItems : 'center',

        flexWrap : 'wrap', gap : 10,

        color : 'white'
    },
    cardDiv : {
        width : 250, height : 150,
        borderRadius : 10,
        padding : 20
    },
    numberDiv : {
        fontSize : 25,
        fontWeight : 'bold',
    },
    cardLabelDiv : {
        fontSize: 20
    },
    cardExplainDiv : {
        paddingTop : 10,
        color : '#9D9FB1',
        fontSize : 12,
        textAlign : 'center'
    },
    activeLinkDiv : {
        background : 'white',
        minHeight: 300,
        width  : '100%',

        borderRadius : 20,

        padding : 20
    },
    listTitleDiv : {
        display : 'flex', justifyContent : 'space-between',
        marginRight : 30,
        marginLeft : 30,
        paddingTop : 20,
        paddingBottom : 10,

        ['@media (max-width : 320px)'] : {
            flexDirection : 'column',
        },
    },
    titleDiv : {
        fontSize : 30,
        fontWeight : 'bold',
        
        ['@media (max-width : 725px)'] : {
            fontSize : 25,
        },
        ['@media (max-width : 650px)'] : {
            fontSize : 20,
        },
        ['@media (max-width : 615px)'] : {
            fontSize : 15,
        },
        ['@media (max-width : 490px)'] : {
            fontSize : 25,
        },
        ['@media (max-width : 415px)'] : {
            fontSize : 20,
        },
        ['@media (max-width : 360px)'] : {
            fontSize : 15,
        },
    },
    seeMoreDiv : {
        display : 'flex', alignItems : 'center'
    },
    formDiv : {
        display : 'flex', alignItems :'center', justifyContent : 'space-between', flexWrap : 'wrap' , gap : 20,

        paddingLeft : 40,
        paddingRight :40,
        marginBottom : 15,

        "& .MuiInputAdornment-root" : {
            "& p" :{
                color : '#43D9AD !important'
            } ,
            "& svg" : {
                color : '#43D9AD !important',
                "&:hover" : {
                    color : 'white !important'
                }
            }
        },
        "& .MuiInputLabel-root" : {
            color : "#43D9AD !important",
        },

        "& .MuiFormControl-root" : {
            borderRadius : 5,
            padding : '0px !important',
            color : '#43D9AD',
        },

        '& .MuiOutlinedInput-root': {
            fontSize : '15px !important',
            '& fieldset': {
                borderColor: theme.palette.green.G400 + ' !important',
            },
            '&:hover fieldset': {
                borderColor: theme.palette.green.G400 + ' !important',
            },
            '&.Mui-focused fieldset': {
                border : '1px solid ' + theme.palette.green.G400 + ' !important'
            },
            "& svg" : {
                color : theme.palette.green.G200
            }
        },

        "& .MuiInputBase-input" :{
            display : 'flex !important', alignItems : 'center !important',
            color : '#43D9AD !important',
        },
        "& .MuiButtonBase-root.Mui-disabled": {
            WebkitTextFillColor: 'gray',
        },
        "& .MuiFormHelperText-root" : {
            marginTop : '10px !important',
            color : '#ff2f00',
            fontSize : '18px !important'
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
            fontSize : 15,
        },
       "& .MuiBackdrop-root" : {
           background : 'transparent !important'
       }
    },
}));