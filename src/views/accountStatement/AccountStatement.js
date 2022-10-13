import { CAlert, CButton, CFormInput, CFormSelect, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import React, { useEffect, useRef, useState } from 'react'
import ClearDate from 'src/components/ClearDate'
import Loader from 'src/components/Loader'
import ColumnHeader from 'src/components/table/ColumnHeader'
import PaginatedItems from 'src/components/table/PaginatedItems'
import { useLazyGetAccountStatementQuery, useLazyGetAccountStatementExportQuery } from 'src/servicesRtkQuery/adminApi'
import { filterTableData } from 'src/components/table/filterTableData'
import { ExportExcel } from "src/utils/ExportData";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const _ = require("lodash");


const percentage = 66;
const initSelect = (data) => {
  return data.map((item) => ({
    ...item,
    selected: false,
  }));
};

const AccountStatement = () => {
  const headerCells = [
    "Date",
    "User ID",
    "Pay ID",
    "Description",
    "Type",
    "Amount",
  ];
  const types = [
    "",
    "Deposit",
    "Withdraw",
    "Bid",
    "Winning",
    "Lost",
    "Bonus",
    "Rake",
    "Rake From User",
  ];

  const [filterColumns, setFilterColumns] = useState({
    created_at: "",
    user_id: "",
    game_id: "",
    bid: "",
    odd: "",
  });

  const [filterColumnsExport, setFilterColumnsExport] = useState({
    created_at: "",
    user_id: "",
    game_id: "",
    bid: "",
    odd: "",
    limit: process.env.REACT_APP_EXPORT_LIMIT,
    page: 1,
  });

  let accountStatementData = [];

  const [trigger, result] = useLazyGetAccountStatementQuery();
  const { isSuccess, isLoading, isFetching } = result;

  if (isSuccess) {
    accountStatementData = result.data.results.response;
  }


  const handleChange = (e) => {
    setFilterColumns({
      ...filterColumns,
      [e.target.name]: e.target.value,
    });
    setFilterColumnsExport({
      ...filterColumnsExport,
      [e.target.name]: e.target.value,
    });;
    setFilterColumnsExport({
      ...filterColumnsExport,
      [e.target.name]: e.target.value,
    });
  };;
  useEffect(() => {
    const search = setTimeout(() => {
      (async function () {
        await filterTableData(trigger, filterColumns);
      })();
    }, 500);
    return () => clearTimeout(search);;
  }, [filterColumns]);;

  const handlePageClick = (event) => {
    const pageNumber = event.selected + 1;
    const columnWithValue = _.omitBy(filterColumns, _.isEmpty);;
    columnWithValue.page = pageNumber;;
    trigger(columnWithValue);;
  };


  //export logic 

  const [BtnStatus, setBtnStatus] = useState(false);
  const [ProgressStatus, setProgressStatus] = useState(false);
  const [Progress, setProgress] = useState(0);
  const [triggerExport, resultExport] = useLazyGetAccountStatementExportQuery();
  const { isSuccess: exportSuccess, isFetching: exportFetching } = resultExport;
  const [currentPage, setCurrentPage] = useState(0);
  const [exportStatementData, setExportStatementData] = useState([]);
  const [allStatementData, setAllStatementData] = useState([]);
  const [isShowLoader, setIsShowLoader] = useState(false);
  useEffect(() => {
    (async function () {
      await triggerExport(filterColumnsExport);
      setBtnStatus(true);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      await triggerExport(filterColumnsExport);
      setBtnStatus(true);
    })();
  }, [filterColumnsExport]);

  const exportData = async () => {
    setCurrentPage(0);
    setExportStatementData([]);
    setAllStatementData([]);
    setIsShowLoader(true);
    setBtnStatus(false);
    setProgressStatus(true);
    let export_page = 1;
    let progressPercentage = 100 / resultExport?.data?.results?.last_page;
    if (resultExport?.data?.results?.last_page > 1) {
      do {
        const exportColumnWithValue = _.omitBy(filterColumnsExport, _.isEmpty);
        setProgress(Math.round(progressPercentage * export_page));
        exportColumnWithValue.page = export_page++;
        await triggerExport(exportColumnWithValue);
      } while (export_page <= resultExport?.data?.results?.last_page);
    } else if (resultExport?.data?.results?.last_page == 1) {
      setProgress(Math.round(progressPercentage * export_page));
      return ExportExcel(exportStatementData, process.env.REACT_APP_ACCOUNT);
    }
  };

  useEffect(() => {
    if (
      resultExport?.data?.results?.current_page &&
      resultExport?.data?.results?.current_page != currentPage
    ) {
      if (exportSuccess && !exportFetching) {
        setCurrentPage(resultExport?.data?.results?.current_page);
        setExportStatementData(resultExport?.data?.results?.data);
      }
    }
  }, [exportSuccess, exportFetching]);

  useEffect(() => {
    setAllStatementData([...allStatementData, exportStatementData]);
  }, [exportStatementData]);

  useEffect(() => {
    if (resultExport?.data?.results?.last_page == currentPage && resultExport?.data?.results?.data?.length != 0 && resultExport?.data?.results?.last_page != 1) {
      setIsShowLoader(false);
      const result = allStatementData.reduce((r, e) => (r.push(...e), r), []);
      setBtnStatus(true);
      setProgressStatus(false);
      return ExportExcel(result, process.env.REACT_APP_ACCOUNT);
    } else if (resultExport?.data?.results?.last_page == 1) {
      setBtnStatus(true);
      setProgressStatus(false);
    }
  }, [allStatementData]);
  return (
    <>
      <div className='d-flex justify-content-between'>
        <div className=' d-flex align-items-end'>
          <CButton
          className="ex-bt"
            color="primary"
            onClick={exportData}
            disabled={!BtnStatus ? true : false}
          >
            Export
          </CButton>
          {ProgressStatus ? (
            <div style={{ width: 50, height: 50 }}>
              <CircularProgressbar value={Progress} text={`${Progress}%`} />
            </div>
          ) : (
            ""
          )}
        </div>
        {
          isSuccess &&
          (!(result.data.results.user_balance === undefined)) &&
          <div className='w-25'>
            <CTable >
              <CTableBody>
                {
                  result.data.results.user_balance?.map((userbalance) => {
                    return (
                      <CTableRow key={userbalance.coin} >
                        <CTableDataCell>{userbalance.coin}</CTableDataCell>
                        <CTableDataCell >
                          <img src={`assets/images/${userbalance.icon}`} alt="imageof" className='me-2'
                            width={'24px'}
                            height={'24px'}
                          />&nbsp;
                          {userbalance.balance}
                        </CTableDataCell>

                      </CTableRow>
                    )
                  })
                }
              </CTableBody>
            </CTable>
          </div>
        }
      </div>
      {
        <CTable>
          <CTableHead>
            <ColumnHeader headerCells={headerCells} />
            <CTableRow>
              <CTableHeaderCell scope="col">
                <ClearDate
                  onClick={() => {
                    setFilterColumns({ ...filterColumns, created_at: "" });
                  }}
                />
                <CFormInput
                  value={filterColumns.created_at}
                  name="created_at"
                  onChange={handleChange}
                  type="date"
                />
              </CTableHeaderCell>

              <CTableHeaderCell scope="col">
                <CFormInput
                  className='game-box'
                  name="user_id"
                  value={filterColumns.user_id}
                  onChange={handleChange}
                />
              </CTableHeaderCell>
              <CTableHeaderCell scope="col">
                <CFormInput
                className='game-box'
                  name="pay_id"
                  value={filterColumns.pay_id}
                  onChange={handleChange}
                />
              </CTableHeaderCell>
              <CTableHeaderCell scope="col">
                <CFormInput
                  name="description"
                  value={filterColumns.description}
                  onChange={handleChange}
                />
              </CTableHeaderCell>

              <CTableHeaderCell scope="col">
                <CFormSelect
                 className='game-box-2'
                  name="type"
                  value={filterColumns.type}
                  onChange={handleChange}
                >
                  {types.map((type, index) => {
                    return <option key={index}>{type}</option>;
                  })}
                </CFormSelect>
              </CTableHeaderCell>
              <CTableHeaderCell scope="col"> </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          {isFetching || isLoading ? (
            <Loader />
          ) : accountStatementData?.data?.length === 0 &&
            isFetching === false ? (
            <CAlert color="warning">No data found</CAlert>
          ) : (
            isSuccess && (
              <CTableBody>
                {accountStatementData?.data?.map((item, index) => {
                  return (
                    <CTableRow key={index} className=" ">
                      <CTableDataCell>{item.created_at}</CTableDataCell>
                      <CTableDataCell>{item.user_unique_id}</CTableDataCell>
                      <CTableDataCell>{item.pay_id}</CTableDataCell>
                      <CTableDataCell className='d-2' >{item.description}</CTableDataCell>
                      <CTableDataCell>{item.type.charAt(0).toUpperCase() + item.type.slice(1).replaceAll("_", " ")}</CTableDataCell>

                      <CTableDataCell className="account-stament">
                        <img
                          src={`assets/images/${item.icon}`}
                          alt="imageof"
                          className="me-2"
                          width={'24px'}
                          height={'24px'}
                        />
                        {item.amount}
                      </CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            )
          )}
        </CTable>
      }
      {isSuccess > 0 && (
        <PaginatedItems
          total={accountStatementData.total}
          items={accountStatementData.data}
          itemsPerPage={30}
          handlePageClick={handlePageClick}
        />
      )}
    </>
  );
};

export default AccountStatement;
