import { makeStyles } from '@mui/styles' ;

export const useStyles = makeStyles((theme) => ({
    creatorInfoDiv : {
        border : '1px solid ' + theme.palette.green.G300,
        maxWidth : 550,
        borderRadius : 10,
        padding : 10,

        display : 'flex', flexDirection : 'column', justifyContent : 'space-between',

        height : '100%',

        minHeight : 260,

        width : '90%',
        ['@media (max-width : 745px)'] : {
            width : '95%'
        },
        ['@media (max-width : 650px)'] : {
            width : '95%'
        }
    },
    avatarDiv : {
        display : 'flex', justifyContent : 'center'
    },
    avatarCss : {
        width : 100, height : 100, 
        borderRadius : '50%',
        border : '5px solid ' + theme.palette.green.G400,
        padding : 5
    },
    accountNameDiv : {
        display : 'flex' , justifyContent : 'center',
        fontSize : 20, 
        textTransform : 'capitalize'
    },
    emailDiv : {
        display : 'flex' , justifyContent : 'center',
        fontSize : 18, 
    },
    analysisDiv : {
        marginTop : 30,
        "& .MuiGrid-item" : {
            display : 'flex', justifyContent : 'center', alignItems : 'center'
        }
    },
    cardDiv : {
        display  :'flex', justifyContent : 'center', flexDirection : 'column', alignItems : 'center',

        border : '1px solid ' + theme.palette.blue.B100,
        width : 180, height : 60,
        borderRadius : 10,

        padding : 20,
    },
    labelDiv : {
        fontSize : 15,
    },
    valueDiv : {
        fontSize: 15, fontWeight : 'bold'
    }
}))