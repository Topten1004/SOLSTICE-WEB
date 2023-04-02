import * as React from 'react' ;

import { bytesToSize } from '../../../../utils/Helper';

import Loading from 'react-loading-components' ;
import FileInformation from './FileInformation';
import EmptyFolderImage from '../../../../assets/cloud/EmptyFolder.png' ;

import PdfPreview from '../../../Common/PdfPreview';
import DocPreview from '../../../Common/DocPreview';
import DocxPreview from '../../../Common/DocxPreview';

import { v4 as uuidv4 } from 'uuid' ;

import {
    Box,
    Grid,
    Tooltip,
    useMediaQuery
} from '@mui/material' ;

import { makeStyles, useTheme } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    root : {
        maxHeight : 900,
        ['@media (max-width : 1190px)'] : {
            height : 'auto',
            marginBottom : '20px !important'
        },
        overflowY : 'scroll',
        color : theme.palette.green.G200,
        display : 'flex', gap : '20px', flexWrap : 'wrap',
        borderRight : '1px solid gray',
        "&:hover" : {
            cursor : 'pointer',
        }
    },
    fileItemDiv : {
        border : '1px solid ' + theme.palette.blue.B100,
        borderRadius : '10px',
        width : 270, maxHeight : 400,
        padding : 20,
        "&:hover" : {
            background : theme.palette.blue.B300
        }
    },
    fileNameDiv : {
        borderBottom : '1px solid gray',
        paddingBottom : 10,
        textAlign : 'center',
        fontSize : '20px'
    }
}))

const FileThumbList = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;
    const match1190 = useMediaQuery('(min-width : 1190px)') ;

    const {
        fileList,
        searchStr,
        viewFileList
    } = props ;

    const [fileIndex, setFileIndex] = React.useState(0) ;

    const handleSelectFile = (fileIndex) => {
        setFileIndex(fileIndex) ;
    }
    return (
        <Grid container>
            <Grid item xs={match1190 ? 8 : 12} className={classes.root} sx={{justifyContent : fileList ? 'flex-start' : 'center'}}>
            {
                fileList ? (
                    fileList.length ? 
                        fileList?.filter(file => file.name.toLowerCase().search(searchStr.toLowerCase()) >= 0 && (viewFileList === 'recent' ? new Date().getTime() - new Date(file.created_at).getTime() < 24*60*60*1000*2 : true) ).map((file, index) => {
                            return (
                                <Box key={index} className={classes.fileItemDiv} onClick={() => handleSelectFile(index) } sx={{background : index === fileIndex ? theme.palette.blue.B200 : 'transparent'}}>
                                    <Tooltip title={file?.name}>
                                        <Box sx={{fontSize : '20px'}}>
                                            Name : {file.name?.slice(0, 10)}{file.name.length > 10 && "..."}
                                        </Box>
                                    </Tooltip>
                                    <Box sx={{mt : '10px', }}>
                                        {
                                            file?.category === 'video' 
                                            && <video src={file?.path} width={230} height={200} style={{background : theme.palette.blue.B300, borderRadius : '10px'}} controls/>
                                           
                                        }
                                        {
                                             file?.category === 'image' 
                                             && <img src={file?.path} width={230} height={200} style={{borderRadius : '10px'}} />
                                        }
                                        {
                                            file?.category === 'pdf' && <Box sx={{display : 'flex', justifyContent : 'center', height:'210px', width:'230px'}}>
                                                <PdfPreview
                                                    previewUrl={file.path}
                                                    width={230}
                                                    height={200}
                                                /> 
                                            </Box>
                                        }
                                        {
                                            file.category === 'doc' &&  <Box sx={{display : 'flex', justifyContent : 'center', height:'210px', width:'230px'}}>
                                                <DocPreview
                                                    previewUrl={file.path}
                                                    width={230}
                                                    height={200}
                                                    key={uuidv4()}
                                                    activeIndex={0}
                                                    selfIndex={0}
                                                />
                                            </Box>
                                        }
                                        {
                                            file.category === 'docx' &&  <Box sx={{display : 'flex', justifyContent : 'center', height:'210px', width:'230px'}}>
                                                <DocxPreview
                                                    previewUrl={file.path}
                                                    width={230}
                                                    height={200}
                                                    key={uuidv4()}
                                                    activeIndex={0}
                                                    selfIndex={0}
                                                />
                                            </Box>
                                        }
                                    </Box>
                                    <Box className={classes.fileNameDiv}>{file.product.product_name}</Box>
                                    <Box sx={{display : 'flex', justifyContent : 'space-between', alignItems : 'center', mt : '20px'}}>
                                        <Box >
                                            File Size :
                                            <Box>{bytesToSize(file.size)}</Box>
                                        </Box>
                                        <Box>
                                            Created :
                                            <Box>{new Date(file.created_at).toLocaleDateString()}</Box>
                                        </Box>
                                    </Box>
                                </Box>
                            )
                        }) 
                    : <Box sx={{fontSize : '22px', display : 'flex' , alignItems:'center', gap : '20px', justifyContent : 'center', width : '100%'}}>
                        <img src={EmptyFolderImage} width={50}/> Empty Folder
                    </Box>
                )
                :  <Loading type='bars' width={50} height={50} fill='#43D9AD' />
            }
            </Grid>
            <Grid item xs={match1190 ? 4 : 12} sx={{color : theme.palette.blue.B100, padding : match1190 ? '20px' : '5px', display : !fileList?.length && 'none'}}>
                <FileInformation
                    fileInfo={fileList && fileList?.filter(file => file.name.toLowerCase().search(searchStr.toLowerCase()) >= 0 && (viewFileList === 'recent' ? new Date().getTime() - new Date(file.created_at).getTime() < 24*60*60*1000 : true) )?.[fileIndex]}
                />
            </Grid>
        </Grid>
    )
}

export default FileThumbList ;