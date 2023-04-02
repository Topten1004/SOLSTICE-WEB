import * as React from 'react' ;

import { useMeasure } from 'react-use' ;

import { connect } from 'react-redux';
import PropTypes from 'prop-types' ;
import { EarningBalanceList } from '../../../redux/actions/dashboard';

import ReactApexChart from 'react-apexcharts' ;

import {
    Box
} from '@mui/material' ;

import { useStyles } from './StylesDiv/EarningGraph.styles';
import { useTheme } from '@mui/styles';

const EarningGraph = (props) => {
    const classes = useStyles() ;
    const theme = useTheme() ;

    const chartCtrl = React.useRef() ;

    const [ setChartCtrl, {width, height} ] = useMeasure();

    const {
        EarningBalanceList
    } = props ;
    
    const series = [{
        name: 'Inflation',
        data: [2.3, 2.5, 2.0, 2.1, 1.7, 2.6, 1.2]
    }] ;

    const options = {
        chart: {
            height: '150px',
            type: 'bar',
            toolbar: {
                show: false,
            },
        },
        grid: {
            show: true,
            borderColor: theme.palette.green.G400,
            strokeDashArray: 0,
            position: 'back',
            xaxis: {
                lines: {
                    show: false
                }
            },   
            yaxis: {
                lines: {
                    show: true
                }
            },  
            row: {
                colors: undefined,
                opacity: 0.5
            },  
            column: {
                colors: undefined,
                opacity: 0.5
            },  
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },  
        },
        colors: ['#2c37b9'],
        plotOptions: {
            bar: {
                borderRadius: 5,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return  "$ " + val;
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: [theme.palette.green.G200]
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
            type: "vertical",
                gradientToColors: ['#a32cb9','#2c37b9'],
                stops: [0, 100]
            }
        },
        xaxis: {
            categories: ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"],
            position: 'bottom',
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            tooltip: {
                enabled: false,
            },
            labels: {
                show: true,
                rotate: -45,
                rotateAlways: false,
                hideOverlappingLabels: true,
                showDuplicates: false,
                trim: false,
                minHeight: undefined,
                maxHeight: 120,
                style: {
                    colors: [theme.palette.green.G200, theme.palette.green.G200, theme.palette.green.G200, theme.palette.green.G200, theme.palette.green.G200, theme.palette.green.G200, theme.palette.green.G200],
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400,
                    cssClass: 'apexcharts-xaxis-label',
                },
                offsetX: 0,
                offsetY: 0,
                format: undefined,
                formatter: undefined,
                datetimeUTC: true,
                datetimeFormatter: {
                    year: 'yyyy',
                    month: "MMM 'yy",
                    day: 'dd MMM',
                    hour: 'HH:mm',
                },
            },
        },
        yaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                maxWidth: 50,
                formatter: function (val) {
                    return "$" + val;
                }
            },
        },
        tooltip : {
            show: false,
            enabled : false
        },
        
    } ;

    React.useEffect(() => {
        EarningBalanceList() ;
    }, []) ;

    React.useEffect(() => {
        setChartCtrl(chartCtrl.current);
        // console.log(width, height);
    }, []);

    return (
        <Box className={classes.root}>
            <Box className={classes.titleDiv}>Earnings</Box>
            <Box className={classes.chartDiv} ref={chartCtrl}>
                <ReactApexChart options={options} series={series} type="bar" height={350} width={width - 20}/>
            </Box>
        </Box>
    )
}
EarningGraph.propTypes = {
    EarningBalanceList : PropTypes.func.isRequired
}
const mapStateToProps = state => ({

})
const mapDispatchToProps = {
    EarningBalanceList
}
export default connect(mapStateToProps, mapDispatchToProps)(EarningGraph) ;