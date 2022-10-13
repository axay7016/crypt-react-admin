
import React, { useEffect, } from 'react'
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetCurrentPricesQuery } from 'src/servicesRtkQuery/gamesMenuApi';
import { priceLogWebSocket, priceLogWebSocketClose } from 'src/utils/webSocket';
import ColumnHeader from 'src/components/table/ColumnHeader';
import Loader from 'src/components/Loader';

const CurrentPricesListing = () => {

    const headerCells = ['Coin', 'Current Price', 'Created At', 'Updated At']
    let navigate = useNavigate();
    useEffect(() => {
        priceLogWebSocket()
        return () => {
            priceLogWebSocketClose()
        }
    }, [])
    const webSocketData = useSelector((state) => state.webSocketGameReducer.gameDataSocket)
    const {
        data,
        isSuccess,
        isLoading,
        isError,
        error,
    } = useGetCurrentPricesQuery()
    let currentPrices = []
    if (isSuccess) {
        currentPrices = data?.results
    }


    const handleClickCoin = (event) => {
        const state = {
            coin_id: event.currentTarget.id,
            coin_name: event.target.innerText
        }
        navigate("/games/coin-logs", { state: state });
    }

    return (
        <CTable>
            <CTableHead>
                <CTableRow>
                    <ColumnHeader headerCells={headerCells} />
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {
                    isLoading && <Loader />
                }
                {
                    isError && <div>{error.data.message}</div>
                }
                {
                    isSuccess &&
                    currentPrices?.map((currentPrice, index) => {
                        let price_data = webSocketData?.data?.filter((item) => item.coin_id === currentPrice.coin_id);
                        price_data = price_data && price_data[0] ? price_data[0] : [];
                        return (
                            <CTableRow key={index} >
                                <CTableDataCell role="button" className='cursor-pointer text-primary'
                                    onClick={handleClickCoin}
                                    id={currentPrice.coin_id}
                                >
                                    {currentPrice.coin}</CTableDataCell>
                                <CTableDataCell  >{price_data.price ? price_data.price : currentPrice.current_price}</CTableDataCell>
                                {/* <CTableDataCell >{price_data.high ? price_data.high : currentPrice.high}</CTableDataCell>
                                <CTableDataCell >{price_data.low ? price_data.low : currentPrice.low}</CTableDataCell> */}
                                <CTableDataCell >{currentPrice.created_at}</CTableDataCell>
                                <CTableDataCell >{currentPrice.updated_at}</CTableDataCell>
                            </CTableRow>
                        )
                    })
                }
            </CTableBody>
        </CTable>
    )
}
export default CurrentPricesListing
