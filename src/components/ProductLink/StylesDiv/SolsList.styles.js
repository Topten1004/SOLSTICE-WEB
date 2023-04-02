import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    root : {
        marginTop : 30,

        color : theme.palette.green.G200,
        "&:hover" : {
            cursor : 'pointer',
        },
        width : '100% !important',

        display : 'flex', justifyContent : 'space-around', gap : '10px', flexWrap : 'wrap',

        "& video" : {
            background : 'linear-gradient(135deg, #e52d65 0%, #629df6 53.09%, #3c1d9d 100%) !important'
        }
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
    fullIconDiv : {
        position : 'absolute !important',
        zIndex : 5555,

        right : 10, bottom : 10,

        borderRadius : '50%',   
        border  : '1px solid ' + theme.palette.green.G200,

        maxWidth : '30px !important', height : 30,
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
        },
        "& .MuiBttonBase-root" : {
            minWidth : '30px !important'
        }
    },
}))