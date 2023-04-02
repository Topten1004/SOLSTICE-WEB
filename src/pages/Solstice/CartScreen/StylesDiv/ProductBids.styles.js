import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
    root : {
        minHeight : 500,
        "& .MuiFormControl-root" : {
            borderRadius : 5,    
            background : "rgba(51, 139, 239, 0.21) !important" ,
            paddingTop : 10, paddingBottom : 10,
            color : '#43D9AD',
            "& svg" :{
                color : 'white'
            },
        },
        '& .MuiOutlinedInput-root': {
            minWidth : '100px !important',
            '& fieldset': {
                border: 'none !important',
            },
            '&:hover fieldset': {
                border: 'none !important',
            },
            '&.Mui-focused fieldset': {
                border: 'none !important',
            },
        },
        "& .MuiInputBase-input" :{
            padding : 0,
            color : 'white !important',
        },
    },
    createButtonCss  : {
        borderTopRightRadius : '15px !important',
        borderBottomRightRadius : '15px !important',

        background : '#3772FF !important',
        textTransform : 'capitalize !important',
        width : 300,

        border : '2px solid #3772FF !important'
    },
    searchDiv : {
        color : theme.palette.green.G200,
        display : 'flex', justifyContent : 'center' , alignItems : 'center', gap : '20px',
        padding : 10, paddingLeft : 10, paddingRight : 10,
        marginBottom : 20,
        borderRadius : theme.border.borderRadius.tiny,
        width : 500 
    },
    calendarDiv : {
        color : theme.palette.green.G200,
        display : 'flex', justifyContent : 'center' , alignItems : 'center', gap : '20px',
        padding : 10, paddingLeft : 10, paddingRight : 10,
        marginBottom : 20,
        borderRadius : theme.border.borderRadius.tiny,
        width : 450 
    },
})) ;