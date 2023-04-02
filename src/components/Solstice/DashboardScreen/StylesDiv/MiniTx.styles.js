import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    root : {
        margin : 20,
        padding : 15,

        ['@media (max-width : 620px)'] : {
            margin : 10
        },
        ['@media (max-width : 575px)'] : {
            margin : 5
        },
        ['@media (max-width : 325px)'] : {
            padding : 5
        }
    },
    labelDiv : {
        display : 'flex', justifyContent: 'space-between', alignItems : 'center',

        marginBottom : 15,

        ['@media (max-width : 560px)'] : {
            flexDirection : 'column',
            alignItems : 'flex-start',
        },
        ['@media (max-width : 475px)'] : {
            flexDirection : 'row',
            justifyContent: 'space-between', alignItems : 'center',
        }
    },
    titleDiv : {
        paddingLeft : 20,
        fontSize : 25,
        fontWeight : 'bold',
        ['@media (max-width : 560px)'] : {
            paddingLeft : 0
        }
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
    txItemDiv : {
        marginLeft : 5,
        marginRight : 5,
        marginBottom : 10,
        
        padding : 10,

        borderRadius : 10,
        background : '#338bef80',

        display : 'flex', alignItems : 'center', justifyContent : 'space-between'
    },
    priceDiv : {
        fontSize: 18, fontWeight : 'bold',
        color : 'white',

        ['@media (max-width : 575px)'] : {
            fontSize : 15
        }
    }
}))