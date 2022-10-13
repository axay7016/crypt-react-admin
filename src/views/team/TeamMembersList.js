import React, { useEffect, useState } from 'react'
import { CFormInput, CFormSelect, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import ClearDate from 'src/components/ClearDate';
import ColumnHeader from 'src/components/table/ColumnHeader';
import Loader from 'src/components/Loader';
import { useLazyGetTeamMembersQuery } from 'src/servicesRtkQuery/menusApi';
import PaginatedItems from 'src/components/table/PaginatedItems';
import { filterTableData } from 'src/components/table/filterTableData';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
const _ = require('lodash');

const TeamMembers = () => {
    const navigate = useNavigate();

    const headerCells = ['Action', 'Date', 'Unique ID', 'Name', 'Email', 'Mobile', 'Status']
    const statuses = ['', 'Active', 'Inactive', 'Blocked']
    const [filterColumns, setFilterColumns] = useState({
        created_at: '',
        unique_id: '',
        name: "",
        email: "",
        mobile_number: "",
        status: '',
    })

    let teamMembersData = []
    const [trigger, result] = useLazyGetTeamMembersQuery()
    const { isSuccess, isLoading, isFetching } = result

    if (isSuccess) {
        teamMembersData = result.data.results
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
    const handleUpdateTeamMember = (event) => {
        const data = teamMembersData.data.find(teamMember => teamMember.id === +event.currentTarget.id)
        navigate("/teams/update-team-member", { state: data });
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
                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                            <ClearDate onClick={() => {
                                setFilterColumns({ ...filterColumns, created_at: '' })
                            }} />
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
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        (isFetching || isLoading) ? <Loader /> :
                            (teamMembersData?.data?.length === 0 && isFetching === false) ?
                                <CTableDataCell>No data found</CTableDataCell> :
                                isSuccess &&
                                teamMembersData?.data?.map((teamMember, index) => {
                                    return (
                                        <CTableRow key={index}>
                                            <CTableDataCell role="button" className='cursor-pointer'>
                                                <CIcon size="lg" className='text-primary' icon={cilPencil}
                                                    id={teamMember.id} onClick={handleUpdateTeamMember} />
                                            </CTableDataCell>
                                            <CTableDataCell >{teamMember.created_at}</CTableDataCell>
                                            <CTableDataCell>{teamMember.unique_id}</CTableDataCell>
                                            <CTableDataCell>{teamMember.name}</CTableDataCell>
                                            <CTableDataCell>{teamMember.email}</CTableDataCell>
                                            <CTableDataCell>{teamMember.mobile_number}</CTableDataCell>
                                            <CTableDataCell>
                                                {
                                                    teamMember.status === 0 ? 'Inactive' :
                                                        teamMember.status === 1 ? 'Active' :
                                                            teamMember.status === 2 ? 'Blocked' : 'Unknow status'

                                                }
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
                    total={teamMembersData.total}
                    items={teamMembersData.data}
                    itemsPerPage={10}
                    handlePageClick={handlePageClick}
                />
            }
        </>
    )
}

export default TeamMembers