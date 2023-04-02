import {makeStyles} from '@mui/styles' ;

export const useStyles = makeStyles((theme) => ({
    root : {
        display : 'flex', flexDirection : 'column', alignItems :'center',

        position : 'relative',
    },
    welcomeDiv : {
        position : 'absolute',
        top : -40,
        left : 20,
        background : theme.palette.blue.main,
        textTransform : 'capitalize',
        padding : 5
    }
}))