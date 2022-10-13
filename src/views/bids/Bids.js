import React, { useEffect, useState } from "react";
import {
  CButton,
  CFormInput,
  CFormSelect,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import ClearDate from "src/components/ClearDate";
import {
  useLazyGetBidsQuery,
  useLazyGetExportBidsQuery,
} from "src/servicesRtkQuery/adminApi";
import ColumnHeader from "src/components/table/ColumnHeader";
import { filterTableData } from "src/components/table/filterTableData";
import { ExportExcel } from "src/utils/ExportData";
import Loader from "src/components/Loader";
import PaginatedItems from "src/components/table/PaginatedItems";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const _ = require("lodash");

const Bids = () => {
  const headerCells = [
    "Date",
    "User ID",
    "Game",
    "Bid No",
    "Type",
    "Odd",
    "Stake",
    "Status",
  ];
  const types = ["", "high", "mid", "low"];
  const statuses = ["", "Deal", "Won", "Lost"];
  const [filterColumns, setFilterColumns] = useState({
    created_at: "",
    user_id: "",
    game_id: "",
    id: "",
    high_mid_low: "",
    status: "",
  });

  const [filterColumnsExport, setFilterColumnsExport] = useState({
    created_at: "",
    user_id: "",
    game_id: "",
    id: "",
    high_mid_low: "",
    status: "",
    limit: process.env.REACT_APP_EXPORT_LIMIT,
    page: 1,
  });

  let bidsData = [];
  const [trigger, result] = useLazyGetBidsQuery();
  const { isSuccess, isLoading, isFetching } = result;

  if (isSuccess) {
    bidsData = result.data.results;
  }

  const handleChange = (e) => {
    setFilterColumns({
      ...filterColumns,
      [e.target.name]: e.target.value,
    });

    setFilterColumnsExport({
      ...filterColumnsExport,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const search = setTimeout(() => {
      (async function () {
        let status = filterColumns.status;
        status =
          status === "Deal"
            ? "0"
            : status === "Won"
              ? "1"
              : status === "Lost"
                ? "2"
                : "";
        const payload = {
          ...filterColumns,
          status: status,
        };
        await filterTableData(trigger, payload);
      })();
    }, 500);
    return () => clearTimeout(search);
  }, [filterColumns]);

  const handlePageClick = (event) => {
    const pageNumber = event.selected + 1;
    const columnWithValue = _.omitBy(filterColumns, _.isEmpty);
    columnWithValue.page = pageNumber;
    trigger(columnWithValue);
  };

  //export logic 
  const [BtnStatus, setBtnStatus] = useState(false);
  const [ProgressStatus, setProgressStatus] = useState(false);
  const [Progress, setProgress] = useState(0);
  const [triggerExport, resultExport] = useLazyGetExportBidsQuery();
  const { isSuccess: exportSuccess, isFetching: exportFetching } = resultExport;
  const [currentPage, setCurrentPage] = useState(0);
  const [exportBid, setExportBid] = useState([]);
  const [allBid, setAllBid] = useState([]);
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
    setExportBid([]);
    setAllBid([]);
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
      return ExportExcel(exportBid, process.env.REACT_APP_BID);
    }
  };

  useEffect(() => {
    if (
      resultExport?.data?.results?.current_page &&
      resultExport?.data?.results?.current_page != currentPage
    ) {
      if (exportSuccess && !exportFetching) {
        setCurrentPage(resultExport?.data?.results?.current_page);
        setExportBid(resultExport?.data?.results?.data);
      }
    }
  }, [exportSuccess, exportFetching]);

  useEffect(() => {
    setAllBid([...allBid, exportBid]);
  }, [exportBid]);

  useEffect(() => {
    if (resultExport?.data?.results?.last_page == currentPage && resultExport?.data?.results?.data?.length != 0 && resultExport?.data?.results?.last_page != 1) {
      setIsShowLoader(false);
      const result = allBid.reduce((r, e) => (r.push(...e), r), []);
      setBtnStatus(true);
      setProgressStatus(false);
      return ExportExcel(result, process.env.REACT_APP_BID);
    } else if (resultExport?.data?.results?.last_page == 1) {
      setBtnStatus(true);
      setProgressStatus(false);
    }
  }, [allBid]);
  return (
    <>
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
      <CTable>
        <CTableHead>
          <CTableRow className="text-center">
            <ColumnHeader headerCells={headerCells} />
          </CTableRow>
          <CTableRow className="text-center">
            <CTableHeaderCell scope="col">
              <ClearDate
                onClick={() => {
                  setFilterColumns({ ...filterColumns, created_at: "" });
                }}
              />
              <CFormInput
              className="date-box"
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
                name="game_id"
                value={filterColumns.game_id}
                onChange={handleChange}
              />
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              <CFormInput
               className='game-box'
                name="id"
                value={filterColumns.id}
                onChange={handleChange}
              />
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              <CFormSelect
               className='game-box'
                name="high_mid_low"
                value={filterColumns.high_mid_low}
                onChange={handleChange}
              >
                {types.map((type, index) => {
                  return <option key={index}>{type}</option>;
                })}
              </CFormSelect>
            </CTableHeaderCell>
            <CTableHeaderCell scope="col"></CTableHeaderCell>
            <CTableHeaderCell scope="col"></CTableHeaderCell>
            <CTableHeaderCell scope="col">
              <CFormSelect
                name="status"
                value={filterColumns.status}
                onChange={handleChange}
              >
                {statuses.map((status, index) => {
                  return <option key={index}>{status}</option>;
                })}
              </CFormSelect>
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {isFetching || isLoading ? (
            <Loader />
          ) : bidsData?.data?.length === 0 && isFetching === false ? (
            <CTableDataCell>No data found</CTableDataCell>
          ) : (
            bidsData?.data?.map((bid, index) => {
              return (
                <CTableRow key={index} className="text-center">
                  <CTableDataCell className="dat">{bid.created_at}</CTableDataCell>
                  <CTableDataCell>{bid.user_unique_id}</CTableDataCell>
                  <CTableDataCell>{bid.game_unique_id} </CTableDataCell>
                  <CTableDataCell>{bid.bid_unique_id}</CTableDataCell>
                  <CTableDataCell>{bid.high_mid_low}</CTableDataCell>
                  <CTableDataCell>{bid.odd}</CTableDataCell>
                  <CTableDataCell className="d-c">
                    <img
                      src={`assets/images/${bid.icon}`}
                      alt="imageof"
                      className="me-2"
                      width={'24px'}
                      height={'24px'}
                    />
                    {bid.stake}
                  </CTableDataCell>
                  <CTableDataCell>
                    {bid.status === 0
                      ? "Deal"
                      : bid.status === 1
                        ? "Won"
                        : bid.status === 2
                          ? "Lost"
                          : ""}
                  </CTableDataCell>
                </CTableRow>
              );
            })
          )}
        </CTableBody>
      </CTable>
      {isSuccess > 0 && (
        <PaginatedItems
          total={bidsData.total}
          items={bidsData.data}
          itemsPerPage={30}
          handlePageClick={handlePageClick}
        />
      )}
    </>
  );
};
export default Bids;
