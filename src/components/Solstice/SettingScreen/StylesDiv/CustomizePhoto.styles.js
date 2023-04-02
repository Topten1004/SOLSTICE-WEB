import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    root : {
        color : theme.palette.green.G200,
        fontSize : 20
    },
    uploadDiv : {
        maxWidth : 400,
        border : '1px solid ' +theme.palette.green.G400 ,
        padding : 10,
        display : 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column', gap : 10,
        borderRadius : 10,
    },
    upload : {
        "& svg" : {
            color : theme.palette.green.G200
        },
        color : theme.palette.green.G200,

        display : 'flex', flexDirection : 'column', alignItems : 'center', justifyContent :"center", gap : 5,

        cursor : 'pointer'
    },
    buttonGroup : {
        display : 'flex', alignItems : 'center', justifyContent : 'center', gap : 10 , flexWrap : 'wrap'
    },
    buttonCss : {
        textTransform : 'capitalize !important',
        color : 'white',
        borderRadius : 20,
        width : 200,
        paddingLeft : 20, paddingRight : 20,
        background : '#3772FF !important',
        "& svg" : {
            fontSize : '25px !important'
        }
    }
}))