import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    root : {
        marginTop : 30,

        color : theme.palette.green.G200,
        "&:hover" : {
            cursor : 'pointer',
        },
        width : '100% !important',

        "& video" : {
            background : 'linear-gradient(135deg, #e52d65 0%, #629df6 53.09%, #3c1d9d 100%) !important'
        },
    },
    fileItemDiv : {
        border : '2px solid ' + theme.palette.green.G400,
        borderRadius : '10px',
        width : 270, maxHeight : 400,
        padding : 20,
        "&:hover" : {
            background : theme.palette.blue.B300
        }
    },
    fileNameDiv : {
        borderBottom : '1px solid ' + theme.palette.green.G400,
        paddingBottom : 10,
        textAlign : 'center',
        fontSize : '20px'
    },
    colDiv : {
        display : 'flex', justifyContent : 'center',
    },
    rowDiv : {
        display : 'flex',
        marginBottom : '30px'
    },
   
}))