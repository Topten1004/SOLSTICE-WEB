import { makeStyles } from '@mui/styles' ;

export const useStyles = makeStyles((theme) => ({
    root : {
        border : '1px solid '+theme.palette.blue.B100+' !important', borderRadius : '15px !important',
        backgroundColor : theme.palette.blue.B200,
        padding : '10px !important',
        margin : 20,
        position : 'relative',
        zIndex : 1000,

        "& .MuiTableContainer-root" : {
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
            minWidth : 1080,
            borderCollapse: 'separate !important',
            borderSpacing: '0 10px',
            "& .MuiTableCell-root" : {
                color : 'white',
                padding : '10px !important',
                paddingTop : '7px !important',
                paddingBottom : '7px !important',
                fontSize : '12px !important'
            }
        },
        "& .MuiTableHead-root" : {
            "& .MuiTableCell-root" : {
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
                "&:first-child": {
                    borderBottomLeftRadius : '10px !important', borderTopLeftRadius : '10px !important',
                },
                "&:last-child": {
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
    paper : {
        backgroundColor : theme.palette.blue.main + ' !important',
        "& .MuiList-root" : {
            padding : '0px !important',
        },
        "& .MuiMenuItem-root" : {
            borderBottom : '1px solid '+theme.palette.green.G400+' !important',
            "&:last-child" : {
                borderBottom : 'none !important',
            },
            background : theme.palette.blue.B300 + " !important",
            color : theme.palette.green.G200 + " !important",
        },
    },
    addDiv : {
        color : '#03361c !important',
        textTransform : 'capitalize !important',
        fontSize: '13px !important',
        minWidth : '150px !important',
        height : 35,
        background : theme.palette.green.G200 + ' !important',
        borderRadius : '30px !important',

        position : 'relative',
        zIndex : 1000,
        cursor : 'pointer !important',
       
        ['@media (max-width : 705px)'] : {
            fontSize : 15
        }
    },
    loadButtonCss : {
        height : 35,
        color : '#03361c !important',
        textTransform : 'capitalize !important',
        fontSize: '13px !important',
        minWidth : '130px !important',
        background : theme.palette.green.G200 + ' !important',
        borderRadius : '30px !important',
    },
    deleteButtonCss : {
        color : theme.palette.warning.WR100 + ' !important',
        textTransform : 'capitalize !important',
        fontSize: '15px !important',
        background : theme.palette.warning.main + ' !important'
    },
    editButtonCss : {
        color : '#03361c !important',
        textTransform : 'capitalize !important',
        fontSize: '15px !important',
        background : theme.palette.green.G200 + ' !important'
    }
})) ;