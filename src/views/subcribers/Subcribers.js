import React, { useEffect, useState } from 'react'
import { CAlert, CButton, CFormInput, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { useLazyGetSubcribersQuery } from 'src/servicesRtkQuery/gamesMenuApi';
import Loader from 'src/components/Loader';
import ColumnHeader from 'src/components/table/ColumnHeader';
import PaginatedItems from 'src/components/table/PaginatedItems';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';
import format from 'date-fns/format';
import { filterTableData } from 'src/components/table/filterTableData';
const _ = require('lodash');

const Subcribers = () => {

  const headerCells = ['Email', "Date and Time"];
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date())

  const [filterColumns, setFilterColumns] = useState({
    from_date: "",
    to_date: "",
    email: "",

  })
  const handleChange = ((event) => {
    const { name, value } = event.target;
    if (name === 'date') {
      if (startTime && endTime) {
        setFilterColumns(
          {
            ...filterColumns,
            from_date: format(startTime, "yyyy-MM-dd"),
            to_date: format(endTime, "yyyy-MM-dd"),
          })
        return
      }
    }
    setFilterColumns({ ...filterColumns, [name]: value })
  })

  let subcribers = []
  const [trigger, result] = useLazyGetSubcribersQuery()
  const { isSuccess, isLoading, isFetching, isError, error } = result
  if (isSuccess) {
    subcribers = result.data
  }
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
  return (
    <>
      <div className='d-flex justify-content-start withdrwa-page'>
        <div className='' >
          <h6 className=''>Select start date and time</h6>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              views={['day', 'month', 'year']}
              ampm={false}
              renderInput={(props) => <TextField {...props} />}
              value={startTime}
              inputFormat="yyyy-MM-dd"
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
              views={['day', 'month', 'year']}
              ampm={false}
              renderInput={(props) => <TextField {...props} />}
              value={endTime}
              inputFormat="yyyy-MM-dd"
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
          <CButton color="primary" className='ms-2' onClick={() => {
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


      <CTable striped>
        <CTableHead>
          <CTableRow>
            <ColumnHeader headerCells={headerCells} />
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="col" >
              <CFormInput
                name='email'
                value={filterColumns.email}
                onChange={handleChange}
              />
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
                        </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        {
          isLoading || isFetching ? <Loader /> :
            isError ? <CAlert color="danger">{'Something went wrong'}</CAlert> :
              isSuccess &&
              <CTableBody>
                {
                  subcribers?.data?.map((subcriber, index) => {
                    return (
                      <CTableRow key={index} >
                        <CTableDataCell className='w-25' >{subcriber.email}</CTableDataCell>
                        <CTableDataCell >{subcriber.created_at}</CTableDataCell>
                     
                      </CTableRow>
                    )
                  })
                }

              </CTableBody>
        }

      </CTable>


      {
        <PaginatedItems
          total={subcribers.total}
          items={subcribers.data}
          itemsPerPage={10}
          handlePageClick={handlePageClick}
        />
      }
    </>
  )
}
export default Subcribers