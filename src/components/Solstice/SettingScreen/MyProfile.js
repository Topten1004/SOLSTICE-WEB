import * as React from 'react' ;

import { useWalletInfo } from '../../../contexts/WalletContext' ;

import {connect} from 'react-redux' ;
import { UserAccountInfo } from '../../../redux/actions/profile';
import { ExpandedItem } from '../../../redux/actions/setting';
import PropTypes from 'prop-types' ;

import SwipeableViews from 'react-swipeable-views';
import CustomizePhoto from './CustomizePhoto';
import PersonalForm from './PersonalForm';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore' ;

import { getCookie } from '../../../utils/Helper';

import {
    Box ,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Grid,
    TextField,
    Tab,
    Tabs
} from '@mui/material' ;

import { useStyles } from './StylesDiv/MyProfile.styles';
import { useTheme } from '@mui/material' ;

const MyProfile = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;
    
    const [expand, setExpand] = React.useState(false) ;
    const [value, setValue] = React.useState(0);

    const {
        ExpandedItem,
        UserAccountInfo,

        expandedItem
    } = props ;

    const {
    } = useWalletInfo() ;

    const a11yProps = (index) => {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }
  
    const TabPanel = (props) => {
        const { children, value, index, ...other } = props;
    
        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
            {
                value === index && (
                    <Box sx={{ p: 3 }}>
                        {children}
                    </Box>
                )
            }
            </div>
        );
    }

    const TriggerExpandedItem = (e, expanded, itemIndex) => {
        ExpandedItem(itemIndex) ;
        setExpand(expanded) ;
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };
    
    React.useEffect(() => {
        if(expandedItem !== 2){
            setExpand(false) ;
        }
    }, [expandedItem]) ;
    

    React.useEffect(() => {
        UserAccountInfo(getCookie('_SOLSTICE_AUTHUSER')) ;
    }, []) ;

    return (
        <Box className={classes.root}>
            <Accordion
                expanded={expand}
                onChange={(e, expanded) => TriggerExpandedItem(e, expanded, 2)}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{backgroundColor : 'rgba(51, 139, 239, 0.21) !important'}}
                >
                    <Box sx={{display : 'flex', justifyContent : 'flex-start', alignItems : 'center'}}>
                        <Box className={classes.circlePrefix} /><Box>My Profile</Box>
                    </Box>
                </AccordionSummary>
                <AccordionDetails
                    sx={{padding : '10px'}}
                >
                    <Box sx={{ pb : '5px',  display : 'flex', justifyContent : 'space-between', alignItems : 'center'}}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Personal" {...a11yProps(0)} />
                            <Tab label="Photos" {...a11yProps(1)} />
                            {/* <Tab label="Photos" {...a11yProps(2)} /> */}
                        </Tabs>
                    </Box>
                    <SwipeableViews
                        axis={'x'}
                        index={value}
                        onChangeIndex={handleChangeIndex}
                    >
                        <TabPanel value={value} index={0}>
                            <PersonalForm />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <CustomizePhoto />
                        </TabPanel>
                        {/* <TabPanel value={value} index={2}>
                           
                        </TabPanel> */}
                    </SwipeableViews>
                </AccordionDetails>
            </Accordion>
        </Box>
       
    )
}
MyProfile.propTypes = {
    ExpandedItem : PropTypes.func.isRequired,
    UserAccountInfo : PropTypes.func.isRequired
}
const mapStateToProps = state => ({
    expandedItem : state.setting.expandedItem
})
const mapDispatchToProps = {
    ExpandedItem,
    UserAccountInfo
}
export default connect(mapStateToProps, mapDispatchToProps)(MyProfile) ;