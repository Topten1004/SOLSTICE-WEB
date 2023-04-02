import { makeStyles } from '@mui/styles' ;

export const useStyles = makeStyles((theme) => ({
    root : {
        // maxWidth : 750,
        padding : '10px !important',
        zIndex : 1000,
        position : 'relative',
        marginTop : 10,

        "& .MuiTableContainer-root" : {
            boxSizing : 'border-box',
            maxHeight: 200 ,
            paddingRight : 10,

            "&::-webkit-scrollbar-thumb" : {
                borderRadius : "5px",
                background : '#17E383' 
            } ,
            "&::-webkit-scrollbar-track" : {
                backgroundColor : "#538f815c" ,
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
            },
            "&::-webkit-scrollbar":{
                width : "8px",
                height : '8px',
                cursor : 'pointer !important'
            } ,
        },
        "& .MuiTable-root" : {
            borderCollapse: 'separate !important',
            borderSpacing: '0 10px',
            minWidth : 450,
            "& .MuiTableCell-root" : {
                color : 'white',
                padding : '5px !important',
                paddingTop : '10px !important',
                paddingBottom : '10px !important',
                position : 'relative',
                zIndex : 1000,
                color : 'black'
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
            },
            "& .MuiTableCell-root" : {
                background : '#97a3a05c',
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
    linkHref : {
        cursor : 'pointer' ,
        "&:hover" : {
            color : 'red'
        }
    }
})) ;