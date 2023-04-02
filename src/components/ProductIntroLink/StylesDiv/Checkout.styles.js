import { makeStyles } from "@mui/styles";

// Montserrat
export const useStyles = makeStyles((theme) => ({
    root : {
        position : 'relative',

        color : theme.palette.green.G200,

        display : 'flex', alignItems : 'center', justifyContent : 'center',

        "& button" : {
            textTransform : 'capitalize !important',
            color : theme.palette.green.G200, fontSize : 20,
            minWidth : '150px !important',
            borderRadius : 25,
            border : 'none !important',
            height : 40,
            backgroundColor : theme.palette.blue.B300 + ' !important',
            cursor : 'pointer',

            display : 'flex', justifyContent : 'center', alignItems : 'center', gap : 10,
            minWidth : 150,
            fontSize : 15
        },
        "& button:disabled" : {
            color : 'gray',
            cursor : 'not-allowed !important'
        }
    },
})) ;