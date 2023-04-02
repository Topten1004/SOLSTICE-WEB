import * as React from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;
import { UserAccountInfo } from '../../../redux/actions/profile' ;

import CustomersList from '../../../components/Solstice/CustomersScreen/CustomersList';

import ManageSearchIcon from '@mui/icons-material/ManageSearch';

import { getCookie } from '../../../utils/Helper';

import {
    Box,
    TextField,
    InputAdornment
} from '@mui/material' ;

import { useStyles } from './StylesDiv/index.styles';

const CustomersScreen = (props) => {

    const classes = useStyles() ;
  
    const {
        UserAccountInfo,
        fullName
    } = props ;

    const [searchStr, setSearchStr] = React.useState('') ;

    React.useEffect(() => {
        UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
    }, []) ;

    return (
        <Box className={classes.root}>
            <Box className={classes.greenBlur} />
            <Box className={classes.blueBlur} />
            <Box className={classes.pageTitleDiv}>
                {fullName} Customers
            </Box>
            <Box className={classes.searchDiv}>
                <TextField 
                    size='small'
                    placeholder='Search customer by email, full name and user name.'
                    fullWidth
                    value={searchStr}
                    onChange={(e) => setSearchStr(e.target.value)}

                    InputProps={{
                        startAdornment: <InputAdornment position="start">
                            <ManageSearchIcon/> | 
                        </InputAdornment>,
                    }}
                />
            </Box>
            <CustomersList 
                searchStr={searchStr}
            />
        </Box>
    );
}
CustomersScreen.propTypes = {
    UserAccountInfo : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    fullName : state.profile.fullName
}) ;
const mapDispatchToProps = {
    UserAccountInfo
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomersScreen) ;