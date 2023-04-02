import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    root : {
        margin : 20,
        padding : 15,
        ['@media (max-width : 600px)'] : {
            margin : 0
        },
        ['@media (max-width : 320px)'] : {
            padding : 0
        }
    },
    labelDiv : {
        display : 'flex', justifyContent: 'space-between', alignItems : 'center',

        marginBottom : 15,
    },
    titleDiv : {
        paddingLeft : 20,
        fontSize : 25,
        fontWeight : 'bold'
    },
    viewAllDiv : {
        display : 'flex', justifyContent : 'center', alignItems : 'center',
        gap : 10,
        cursor : 'pointer',

        "&:hover" : {
            color : 'white'
        }
    },
    emptyDiv : {
        marginLeft : 5,
        marginRight : 5,

        paddingTop : 10,
        paddingBottom : 10,

        borderRadius : 10,
        background : '#338bef80',
        color : theme.palette.green.G100, textAlign : 'center'
    },
    creatorDiv : {
        marginLeft : 5,
        marginRight : 5,
        marginBottom : 10,

        padding : 10,

        borderRadius : 10,
        background : '#338bef80',

        display : 'flex', alignItems : 'center', justifyContent : 'space-between', flexWrap : 'wrap'
    },
    thDiv : {
        fontSize : 16, fontWeight : 'bold',  color : 'white'
    },
    mainInfoDiv : {
        display : 'flex', alignItems : 'center', gap : 10
    },
    countDiv : {
        display : 'flex', flexDirection : 'column', alignItems : 'center', justifyContent : 'center',
        fontSize : 15
    }
}))