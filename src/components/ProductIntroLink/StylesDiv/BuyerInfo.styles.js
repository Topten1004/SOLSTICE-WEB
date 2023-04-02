import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    root : {
        width : '90%',
        display : 'flex', alignItems : 'center',justifyContent : 'center',
        ['@media (max-width : 630px)'] : {
            width : '100%'
        }
    },
    labelDiv : {
        marginBottom : 5,
        "& a" : {
            color : 'white',
            "&:hover" : {
                color : theme.palette.blue.B100
            }
        }
    },
    infoDiv : {
        display : 'flex', flexDirection : 'column', gap : 10, alignItems : 'center',justifyContent : 'center',
        width : '80%',
        ['@media (max-width : 410px)'] : {
            width : '100%'
        }
    },
    ctrlGroup : {
        width : '100%',
        marginBottom : 10,
    },
    buttonCss1 : {
        height : '40px !important',
        width : 160,
         
        backgroundImage: 'linear-gradient(to right, #4776E6 0%, #8E54E9  51%, #4776E6  100%)',
        textAlign: 'center',
        textTransform: 'capitalize !important',
        transition: '0.5s !important',
        backgroundSize: '200% auto !important',
        color: 'white !important',          
        borderRadius: '30px !important',
        padding : '10px 10px !important',
        fontSize : '15px !important', fontWeight : 'bold !important',
 
        "&:hover" : {
            backgroundPosition: 'right center',
            color: '#fff',
            textDecoration: 'none',
        }   
    },
    selectDiv : {
        "& .MuiList-root" : {
            backgroundColor : theme.palette.blue.main + ' !important',
            padding : '0px !important',
            overflow : 'hidden !important'
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
    iconCss : {
        width : 100, height : 100,
        ['@media (max-width : 420px)'] : {
            width : 80, height : 80
        },
        ['@media (max-width : 320px)'] : {
            width : 50, height : 50
        }
    },
    descriptionDiv : {
        fontSize : 15,
        textAlign : 'center',
        "& a" : {
            color : 'white',
            "&:hover" : {
                color : theme.palette.blue.B100
            }
        }
    },
}))