import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    root : {
        backgroundColor : theme.palette.blue.main,
        position : 'relative',
        width : '100vw',
        minHeight : '100vh',

        paddingTop : 30,
        paddingBottom : 30,

        color : theme.palette.green.G200,

        display : 'flex', alignItems : 'center', justifyContent : 'center',
    },
    loadingDiv : {
        width : '100%' , minHeight : '100vh',
        display : 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column', gap : '10px',
        background : theme.palette.blue.main
    },
    greenBlur : {
        position : 'absolute', left: 45,  top: 170,
        width: 200,  height: 150,
        background: '#43D9AD',
        opacity: '0.35',
        filter: 'blur(55px)',
        transform: 'rotate(-140.38deg)'
    },
    blueBlur : {
        position : 'absolute', right: 45,  top: 450,
        width: 200, height: 150,
        background: '#4D5BCE',
        opacity: '0.35',
        filter: 'blur(55px)',
        transform: 'rotate(-140.38deg)'
    },
    successDiv : {
        padding : 30,
        borderRadius : 10,
        border  :'1px solid ' + theme.palette.blue.B100,

        display : 'flex', alignItems : 'center' , justifyContent : 'center', flexDirection : 'column', gap : 15,

        width : 450,
        ['@media (max-width : 460px)'] : {
            width : 400,
            padding : 20
        },
        ['@media (max-width : 410px)'] : {
            width : 350,
            padding : 10
        },
        ['@media (max-width : 360px)'] : {
            width : 330,
        },
        ['@media (max-width : 345px)'] : {
            width : 300,
        },
        ['@media (max-width : 310px)'] : {
            width : 270,
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
    titleDiv : {
        fontSize : 25,
        textAlign : 'center',
        ['@media (max-width : 460px)'] : {
            fontSize: 20
        },
        ['@media (max-width : 360px)'] : {
            fontSize : 17
        },
        ['@media (max-width : 320px)'] : {
            fontSize : 15
        }
    },
    textDiv : {
        fontSize : 20,
        textAlign : 'center',
        ['@media (max-width : 460px)'] : {
            fontSize: 17
        },
        ['@media (max-width : 360px)'] : {
            fontSize : 15
        },
        ['@media (max-width : 320px)'] : {
            fontSize : 13
        }
    },
    confirmButtonCss : {
        height : 50,
        width : 250,
         
        marginTop : '30px !important',

        backgroundImage: 'linear-gradient(to right, #FDFC47 0%, #24FE41  51%, #FDFC47  100%)',
        textAlign: 'center',
        textTransform: 'capitalize !important',
        transition: '0.5s !important',
        backgroundSize: '200% auto !important',
        color: '#40581f !important',          
        boxShadow: '0 0 20px #eee !important',
        borderRadius: '30px !important',
        fontSize : '17px !important', fontWeight : 'bold !important',
 
        "&:hover" : {
            backgroundPosition: 'right center',
            color: '#fff',
            textDecoration: 'none',
        },

        ['@media (max-width : 460px)'] : {
            width : 200, height : 45
        },
        ['@media (max-width : 370px)'] : {
            width : 180, height : 40
        },
        ['@media (max-width : 320px)'] : {
            width : 150, height : 35
        }
    }
}))