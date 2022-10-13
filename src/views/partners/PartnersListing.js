import { cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CFormInput, CFormSelect, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ClearDate from 'src/components/ClearDate';
import Loader from 'src/components/Loader';
import ColumnHeader from 'src/components/table/ColumnHeader';
import { filterTableData } from 'src/components/table/filterTableData';
import PaginatedItems from 'src/components/table/PaginatedItems';
import { useLazyGetPartnersQuery } from 'src/servicesRtkQuery/gamesMenuApi';
const _ = require('lodash');

const PartnersListing = () => {
    const navigate = useNavigate();

    const headerCells = ['Date', 'Unique Id', 'Name', 'Email', 'Mobile Number', 'Status', 'Action'];
    const statuses = ['', 'Active', 'Inactive', 'Blocked']

    const [filterColumns, setFilterColumns] = useState({
        created_at: '',
        unique_id: '',
        name: "",
        email: "",
        mobile_number: "",
        status: '',
    })

    let partnersData = []
    const [trigger, result] = useLazyGetPartnersQuery()
    const { isSuccess, isLoading, isFetching } = result

    if (isSuccess) {
        partnersData = result.data.results
    }
    const handleChange = (e) => {
        setFilterColumns({
            ...filterColumns,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        const search = setTimeout(() => {
            (async function () {
                let status = filterColumns.status
                status = status === 'Active' ? '1' : status === 'Inactive' ? '0' : status === 'Blocked' ? '2' : ''
                const payload = {
                    ...filterColumns,
                    status: status
                }
                await filterTableData(trigger, payload)
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
    const handleUpdatePartner = (event) => {
        const data = partnersData.data.find(partner => partner.id === +event.currentTarget.id)
        navigate("/partners/update-partner", { state: data });
    }
    return (
        <>
            <CTable>
                <CTableHead>
                    <CTableRow>
                        <ColumnHeader headerCells={headerCells} />
                    </CTableRow>
                    <CTableRow>

                        <CTableHeaderCell scope="col">
                            <ClearDate onClick={() => {
                                setFilterColumns({ ...filterColumns, created_at: '' })
                            }} />
                            <CFormInput
                                className='date-box'
                                value={filterColumns.created_at}
                                name="created_at"
                                onChange={handleChange}
                                type="date"
                            />
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                            <CFormInput
                              className='game-box'
                                value={filterColumns.unique_id}
                                name="unique_id"
                                onChange={handleChange}
                                type="text"
                            />
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                            <CFormInput
                                value={filterColumns.name}
                                name="name"
                                onChange={handleChange}
                                type="text"
                            />
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                            <CFormInput
                                value={filterColumns.email}
                                name="email"
                                onChange={handleChange}
                                type="text"
                            />
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                            <CFormInput
                                value={filterColumns.mobile_number}
                                name="mobile_number"
                                onChange={handleChange}
                                type="text"
                            />
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                            <CFormSelect
                                name='status'
                                onChange={handleChange}
                            >
                                {
                                    statuses.map((status, index) => {
                                        return (
                                            <option key={index}>{status}</option>
                                        )
                                    })
                                }
                            </CFormSelect>
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col" ></CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        (isFetching || isLoading) ? <Loader /> :
                            (partnersData?.data?.length === 0 && isFetching === false) ?
                                <CTableDataCell>No data found</CTableDataCell> :
                                isSuccess &&
                                partnersData?.data?.map((partner, index) => {
                                    return (
                                        <CTableRow key={index}>

                                            <CTableDataCell >{partner.created_at}</CTableDataCell>
                                            <CTableDataCell>{partner.unique_id}</CTableDataCell>
                                            <CTableDataCell>{partner.name}</CTableDataCell>
                                            <CTableDataCell>{partner.email}</CTableDataCell>
                                            <CTableDataCell>{partner.mobile_number}</CTableDataCell>
                                            <CTableDataCell>
                                                {
                                                    partner.status === 0 ? 'Inactive' :
                                                        partner.status === 1 ? 'Active' :
                                                            partner.status === 2 ? 'Blocked' : 'Unknow status'

                                                }
                                            </CTableDataCell>
                                            <CTableDataCell role="button" className='cursor-pointer'>
                                                <CIcon size="lg" className='text-primary' icon={cilPencil}
                                                    id={partner.id} onClick={handleUpdatePartner} />
                                            </CTableDataCell>
                                        </CTableRow>
                                    )
                                })
                    }

                </CTableBody>
            </CTable>
            {
                isSuccess > 0 &&
                <PaginatedItems
                    total={partnersData.total}
                    items={partnersData.data}
                    itemsPerPage={10}
                    handlePageClick={handlePageClick}
                />
            }
        </>
    )
}

export default PartnersListing