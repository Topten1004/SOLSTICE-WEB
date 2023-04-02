import {makeStyles} from '@mui/styles' ;

export const useStyles = makeStyles((theme) => ({
    root : {
        display : 'flex', flexDirection : 'column', alignItems :'center', justifyContent : 'center'
    },
    creatorInfoDiv : {
        border : '1px solid ' + theme.palette.green.G300,
        width : 550,
        borderRadius : 10,
        padding : 10,
        ['@media (max-width : 630px)'] : {
            width : 'auto'
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
        ['@media (max-width : 375px)'] : {
            flexDirection : 'row !important',
            fontSize : 15
        },
        ['@media (max-width : 325px)'] : {
            flexDirection : 'row !important',
            fontSize : 13
        },
    },
    threeCardDiv : {
        display :'flex',flexDirection : 'column !important', gap : '10px', alignItems : 'center', justifyContent : 'center',

        ['@media (max-width : 1164px)'] : {
            flexDirection : 'row !important',
            marginTop : '15px !important'
        },
        ['@media (max-width : 560px)'] : {
            flexWrap : 'wrap'
        },
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

        padding : 10,

        ['@media (max-width : 630px)'] : {
            width : 150, height : 50,
            padding : 5,
            borderRadius : 5
        }
    },
    labelDiv : {
        fontSize : 15,
    },
    valueDiv : {
        fontSize: 15, fontWeight : 'bold'
    }
}))