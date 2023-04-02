import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
    root : {
        backgroundColor : "#011627",
        minHeight : '100vh',
        position : 'relative',
        color : theme.palette.green.G200, fontFamily : "Montserrat", fontSize : 20,
        "& .swiper" : {
            width : '270px !important', height : '400px !important',
        },
        "& .swiper-slide" : {
            background : 'rgba(51, 139, 239, 0.21) !important',
            borderRadius : '10px',
            width : '270px !important', height : '400px !important',
            position : 'relative',
            background : 'linear-gradient(135deg, #e52d65 0%, #629df6 53.09%, #3c1d9d 100%) !important',
            "& video" : {
                background : 'linear-gradient(135deg, #e52d65 0%, #629df6 53.09%, #3c1d9d 100%) !important',
                borderRadius : '10px',
            }
        },

        "& a" : {
            color : theme.palette.green.G200,
            "&:hover" : {
                color : 'white'
            }
        }
    },
    fullIconDiv : {
        position : 'absolute !important',
        zIndex : 50000,

        right : 10, bottom : 10,

        borderRadius : '50%',   
        border  : '1px solid ' + theme.palette.green.G200,

        width : 30, height : 30,
        display : 'flex', alignItems : 'center', justifyContent : 'center',
        
        "&:hover" : {
            background : "#2f626ab0",
            boxShadow : '0px 0px 15px #eee'
        },

        cursor : 'pointer',
        
        transition : '0.2s',

        "& svg" : {
            color : theme.palette.green.G200,
            fontSize : 30
        }
    },
    pageTitleDiv : {
        color :'white', fontSize : 30, fontWeight : 'bold',
        display : 'flex', justifyContent : 'flex-start', alignItems : 'flex-end',
        padding : 30
    },
    productCountDiv : {
        backgroundColor : '#253341',
        borderRadius : 15,
        width : 230,
        padding : 15,
        marginLeft : 30,
    },
    checkOutDiv : {
        border  :'1px solid ' + theme.palette.green.G200,
        borderRadius : 10,
        marginLeft : 30,
        padding : 30,
        ['@media (max-width : 1140px)'] : {
            margin : 20
        },
        ['@media (max-width : 365px)'] : {
            margin : 10,
            borderRadius : 10,
            padding : 15
        },
    },
    tabDiv : {
        fontSize : 20, borderBottom : '1px solid', mb : '20px',
        ['@media (max-width : 610px)'] : {
            fontSize : 18
        },
        ['@media (max-width : 545px)'] : {
            fontSize : 20
        },
        ['@media (max-width : 365px)'] : {
            fontSize : 18
        }
    },
    valDiv : {
        ['@media (max-width : 765px)'] : {
            paddingLeft : '30px !important'
        }
    },
    iconButtonDiv : {
    },
    productInfoDiv : {
        margin : 10,
        border : '1px solid red',

    },
    greenBlur : {
        background: '#43D9AD',
        width: 200, height: 150,
        position : 'absolute', left: 45, top: 170,
        opacity: '0.35',
        filter: 'blur(55px)',
        transform: 'rotate(-140.38deg)'
    },
    blueBlur : {
        position : 'absolute', width: 200,  height: 150,
        right: 45, top: 400,
        background: '#4D5BCE',
        opacity: '0.35',
        filter: 'blur(55px)',
        transform: 'rotate(-140.38deg)'
    },
    buttonGroup : {
        display : 'flex',
        justifyContent : 'flex-end'  ,

        width : '100%',

        marginTop : 60,
    },
   
    loadingDiv : {
        position : 'fixed', left : 0 , top : 0 , zIndex: 2000,
        width : '100vw' , height : '100vh',

        display : 'flex' , alignItems : 'center', justifyContent : 'center' ,

        cursor : 'wait !important'
    }
}))
