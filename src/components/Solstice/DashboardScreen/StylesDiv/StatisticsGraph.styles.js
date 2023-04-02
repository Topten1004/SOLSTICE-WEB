import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    root : {
        margin : 20,
        padding : 15,
        ['@media (max-width : 1110px)'] : {
            margin : 10
        },
        ['@media (max-width : 370px)'] : {
            margin : 0
        },
        ['@media (max-width : 325px)'] : {
            padding : 5
        }
    },
    titleDiv : {
        paddingLeft : 20,
        fontSize : 25,
        fontWeight : 'bold',
        ['@media (max-width : 1110px)'] : {
            paddingLeft : 0
        }
    },
    chartDiv : {
        border : '1px solid' +  theme.palette.green.G400,
        borderRadius : 10,
        padding: 10
    }
}))