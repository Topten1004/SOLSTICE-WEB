import { makeStyles } from "@mui/styles";

// Montserrat
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

        "& button" : {
            textTransform : 'capitalize !important',
            color : theme.palette.green.G200, fontSize : 20,
            minWidth : '150px !important',
            borderRadius : 25,
            border : 'none !important',
            height : 45,
            backgroundColor : theme.palette.blue.B300 + ' !important',
            cursor : 'pointer',

            display : 'flex', justifyContent : 'center', alignItems : 'center', gap : 10,
            minWidth : 200
        },
        "& button:disabled" : {
            color : 'gray',
            cursor : 'not-allowed !important'
        }
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
    paymentDiv: {
        border : '1px solid ' + theme.palette.blue.B100 + " !important",
        width : '50%',
        borderRadius: 20,
        padding : 30,
        minHeight : 470
    },
    fullNameDiv : {
        fontSize :25
    },
    priceDiv : {
        fontSize : 30,
        fontWeight : 'bold'
    },
    productNameDiv : {
        marginTop : 20,
        fontSize : 20
    }
})) ;