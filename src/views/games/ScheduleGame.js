import React, { useEffect, useState, } from 'react'
import { CAlert, CButton, CModal, CModalBody, CModalFooter, CTable, CTableBody, CTableDataCell, CTableHead, CTableRow } from '@coreui/react'
import { Button } from '@mui/material';
import { useDeleteScheduleGameMutation, useGetScheduleGamesQuery } from 'src/servicesRtkQuery/gamesMenuApi';
import ColumnHeader from 'src/components/table/ColumnHeader';
import Loader from 'src/components/Loader';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
const ScheduleGame = () => {
    const headerCells = ['Action', 'Coin', 'Duration (in hrs)', 'Last Created', 'Initially Created']
    const {
        data,
        isSuccess,
        isLoading,
        isFetching
    } = useGetScheduleGamesQuery()
    let scheduleGames = []
    if (isSuccess) {
        scheduleGames = data.results
    }

    const [deleteScheduleGame] = useDeleteScheduleGameMutation()


    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    const [coinId, setCoinId] = useState('');

    function handleDeleteIcon(event) {
        setCoinId(event.currentTarget.id)
    }
    useEffect(() => {
        setShowConfirmDeleteModal(true)
    }, [showConfirmDeleteModal])

    return (
        <>
            <CTable>
                <CTableHead>
                    <CTableRow>
                        <ColumnHeader headerCells={headerCells} />
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {
                        (isLoading || isFetching) ? <Loader />
                            : (scheduleGames?.length === 0 && isLoading === false) ?
                                <CAlert color="warning">No data found</CAlert>
                                :
                                isSuccess &&
                                scheduleGames?.map((scheduleGame) => {
                                    return (
                                        <CTableRow key={scheduleGame.id} >
                                            <CTableDataCell>
                                                <DeleteOutlineIcon color='primary' role="button" onClick={handleDeleteIcon} id={scheduleGame.id} />
                                            </CTableDataCell>
                                            <CTableDataCell >{scheduleGame.coin}</CTableDataCell>
                                            <CTableDataCell >{`${scheduleGame.duration}${scheduleGame.duration == 30 ? ' mins' : ' hrs'} `}</CTableDataCell>
                                            <CTableDataCell >{scheduleGame.last_started_time}</CTableDataCell>
                                            <CTableDataCell >{scheduleGame.created_at}</CTableDataCell>
                                        </CTableRow>
                                    )
                                })
                    }
                </CTableBody>
            </CTable>
            {
                setShowConfirmDeleteModal && coinId &&
                <CModal visible={showConfirmDeleteModal} onClose={() => setShowConfirmDeleteModal(false)}>
                    <CModalBody>
                        {`Do you want to delete a selected game?`}
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => {
                            setCoinId('')
                            setShowConfirmDeleteModal(false)
                        }}
                        >
                            No
                        </CButton>
                        <CButton color="primary"
                            onClick={() => {
                                deleteScheduleGame(coinId)
                                setShowConfirmDeleteModal(false)
                                setCoinId('')
                            }}
                        >Yes, Delete it</CButton>
                    </CModalFooter>
                </CModal>
            }

        </>
    )
}
export default ScheduleGame
