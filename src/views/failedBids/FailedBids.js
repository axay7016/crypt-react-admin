import { CFormInput, CFormSelect, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import React, { useEffect, useState } from 'react'
import ClearDate from 'src/components/ClearDate';
import Loader from 'src/components/Loader';
import ColumnHeader from 'src/components/table/ColumnHeader';
import { filterTableData } from 'src/components/table/filterTableData';
import PaginatedItems from 'src/components/table/PaginatedItems';
import { useLazyGetFailureBidsQuery } from 'src/servicesRtkQuery/menusApi';
const _ = require("lodash");

const FailedBids = () => {
    const headerCells = [
        "Date",
        "Game",
        "User",
        "Type",
        "Orignal Odd",
        "Odd",
        "Stake",
        "Fiat Amount",
        "Failure Reason",
    ];
    const types = ["", "high", "mid", "low"];
    const [filterColumns, setFilterColumns] = useState({
        created_at: "",
        game_id: "",
        user_id: "",
        high_mid_low: "",
    });


    let failureBidsData = [];
    const [trigger, result] = useLazyGetFailureBidsQuery();
    const { isSuccess, isLoading, isFetching } = result;

    if (isSuccess) {
        failureBidsData = result.data.results;
    }
    useEffect(() => {
        const search = setTimeout(() => {
            (async function () {
                await filterTableData(trigger, filterColumns);
            })();
        }, 500);
        return () => clearTimeout(search);;
    }, [filterColumns]);

    const handlePageClick = (event) => {
        const pageNumber = event.selected + 1;
        const columnWithValue = _.omitBy(filterColumns, _.isEmpty);
        columnWithValue.page = pageNumber;
        trigger(columnWithValue);
    };

    const handleChange = (e) => {
        setFilterColumns({
            ...filterColumns,
            [e.target.name]: e.target.value,
        });
    };


    return (
        <>
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
                                name="game_id"
                                value={filterColumns.game_id}
                                onChange={handleChange}
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
                            <CFormSelect
                                name="high_mid_low"
                                value={filterColumns.high_mid_low}
                                onChange={handleChange}
                            >
                                {types.map((type, index) => {
                                    return <option key={index}>{type}</option>;
                                })}
                            </CFormSelect>
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                        </CTableHeaderCell>

                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {isFetching || isLoading ? (
                        <Loader />
                    ) : failureBidsData?.data?.length === 0 && isFetching === false ? (
                        <CTableDataCell>No data found</CTableDataCell>
                    ) : (
                        failureBidsData?.data?.map((bid, index) => {
                            return (
                                <CTableRow key={index} className="text-center">
                                    <CTableDataCell>{bid.created_at}</CTableDataCell>
                                    <CTableDataCell>{bid.game_unique_id} </CTableDataCell>
                                    <CTableDataCell>{bid.unique_id}</CTableDataCell>
                                    <CTableDataCell>{bid.high_mid_low}</CTableDataCell>
                                    <CTableDataCell>{bid.user_original_odd}</CTableDataCell>
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
                                        <img
                                            src={`assets/images/${bid.icon}`}
                                            alt="imageof"
                                            className="me-2"
                                            width={'24px'}
                                            height={'24px'}
                                        />
                                        {bid.fiat_amount}
                                    </CTableDataCell>
                                    <CTableDataCell>{bid.bidding_failure_reason}</CTableDataCell>


                                </CTableRow>
                            );
                        })
                    )}
                </CTableBody>
            </CTable>
            {isSuccess > 0 && (
                <PaginatedItems
                    total={failureBidsData.total}
                    items={failureBidsData.data}
                    itemsPerPage={30}
                    handlePageClick={handlePageClick}
                />
            )}
        </>
    )
}

export default FailedBids