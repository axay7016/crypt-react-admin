import { CAlert, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import React, { useMemo } from 'react'
import Loader from 'src/components/Loader'
import PaginatedItems from 'src/components/table/PaginatedItems'
import { useLazyGetNotificationsQuery } from 'src/servicesRtkQuery/menusApi'
const _ = require('lodash');

const Notification = () => {
    const [trigger, result] = useLazyGetNotificationsQuery()
    const { isSuccess, isLoading, isFetching } = result
    let notificationData = []
    if (isSuccess) {
        notificationData = result.data.results
    }
    useMemo(() => {
        trigger()
    }, [])

    const handlePageClick = (event) => {
        const pageNumber = event.selected + 1;
        trigger(pageNumber)
    };
    return (
        <>
            {
                (isFetching || isLoading) ? <Loader />
                    : (notificationData?.data?.length === 0 && isFetching === false) ?
                        <CAlert color="warning">No data found</CAlert>
                        :
                        (isSuccess && notificationData?.data?.length > 0) &&
                        <>
                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Date and Time</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {
                                        notificationData?.data?.map((notification, index) => {
                                            return (
                                                <CTableRow key={index} >
                                                    <CTableDataCell >{notification.title}</CTableDataCell>
                                                    <CTableDataCell >{notification.created_at}</CTableDataCell>
                                                </CTableRow>
                                            )
                                        })
                                    }
                                </CTableBody>
                            </CTable>
                        </>
            }
            <PaginatedItems
                total={notificationData.total}
                items={notificationData.data}
                itemsPerPage={10}
                handlePageClick={handlePageClick}
            />
        </>
    )
}

export default Notification