import React, { useEffect, useState } from 'react'
import '../../scss/style.scss'

import { CAlert, CButton, CFormCheck, CFormInput, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import AddIcon from '@mui/icons-material/Add';
import ClearDate from 'src/components/ClearDate';
import PaginatedItems from 'src/components/table/PaginatedItems';
import ColumnHeader from 'src/components/table/ColumnHeader';
import { useLazyGetUsersQuery, useUpdateUserMutation, useLazyGetExportUsersQuery } from 'src/servicesRtkQuery/menusApi';
import { filterTableData } from 'src/components/table/filterTableData';
import Loader from 'src/components/Loader';
import { ExportExcel } from "src/utils/ExportData";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
const _ = require('lodash');

const Users = () => {

    const headerCells = ['Select', 'Date', 'Unique ID', 'Name', 'Email', 'Mobile', 'Status']
    const [filterColumns, setFilterColumns] = useState({
        created_at: '',
        unique_id: '',
        name: "",
        email: "",
        mobile_number: "",
        status: '',
    })

    const [filterColumnsExport, setFilterColumnsExport] = useState({
        created_at: "",
        unique_id: "",
        name: "",
        email: "",
        mobile_number: "",
        status: "",
        limit: process.env.REACT_APP_EXPORT_LIMIT,
        page: 1,
    });

    let usersData = []
    const [trigger, result] = useLazyGetUsersQuery()
    const { isSuccess, isLoading, isFetching } = result

    if (isSuccess) {
        usersData = result.data.results
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
    // end of users listing ,filter and pagination


    const [statusId, setStatusId] = useState()
    const [checkedCheckboxes, setCheckedCheckboxes] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showStatusChangeSuccessModal, setShowStatusChangeSuccessModal] = useState(false)

    const handleCheckBox = (event) => {
        const { id, checked } = event.target;
        if (checked === true) {
            setCheckedCheckboxes([...checkedCheckboxes, id])
        } else {
            setCheckedCheckboxes(checkedCheckboxes.filter(item => item !== id))
        }
    }
    const handleChangeStatus = (event) => {
        setStatusId(event.target.value)
        if (checkedCheckboxes.length > 0 && event.target.value !== '') {
            setShowConfirmModal(!showConfirmModal)
        }
    }
    const [updateUser, { isError: isErrorUpdateUserStatus }]
        = useUpdateUserMutation()

    const handleSaveChangesButton = async () => {

        const data = {
            status: statusId,
            id: checkedCheckboxes
        }
        updateUser(data)
        setShowConfirmModal(false)
        setShowStatusChangeSuccessModal(true)
        setCheckedCheckboxes([])
        document.getElementsByName('checkbox').forEach(el => el.checked = false)
        document.getElementsByName('changeUserStatus')[0].value = ''
        trigger()
    }
    if (isErrorUpdateUserStatus) {
        alert('Error')
    }


    //export logic 
    const [BtnStatus, setBtnStatus] = useState(false);
    const [ProgressStatus, setProgressStatus] = useState(false);
    const [Progress, setProgress] = useState(0);
    const [triggerExport, resultExport] = useLazyGetExportUsersQuery();
    const { isSuccess: exportSuccess, isFetching: exportFetching } = resultExport;
    const [currentPage, setCurrentPage] = useState(0);
    const [exportUser, setExportUser] = useState([]);
    const [allUser, setAllUser] = useState([]);
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
        setExportUser([]);
        setAllUser([]);
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
            return ExportExcel(exportUser, process.env.REACT_APP_USER);
        }
    };

    useEffect(() => {
        if (
            resultExport?.data?.results?.current_page &&
            resultExport?.data?.results?.current_page != currentPage
        ) {
            if (exportSuccess && !exportFetching) {
                setCurrentPage(resultExport?.data?.results?.current_page);
                setExportUser(resultExport?.data?.results?.data);
            }
        }
    }, [exportSuccess, exportFetching]);

    useEffect(() => {
        setAllUser([...allUser, exportUser]);
    }, [exportUser]);

    useEffect(() => {
        if (resultExport?.data?.results?.last_page == currentPage && resultExport?.data?.results?.data?.length != 0 && resultExport?.data?.results?.last_page != 1) {
            setIsShowLoader(false);
            const result = allUser.reduce((r, e) => (r.push(...e), r), []);
            setBtnStatus(true);
            setProgressStatus(false);
            return ExportExcel(result, process.env.REACT_APP_USER);
        } else if (resultExport?.data?.results?.last_page == 1) {
            setBtnStatus(true);
            setProgressStatus(false);
        }
    }, [allUser]);

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
                    <ColumnHeader headerCells={headerCells} />
                    <CTableRow>
                        <CTableHeaderCell scope="col" className=''>
                            <CFormSelect
                                name='changeUserStatus'
                                onChange={handleChangeStatus}
                                disabled={checkedCheckboxes.length > 0 ? false : true}
                            >
                                <option value={''}></option>
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                                <option value={2}>Blocked</option>

                            </CFormSelect>

                        </CTableHeaderCell>
                        <CTableHeaderCell scope="col">
                            <ClearDate onClick={() => {
                                setFilterColumns({ ...filterColumns, created_at: '' })
                            }} />
                            <CFormInput
                                className=''
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
                                <option value={''}></option>
                                <option value={1}>Active</option>
                                <option value={0}>Inactive</option>
                                <option value={2}>Blocked</option>


                            </CFormSelect>
                        </CTableHeaderCell>

                    </CTableRow>
                </CTableHead>
                {
                    (isFetching || isLoading) ? <Loader />
                        : (usersData?.data?.length === 0 && isFetching === false) ?
                            <CAlert color="warning">No data found</CAlert>
                            :
                            (isSuccess && usersData?.data?.length > 0) &&
                            <CTableBody>
                                {
                                    usersData?.data?.map((user, index) => {
                                        return (
                                            <CTableRow key={index} className='text-center'>
                                                <CTableDataCell className=' justify-content-center '>
                                                    <CFormCheck id={user.id.toString()} name="checkbox" onClick={handleCheckBox} />
                                                </CTableDataCell>
                                                <CTableDataCell >{user.created_at}</CTableDataCell>
                                                <CTableDataCell>{user.unique_id}</CTableDataCell>
                                                <CTableDataCell>{user.name}</CTableDataCell>
                                                <CTableDataCell>{user.email}</CTableDataCell>
                                                <CTableDataCell>{user.mobile_number}</CTableDataCell>
                                                <CTableDataCell>
                                                    {
                                                        user.status === 0 ? 'Inactive' :
                                                            user.status === 1 ? 'Active' :
                                                                user.status === 2 ? 'Blocked' : 'Unknow status'

                                                    }

                                                </CTableDataCell>
                                            </CTableRow>
                                        )
                                    })}
                            </CTableBody>
                }
            </CTable>
            {
                <PaginatedItems
                    total={usersData.total}
                    items={usersData.data}
                    itemsPerPage={10}
                    handlePageClick={handlePageClick}
                />
            }
            <>
                <CModal visible={showConfirmModal} >
                    <CModalBody>
                        {`Do you want to change status of  selected users?`}
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => {
                            setCheckedCheckboxes([])
                            document.getElementsByName('checkbox').forEach(el => el.checked = false)
                            document.getElementsByName('changeUserStatus')[0].value = ''
                            setShowConfirmModal(false)
                        }}
                        >Close
                        </CButton>
                        <CButton color="primary"
                            onClick={handleSaveChangesButton}
                        >Save changes</CButton>
                    </CModalFooter>
                </CModal>

                <CModal visible={showStatusChangeSuccessModal} onClose={() => setShowStatusChangeSuccessModal(false)}>
                    <CModalHeader>
                        <CModalTitle>
                            <CAlert color='success'>
                                Status is changed successfully.
                            </CAlert>
                        </CModalTitle>
                    </CModalHeader>

                </CModal>

            </>
        </>
    )
}

export default Users