

import React, { useEffect, useState } from 'react'
import { CButton, CFormInput, CFormSelect, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import { useApprovedRejectWithdrawMutation, useGetCoinQuery, useLazyGetWithdrawQuery } from 'src/servicesRtkQuery/gamesMenuApi';
import ColumnHeader from 'src/components/table/ColumnHeader';
import Loader from 'src/components/Loader';
import PaginatedItems from 'src/components/table/PaginatedItems';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { filterTableData } from 'src/components/table/filterTableData';
import format from 'date-fns/format';
const _ = require('lodash');

const WithdrawListing = () => {
  const headerCells = ['User ID', 'Coin Name', 'Amount', 'Status', 'Created At']
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date())
  //fetching coin in dropdown of coins
  const {
    data: coinsData,
    isSuccess: isSuccessCoinData,
  } = useGetCoinQuery()
  let coins = []
  if (isSuccessCoinData) {
    coins = coinsData.results
  }

  // from_date,to_date,user_id,coin_id,status
  // filter columns
  const [filterColumns, setFilterColumns] = useState({
    from_date: "",
    to_date: "",
    user_id: "",
    coin_id: "",
    status: "",
  })


  // fetching withdraw data
  let withdrawData = []
  const [trigger, result] = useLazyGetWithdrawQuery()
  const { isSuccess, isLoading, isFetching, isError, error } = result
  if (isSuccess) {
    withdrawData = result.data
  }

  const handleChange = ((event) => {
    const { name, value } = event.target;
    if (name === 'date') {
      if (startTime && endTime) {
        setFilterColumns(
          {
            ...filterColumns,
            from_date: format(startTime, "yyyy-MM-dd HH:mm"),
            to_date: format(endTime, "yyyy-MM-dd HH:mm"),
          })
        return
      }
    }
    setFilterColumns({ ...filterColumns, [name]: value })
  })
  useEffect(() => {
    const search = setTimeout(() => {
      (async function () {
        await filterTableData(trigger, filterColumns)
      }());
    }, 500);
    return () => clearTimeout(search)
  }, [filterColumns])



  const handlePageClick = (event) => {
    const pageNumber = event.selected + 1;
    const columnWithValue = _.omitBy(filterColumns, _.isEmpty)
    columnWithValue.page = pageNumber
    trigger(columnWithValue)
  };

  const [approvedRejectWithdraw, { isSuccess: isSuccessAR }] = useApprovedRejectWithdrawMutation()
  const handleGreenTick = (event) => {
    const data = { id: event.currentTarget.id, status: '1', }
    approvedRejectWithdraw(data)
  }
  const handleRedTick = (event) => {
    const data = { id: event.currentTarget.id, status: '2', }
    approvedRejectWithdraw(data)
  }
  useEffect(() => {
    if (isSuccessAR) {
      trigger()
    }
  }, [isSuccessAR])


  return (
    <>
      <div className='d-flex justify-content-start  withdrwa-page'>
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
        <div className=''>
          <h6 className=''>Select end date and time</h6>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              views={['day', 'month', 'year', 'hours', 'minutes',]}
              ampm={false}
              renderInput={(props) => <TextField {...props} />}
              value={endTime}
              inputFormat="yyyy-MM-dd HH:mm"
              onChange={(newValue) => {
                setEndTime(newValue);

              }}
              minDate={startTime}
            />
          </LocalizationProvider>
        </div>

        <div className='ms-2 d-flex align-items-center'>
          <CButton color="primary" name='date' onClick={handleChange}>
            Search
          </CButton>
          <CButton color="primary" className='ms-2' name='date' onClick={() => {
            setFilterColumns({
              ...filterColumns,
              from_date: "",
              to_date: "",
            })
            setStartTime(null)
            setEndTime(null)
            trigger()
          }}>
            Clear date filter
          </CButton>
        </div>
      </div>
      <CTable>
        <CTableHead>
          <CTableRow>
            <ColumnHeader headerCells={headerCells} />
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="col " >
              <CFormInput
                name='user_id'
                value={filterColumns.user_id}
                onChange={handleChange}
              />
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" className=''>
              <CFormSelect
               className='game-box-3'
                feedbackInvalid="Please select a coin."
                label="Coin"
                required
                name="coin_id"
                value={filterColumns.coin_id}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {
                  coins.map((coin) => {
                    return <option key={coin.id} value={coin.id}>{coin.coin}</option>
                  })
                }
              </CFormSelect>
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" ></CTableHeaderCell>
            <CTableHeaderCell scope="col" className=''>
              <CFormSelect
               className='game-box-3'
                name='status'
                onChange={handleChange}
                value={filterColumns.status}
              >
                <option value=''></option>
                <option value='1'>Approved</option>
                <option value='2'>Rejected</option>
                <option value='0'>In Process</option>

              </CFormSelect>
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" ></CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {
            isLoading || isFetching ? <Loader /> :
              isError ? <div>{error}</div> :
                isSuccess &&
                withdrawData?.data.map((withdraw) => {

                  return (
                    <CTableRow key={withdraw.id} >

                      <CTableDataCell style={{ width: "10%" }}>{withdraw.user_id}</CTableDataCell>
                      <CTableDataCell >{withdraw.coin_name}</CTableDataCell>
                      <CTableDataCell >{withdraw.amount}</CTableDataCell>
                      <CTableDataCell >
                        {
                          withdraw.status === 0 ?
                            <>
                              <IconButton id={withdraw.id} onClick={handleGreenTick} >
                                <CheckIcon color="success" />
                              </IconButton>
                              <IconButton id={withdraw.id} onClick={handleRedTick}>
                                <ClearIcon sx={{ color: red[500] }} />
                              </IconButton>

                            </>
                            :
                            withdraw.status === 1 ? <span className='text-success'>Approved</span> :
                              withdraw.status === 2 && <span className='text-danger'>Rejected</span>
                        }
                      </CTableDataCell>
                      <CTableDataCell >{withdraw.created_at}</CTableDataCell>
                    </CTableRow>
                  )
                })
          }
        </CTableBody>
      </CTable>
      {
        withdrawData?.data?.length > 0 &&
        <PaginatedItems
          total={withdrawData.total}
          items={withdrawData.data}
          itemsPerPage={10}
          handlePageClick={handlePageClick}
        />
      }
    </>
  )
}
export default WithdrawListing

// {
//   "id": 4,
//   "user_id": 87,
//   "coin_id": 5,
//   "amount": "995595959.00000000",
//   "status": 0,
//   "created_at": "16 Aug 2022 10:16:09AM",
//   "updated_at": "16 Aug 2022 10:16:09AM",
//   "coinId": 5,
//   "coin": "ETHUSDT",
//   "coin_name": "ETH/USDT",
//   "name": "ETH",
//   "icon": "ethereum_icon.png",
//   "uniqueID": "U9187"
// }