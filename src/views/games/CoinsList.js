import React from 'react'
import { CAlert, CTable, CTableBody, CTableDataCell, CTableHead, CTableRow } from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { useNavigate } from "react-router-dom";
import { useGetCoinQuery } from 'src/servicesRtkQuery/gamesMenuApi';
import Loader from 'src/components/Loader';
import ColumnHeader from 'src/components/table/ColumnHeader';
const CoinsList = () => {
    const navigate = useNavigate();

    const headerCells = ['Action', 'Date', 'Coin', 'Min Stake', 'Max Stake', 'Min Range', 'Max Range', 'Status'];
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetCoinQuery()

    let coins = []
    if (isSuccess) {
        coins = data?.results
    }

    const handleCoinEdit = (event) => {
        const data = coins?.find(coin => coin.id === +event.currentTarget.id)
        navigate("/edit-coin", { state: data });
    }
    return (
        <>
            {
                isLoading ? <Loader /> :
                    isError ? <CAlert color="danger">{error}</CAlert> :
                        isSuccess &&
                        <CTable>
                            <CTableHead className='tb'>
                                <CTableRow>
                                    <ColumnHeader headerCells={headerCells} />
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {
                                    coins?.map((coin, index) => {
                                        return (
                                            <CTableRow key={index} >
                                                <CTableDataCell  >
                                                    <CIcon role={'button'} className='cursor-pointer text-primary' size="lg" icon={cilPencil} id={coin.id} onClick={handleCoinEdit} />
                                                </CTableDataCell>
                                                <CTableDataCell >{coin.created_at}</CTableDataCell>
                                                <CTableDataCell >{coin.coin}</CTableDataCell>
                                                <CTableDataCell >{coin.min_stake}</CTableDataCell>
                                                <CTableDataCell >{coin.max_stake}</CTableDataCell>
                                                <CTableDataCell >{coin.min_range}</CTableDataCell>
                                                <CTableDataCell >{coin.max_range}</CTableDataCell>
                                                <CTableDataCell >{coin.status === 1 ? 'active' : 'inactive'}</CTableDataCell>
                                            </CTableRow>
                                        )
                                    })
                                }

                            </CTableBody>
                        </CTable>
            }
        </>
    )
}
export default CoinsList