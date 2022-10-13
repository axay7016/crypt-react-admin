import { CAlert, CButton, CCol, CFormInput, CFormLabel, CModal, CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import Loader from 'src/components/Loader';
import ColumnHeader from 'src/components/table/ColumnHeader'
import { useLazyGetDeclareGameQuery, useLazySetDeclareGameQuery } from 'src/servicesRtkQuery/gamesMenuApi';

const DeclareGame = () => {
  const { state } = useLocation();

  const headerCells = ['Stake', 'Payout']
  const headerCellAboveMidLow = ['Coins', 'Above', 'Mid', 'Low']

  const [price, setPrice] = useState("")

  let data = []
  const [trigger, result] = useLazyGetDeclareGameQuery()
  const { isSuccess, isLoading, isFetching } = result
  if (isSuccess) {
    data = result.data.results
  }

  useEffect(() => {
    trigger({ gameId: state.gameId, current_price: "" })

  }, [])

  useEffect(() => {
    if (isSuccess && isFetching === false) {
      setPrice(data.current_price)
    }
  }, [isSuccess, isFetching])


  const handleChange = (e) => {
    setPrice(e.target.value)
  }
  const handleChangePrice = (e) => {
    setPriceNotAvailable(false)
    trigger({ gameId: state.gameId, current_price: price })
  }

  //declared game code
  const [showDeclaredGameModal, setShowDeclaredGameModal] = useState(false)

  const [priceNotAvailable, setPriceNotAvailable] = useState(false)
  const [triggerDeclaredGame, resultDeclaredGame] = useLazySetDeclareGameQuery()
  const { isSuccess: isSuccessDeclaredGame,
    isLoading: isLoadingDeclaredGame, isFetching: isFetchingDeclaredGame } = resultDeclaredGame


  const handleDeclaredGame = (e) => {
    triggerDeclaredGame(state.gameId)
  }

  useEffect(() => {
    if (isSuccessDeclaredGame && !isFetchingDeclaredGame) {
      if (resultDeclaredGame?.data == 'Price is not available') {
        setPriceNotAvailable(true)
      } else {
        setPriceNotAvailable(false)
        setShowDeclaredGameModal(true)
        trigger({ gameId: state.gameId, current_price: "" })
        setTimeout(() => { setShowDeclaredGameModal(false) }, 3000)
      }
    }

  }, [isSuccessDeclaredGame, isFetchingDeclaredGame])
  return (
    <>
      {
        isLoading || isFetching ? <Loader /> :
          isSuccess &&
          <>
            <div className='  s-1  ss-1'>
              <div className='section-1'>
                <div>
                  <div className='d-flex align-items-center  gap-3'>
                    <span>{` Game ID : ${data?.game_id} , Game Name : ${data?.coin_name}`}</span>

                    {
                      (data?.game_status === 'Ended') && (isFetchingDeclaredGame ? <Loader /> : <CButton color="primary" disabled={!price} onClick={handleDeclaredGame}>Declare game</CButton>)
                    }
                    {
                      priceNotAvailable && <CAlert color="danger">Please set price first</CAlert>
                    }
                  </div>
                </div>
                <CRow className="g-3 justify-content-center ">
                  <CCol xs="auto">
                    <CFormLabel className="col-form-label">
                      {
                        data?.game_status === 'Ended' ? `Price at a time of Game end - ${data?.coin_name}` :
                          `Current price - ${data?.coin_name} :`
                      }

                    </CFormLabel>
                  </CCol>
                  <CCol xs="auto">
                    {
                      data?.game_status === 'Ended' ?
                        <CFormInput
                          type="text"
                          value={price}
                          onChange={handleChange}
                          className="mt-2 "
                        /> :
                        <CFormLabel className="col-form-label">
                          {`${data?.current_price}`}
                        </CFormLabel>
                    }
                  </CCol>
                  <CCol xs="auto" >
                    {
                      data?.game_status === 'Ended' && <CButton color="primary" className='mt-2' disabled={!price} onClick={handleChangePrice}>Set price</CButton>
                    }
                  </CCol>
                </CRow>
              </div>
              <div >
                <CTable >
                  <CTableHead className='tb'>
                    <CTableRow>
                      <ColumnHeader headerCells={headerCellAboveMidLow} />
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {
                      Object?.keys(data?.total_bid_coinwise)?.map((key) => data?.total_bid_coinwise[key])?.map((tbc) => {
                        return (
                          <CTableRow key={tbc.coin_id} >
                            <CTableDataCell >{tbc.name}</CTableDataCell>
                            <CTableDataCell >{tbc.high_total}</CTableDataCell>
                            <CTableDataCell >{tbc.mid_total}</CTableDataCell>
                            <CTableDataCell >{tbc.low_total}</CTableDataCell>
                          </CTableRow>
                        )
                      })
                    }
                  </CTableBody>
                </CTable>
              </div>
            </div>
            <div className='mt-5  s-2   dc-game'>
              <div className='se-1'>
                <CTable color={`${data.winning_side === 'Above' && 'success'}`}>
                  <CTableHead className={`${data.winning_side === 'Above' ? '' : 'tb'}`}>
                    <CTableRow>
                      <CTableHeaderCell className='text-center ' scope="col" colSpan={3} >Above &nbsp;&nbsp; {data.high}</CTableHeaderCell>
                    </CTableRow>
                    <CTableRow>
                      <ColumnHeader headerCells={headerCells} />
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {
                      data.above_bids?.map((game, index) => {
                        return (
                          <CTableRow key={index} >
                            <CTableDataCell >{game.stake}</CTableDataCell>
                            <CTableDataCell >{game.payout}</CTableDataCell>
                          </CTableRow>
                        )
                      })
                    }
                  </CTableBody>
                </CTable>
              </div>
              <div className='se-1'>
                <CTable color={`${data.winning_side === 'Mid' && 'success'}`}>
                  <CTableHead className={`${data.winning_side === 'Mid' ? '' : 'tb'}`}>
                    <CTableRow>
                      <CTableHeaderCell className='text-center' scope="col" colSpan={3} >Mid &nbsp;&nbsp; {data.mid_range}</CTableHeaderCell>
                    </CTableRow>
                    <CTableRow>
                      <ColumnHeader headerCells={headerCells} />
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {
                      data.mid_bids?.map((game, index) => {
                        return (
                          <CTableRow key={index} >

                            <CTableDataCell >{game.stake}</CTableDataCell>
                            <CTableDataCell >{game.payout}</CTableDataCell>

                          </CTableRow>
                        )
                      })
                    }
                  </CTableBody>
                </CTable>
              </div>
              <div className='se-1'>
                <CTable color={`${data.winning_side === 'Low' && 'success'}`}>
                  <CTableHead className={`${data.winning_side === 'Low' ? '' : 'tb'}`}>
                    <CTableRow>
                      <CTableHeaderCell className='text-center' scope="col" colSpan={3} >Low &nbsp;&nbsp; {data.low}</CTableHeaderCell>
                    </CTableRow>
                    <CTableRow>
                      <ColumnHeader headerCells={headerCells} />
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {
                      data.low_bids?.map((game, index) => {
                        return (
                          <CTableRow key={index} >

                            <CTableDataCell >{game.stake}</CTableDataCell>
                            <CTableDataCell >{game.payout}</CTableDataCell>

                          </CTableRow>
                        )
                      })
                    }
                  </CTableBody>
                </CTable>
              </div>
            </div>
          </>
      }
      <CModal visible={showDeclaredGameModal}>
        <CAlert color='success' >Game declared successfully</CAlert>
      </CModal>
    </>
  )
}

export default DeclareGame