import * as React from 'react';

import {useNavigate} from 'react-router-dom' ;

import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;
import { TopSellersList } from '../../../redux/actions/dashboard';

import Loading from 'react-loading-components' ;

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import {
    Box, Tooltip
} from '@mui/material' ;

import { useStyles } from './StylesDiv/TopCreator.styles';
import { useTheme } from '@mui/styles';

const TopCreator = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;
    const navigate = useNavigate() ;

    const {
        TopSellersList,
        topSellersList 
    } = props ;

    React.useEffect(() => {
        TopSellersList() ;
    }, []) ;

    return (
        <Box className={classes.root}>
            <Box className={classes.labelDiv}>
                <Box className={classes.titleDiv}>
                    Top Sellers
                </Box>
            </Box>
            <Box className={classes.listDiv}>
                {
                    topSellersList ? 
                        topSellersList.length ? 
                            topSellersList.map((creator, index) => {
                                return (
                                    <Box className={classes.creatorDiv} key={index}>
                                        <Box className={classes.mainInfoDiv}>
                                            <Box className={classes.thDiv}>
                                                { index + 1 }.
                                            </Box>
                                            <img src={creator.profile_picture_url} width={40} height={40}
                                                style={{borderRadius : '50%'}}
                                            />
                                           
                                            <Box sx={{cursor : 'pointer'}}>
                                                <Tooltip title={creator.email}>
                                                    <Box sx={{fontSize : '15px', "&:hover" : {color : 'white'}}}>
                                                        { creator.email.slice(0 , 10) }...
                                                    </Box>
                                                </Tooltip>
                                                <Box sx={{ fontSize : '13px', "&:hover" : {color : 'white'}, cursor : 'pointer' }} 
                                                    onClick={() => {
                                                        window.open(creator.profile_link, '_blank') ;
                                                    }}
                                                >
                                                    {creator.full_name}
                                                </Box>
                                            </Box>
                                            
                                        </Box>
                                        <Box className={classes.countDiv}>
                                            <Box>
                                                Total : { creator.product_count }
                                            </Box>
                                            <Box>
                                                Sold : { creator.total_sold_count }
                                            </Box>
                                        </Box>
                                    </Box>
                                )
                        })
                        :<Box className={classes.emptyDiv}>
                            <SearchOffIcon />
                            <Box>There aren't any creator.</Box>
                        </Box>
                    :  <Box className={classes.emptyDiv}>
                        <Loading type='oval' width={40} height={40} fill={'white'}/>
                    </Box>
                }
            </Box>
        </Box>
    )
}

TopCreator.propTypes = {
    TopSellersList : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    topSellersList : state.dashboard.topSellersList
})
const mapDispatchToProps = {
    TopSellersList
}
export default connect(mapStateToProps, mapDispatchToProps)(TopCreator) ;