import { makeStyles } from '@mui/styles' ;

export const useStyles = makeStyles((theme) => ({
    root : {
        // maxWidth : 750,
        border : '1px solid '+theme.palette.blue.B100+' !important', borderRadius : '15px !important',
        backgroundColor : theme.palette.blue.B200,
        padding : '10px !important',
        marginLeft : 20,
        marginRight : 20,
        zIndex : 1000,
        position : 'relative',

        "& .MuiTableContainer-root" : {
            boxSizing : 'border-box',
            "&::-webkit-scrollbar-thumb" : {
                backgroundColor : "#538f815c" ,
                borderRadius : "5px"
            } ,
            "&::-webkit-scrollbar-track" : {
                backgroundColor : "#538f815c" ,
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
            },
            "&::-webkit-scrollbar":{
                width : "10px",
                height : '10px',
                cursor : 'pointer !important'
            } ,

            maxHeight : '900px !important',
        },
        "& .MuiTable-root" : {
            minWidth : 800,
            borderCollapse: 'separate !important',
            borderSpacing: '0 10px',
            "& .MuiTableCell-root" : {
                color : 'white',
                padding : '5px !important',
                paddingTop : '10px !important',
                paddingBottom : '10px !important',
                position : 'relative',
                zIndex : 1000
            }
        },
        "& .MuiTableHead-root" : {
            "& .MuiTableCell-root" : {
                fontSize : '13px',
                "&:first-child": {
                    textAlign : 'left !important'
                },
            }
        },
        "& .MuiTableBody-root" : {
            "& .MuiTableRow-root" : {
                cursor : 'pointer',
                transition : '0.2s',
                "&:hover" : {
                    background : theme.palette.blue.B300 + ' !important'
                },
            },
            "& .MuiTableCell-root" : {
                background : '#538f815c',
                border : 'none !important',
                marginBottom : '10px !important',
                fontSize : '13px',
                "&:first-child": {
                    paddingLeft : '15px !important',
                    borderBottomLeftRadius : '10px !important', borderTopLeftRadius : '10px !important',
                },
                "&:last-child": {
                    paddingRight : '15px !important',
                    borderBottomRightRadius : '10px !important', borderTopRightRadius : '10px !important',
                },
            }
        },
        "& .MuiTableFooter-root" : {
            "& .MuiTablePagination-root" : {
                color : theme.palette.green.G200 + " !important",
                "& svg" : {
                    color : theme.palette.green.G200
                }
            },
            "& .MuiTablePagination-spacer" : {
                "-webkit-flex" : 'none !important',
                flex : 'none !important'
            }
        }
    },
    successCircle : {
        border : '3px solid #17E383',
        borderRadius : '50%',
        width : 15,
        height: 15
    },
    pendingCircle : {
        border : '3px solid #FF9548',
        borderRadius : '50%',
        width : 15,
        height: 15
    },
    successDiv : {
        color : '#17E383'
    },
    pendingDiv : {
        color : "#FF9548"   
    }
})) ;