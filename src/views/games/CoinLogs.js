import React, { useEffect, useRef, useState } from 'react'
import { CAlert, CButton, CFormSelect, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { useLocation, } from 'react-router-dom';
import PaginatedItems from 'src/components/table/PaginatedItems';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { TextField } from '@mui/material';
import { useLazyGetCurrentPriceHighLowQuery, useLazyGetPriceLogsOfCoinQuery } from 'src/servicesRtkQuery/gamesMenuApi';
import { filterTableData } from 'src/components/table/filterTableData';
import Loader from 'src/components/Loader';
import format from 'date-fns/format';
const _ = require('lodash');


const CoinLogs = () => {
    const { state } = useLocation();
    const hours = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
        '13', '14', '15', '16', '17', '18'];
    const [filterColumns, setFilterColumns] = useState({
        coin_id: state.coin_id,
        from_date: "",
        to_date: "",
    })
    let priceLogsOfCoinData = []
    const [triggerPriceLogs, resultPriceLogs] = useLazyGetPriceLogsOfCoinQuery()
    const { isSuccess: isSuccessPriceLogs, isLoading: isLoadingPriceLogs, isFetching: isFetchingPriceLogs } = resultPriceLogs
    if (isSuccessPriceLogs) {
        priceLogsOfCoinData = resultPriceLogs.data.results
    }
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date())
    const handleDateRangeSearch = (() => {
        const data = {
            "coin_id": state.coin_id,
            "from_date": format(startTime, "yyyy-MM-dd HH:mm"),
            "to_date": format(endTime, "yyyy-MM-dd HH:mm")
        }
        setFilterColumns(data)
    })
    useEffect(() => {
        (async function () {
            await filterTableData(triggerPriceLogs, filterColumns)
        }());
    }, [filterColumns])

    const handlePageClick = (event) => {
        const pageNumber = event.selected + 1;
        const columnWithValue = _.omitBy(filterColumns, _.isEmpty)
        columnWithValue.page = pageNumber
        triggerPriceLogs(columnWithValue)
    };
    // code is end for showing price logs of coin with filter and pagination
    const coinIdRef = useRef()
    const [dateTime, setDateTime] = useState(new Date())
    const [trigger, result] = useLazyGetCurrentPriceHighLowQuery()
    const { isSuccess } = result
    let high = ''
    let low = ''
    if (isSuccess) {
        high = result.data.results.high
        low = result.data.results.low
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        trigger({
            coin_id: state.coin_id,
            duration: coinIdRef.current.value,
            from_dateTime: format(dateTime, "yyyy-MM-dd HH:mm:ss")

        })
    }
    return (
        <>
            <div className=''>
                <h6 className='text-primary'>Logs of {state.coin_name}</h6>
            </div>
            <div className='  coin-log '>
                <div className=''>
                    <div className=''>
                        <h6 className=''>Get coin high and low</h6>
                        <CFormSelect
                            required
                            name="coin_id"
                            ref={coinIdRef}
                        >
                            {
                                hours.map((hr) => {
                                    return <option key={hr} value={hr}>{hr}</option>
                                })
                            }
                        </CFormSelect>
                    </div>

                    <div className='mt-3 coin-id' >
                        <h6 className=''>Select Date and Time</h6>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                views={['day', 'month', 'year', 'hours', 'minutes', 'seconds']}
                                ampm={false}
                                renderInput={(props) => <TextField {...props} />}
                                value={dateTime}
                                inputFormat="yyyy-MM-dd HH:mm:ss"
                                onChange={(newValue) => {
                                    setDateTime(newValue);
                                }}
                            />
                        </LocalizationProvider>

                    </div>
                    <div className=' mt-3 mb-3'>
                        <CButton color="primary"
                            onClick={handleSubmit}>
                            Submit
                        </CButton>
                    </div>
                </div>
                <div className='mt-5  '>
                    {
                        isSuccess &&
                        <>
                            <div>High = {high}</div>
                            <div>Low = {low}</div>
                        </>
                    }
                </div>
                <div className="vl  vl-2"></div>
                <div className=' justify-content-start'>
                    <div className='' >
                        <h6 className=''>Select start date and time</h6>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker

                                views={['day', 'month', 'year', 'hours', 'minutes',]}
                                ampm={false}
                                renderInput={(props) => <TextField {...props} />}
                                value={startTime}
                                inputFormat="yyyy-MM-dd HH:mm"
                                onChange={(newValue) => {
                                    setStartTime(newValue);
                                }}
                            />
                        </LocalizationProvider>

                    </div>
                    <div className=' '>
                        <h6 className=' s-end-date'>Select end date and time</h6>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                views={['day', 'month', 'year', 'hours', 'minutes', 'seconds']}
                                ampm={false}
                                renderInput={(props) => <TextField {...props} />}
                                value={endTime}
                                inputFormat="yyyy-MM-dd HH:mm:ss"
                                onChange={(newValue) => {
                                    setEndTime(newValue);
                                }}
                                minDate={startTime}
                            />
                        </LocalizationProvider>
                    </div>

                    <div className='ms-2 mt-4'>
                        <CButton color="primary"
                            onClick={handleDateRangeSearch}>
                            Search
                        </CButton>
                    </div>
                </div>
            </div>

            {
                (isFetchingPriceLogs || isLoadingPriceLogs) ? <Loader />
                    : (priceLogsOfCoinData?.data?.length === 0 && isFetchingPriceLogs === false) ?
                        <CAlert color="warning">No data found</CAlert>
                        :
                        (isSuccessPriceLogs && priceLogsOfCoinData?.data?.length > 0) &&

                        <CTable>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {
                                    priceLogsOfCoinData?.data?.map((priceLog, index) => {
                                        return (
                                            <CTableRow key={index} >
                                                <CTableDataCell >{priceLog.price}</CTableDataCell>
                                                <CTableDataCell >{priceLog.created_at}</CTableDataCell>
                                            </CTableRow>
                                        )
                                    })
                                }
                            </CTableBody>
                        </CTable>
            }
            {
                <PaginatedItems
                    total={priceLogsOfCoinData.total}
                    items={priceLogsOfCoinData.data}
                    itemsPerPage={10}
                    handlePageClick={handlePageClick}
                />
            }
        </>

    )
}
export default CoinLogs