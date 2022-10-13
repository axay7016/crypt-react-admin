import { CFormInput, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import React, { useEffect, useState } from 'react'
import ClearDate from 'src/components/ClearDate';
import Loader from 'src/components/Loader';
import ColumnHeader from 'src/components/table/ColumnHeader';
import { filterTableData } from 'src/components/table/filterTableData';
import { useLazyGetPendingBonusQuery } from 'src/servicesRtkQuery/menusApi';

const PendingBonus = () => {
    // Pending Bonus for Admin side->
    // response field->
    //  -user_unique_id
    // -coin_name
    // -bonus amount
    // -description
    // -created_at

    // request field->
    //  -user_id
    // -coin_id
    // -date

    const headerCells = [
        "Date",
        "User ID",
        "Coin Name",
        "Bonus Amount",
        "Description",
    ];
    const [filterColumns, setFilterColumns] = useState({
        created_at: "",
        user_id: "",
        coin_id: "",
    });

    let pendingBonusData = [];
    const [trigger, result] = useLazyGetPendingBonusQuery();
    const { isSuccess, isLoading, isFetching } = result;

    if (isSuccess) {
        pendingBonusData = result?.data
        console.log(result?.data, 'pendingBonusData')
    }
    useEffect(() => {
        const search = setTimeout(() => {
            (async function () {
                await filterTableData(trigger, filterColumns);
            })();
        }, 500);
        return () => clearTimeout(search);;
    }, [filterColumns]);
    const handleChange = (e) => {
        setFilterColumns({
            ...filterColumns,
            [e.target.name]: e.target.value,
        });
    };
    return (
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
                         className="date-box  game-box-4"
                            value={filterColumns.created_at}
                            name="created_at"
                            onChange={handleChange}
                            type="date"
                        />
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">
                        <CFormInput
                           className='game-box game-box-4'
                            name="user_id"
                            value={filterColumns.user_id}
                            onChange={handleChange}
                        />
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">
                        <CFormInput
                           className='game-box  game-box-4 '
                            name="coin_id"
                            value={filterColumns.coin_id}
                            onChange={handleChange}
                        />
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
                ) : pendingBonusData?.data?.length === 0 && isFetching === false ? (
                    <CTableDataCell>No data found</CTableDataCell>
                ) : (
                    pendingBonusData?.data?.map((bonus, index) => {
                        return (
                            <CTableRow key={index} className="text-center">
                                <CTableDataCell>{bonus.created_at}</CTableDataCell>
                                <CTableDataCell>{bonus.uniqueID} </CTableDataCell>
                                <CTableDataCell>{bonus.coin}</CTableDataCell>
                                <CTableDataCell>{bonus.bonus_amount}</CTableDataCell>
                                <CTableDataCell>{bonus.description}</CTableDataCell>
                            </CTableRow>
                        );
                    })
                )}
            </CTableBody>
        </CTable>
    )
}
export default PendingBonus