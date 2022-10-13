import '../../scss/style.scss'
import { CAlert, CButton, CFormCheck, CFormInput, CFormSelect, CModal, CModalFooter, CModalHeader, CModalTitle, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import ClearDate from 'src/components/ClearDate'
import PaginatedItems from 'src/components/table/PaginatedItems'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useGetCoinQuery, useLazyGetGamesQuery, useUpdateGameStatusMutation } from 'src/servicesRtkQuery/gamesMenuApi'
import ColumnHeader from 'src/components/table/ColumnHeader'
import { filterTableData } from 'src/components/table/filterTableData'
import Loader from 'src/components/Loader'
import { useNavigate } from 'react-router-dom'
const _ = require('lodash');

const GamesListing = () => {
  const navigate = useNavigate();


  // columns headers
  const headerCells = ['Select', 'Game', 'Coin', 'Total High', 'Total Mid', 'Total Low', 'Mid Range', 'Winning',
    'Game End', 'Duration', 'Status', 'Coin Price', 'Start Time', 'High Price',
    'Low Price', 'Action']

  // setting coins in coins dropdown by using useGetCoinQuery
  const {
    data,
    isSuccess,
    isError,
  } = useGetCoinQuery()
  let coins = []
  if (isSuccess) {
    // taking single coin name from coin object and pushing it to coins array
    coins = [...new Set(data.results.map(coin => coin.coin))]
  }

  // filter columns
  const [filterColumns, setFilterColumns] = useState({
    game_unique_id: '',
    coin: "",
    status: "",
    duration: "",
    end_time: "",
    start_time: '',
    created_at: "",
  })

  // setting games in games dropdown by using useLazyGetGamesQuery

  let gameListingData = []
  const [trigger, result] = useLazyGetGamesQuery()
  const { isSuccess: isSuccessGame, isLoading: isLoadingGame, isFetching: isFetchingGame } = result

  if (isSuccessGame) {
    gameListingData = result.data.results
  }
  // handle change method for filters
  const handleChange = ((event) => {
    const { name, value } = event.target;
    setFilterColumns({ ...filterColumns, [name]: value })

  })

  useEffect(() => {
    const search = setTimeout(() => {
      (async function () {
        let fc = filterColumns;
        if (filterColumns.end_time !== '') {
          const value = filterColumns.end_time.replace(/T/g, ' ').concat(':00')
          fc = { ...filterColumns, end_time: value }
        }
        if (filterColumns.start_time !== '') {
          const value = filterColumns.start_time.replace(/T/g, ' ').concat(':00')
          fc = { ...filterColumns, start_time: value }
        }
        if (filterColumns.created_at !== '') {
          const value = filterColumns.created_at.slice(0, 10)
          fc = { ...filterColumns, created_at: value }
        }
        filterTableData(trigger, fc)
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

  // when user click on check box
  const [checkedCheckboxes, setCheckedCheckboxes] = useState([]);
  const handleCheckBox = (event) => {
    const { id, checked } = event.target;
    if (checked === true) {
      setCheckedCheckboxes([...checkedCheckboxes, id])
    } else {
      setCheckedCheckboxes(checkedCheckboxes.filter(item => item !== id))
    }
  }

  // when user click on select dropdown value
  const [showChangeGameStatusModal, setShowChangeGameStatusModal] = useState(false)
  const [statusId, setStatusId] = useState()
  const handleChangeStatus = (event) => {
    setStatusId(event.target.value)
    if (checkedCheckboxes.length > 0 && event.target.value !== '') {
      setShowChangeGameStatusModal(!showChangeGameStatusModal)
    }
  }

  const [showStatusChangeSuccessModal, setShowStatusChangeSuccessModal] = useState(false)
  const handleModalCloseButton = () => {
    document.getElementsByName('checkbox').forEach(el => el.checked = false)
    document.getElementsByName('changeGameStatus')[0].value = ''
    setCheckedCheckboxes([])
    setShowChangeGameStatusModal(false)
  }

  const [updateCoin, { isError: isErrorUpdateGameStatus }] = useUpdateGameStatusMutation()

  const handleSaveChangesButton = async () => {

    const data = {
      status: statusId,
      id: checkedCheckboxes
    }
    updateCoin(data)
    setShowChangeGameStatusModal(false)
    setShowStatusChangeSuccessModal(true)
    setCheckedCheckboxes([])
    document.getElementsByName('checkbox').forEach(el => el.checked = false)
    document.getElementsByName('changeGameStatus')[0].value = ''
  }
  if (isErrorUpdateGameStatus) {
    alert('Error')
  }

  const handleDeclaredGame = (event) => {
    if (event.currentTarget.id) {
      const singleGame = gameListingData?.data?.find(game => +game.id === +event.currentTarget.id)
      const data = { gameId: singleGame.id, coinName: singleGame.coin }
      navigate("/games/declare-game", { state: data });
    }
  }
  return (
    <>
      <CTable >
        <CTableHead>
          <CTableRow className='tb'>
            <ColumnHeader headerCells={headerCells} />
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="col" className=''>
              <CFormSelect
                name='changeGameStatus'
                onChange={handleChangeStatus}
                disabled={checkedCheckboxes.length > 0 ? false : true}
              >
                <option value=''></option>
                <option value='1'>Restart</option>
                <option value='2'>Pause</option>
                <option value='5'>End</option>

              </CFormSelect>
            </CTableHeaderCell>


            {/* game_unique_id */}
            <CTableHeaderCell scope="col" >
              <CFormInput
                name='game_unique_id'
                value={filterColumns.game_unique_id}
                onChange={handleChange}
              />
            </CTableHeaderCell>

            <CTableHeaderCell scope="col" >
              <CFormSelect
                className='coin-select-1'
                name="coin"
                onChange={handleChange}
              >
                <option>{''}</option>
                {
                  isError && <option>{'Error'}</option>
                }
                {
                  isSuccess &&
                  coins.map((uniqueCoin, index) => {
                    return (
                      <option key={index}>{uniqueCoin}</option>
                    )
                  })
                }
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
            <CTableHeaderCell scope="col">
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
            <CFormSelect
                className='run-value-1'
                name='duration'
                onChange={handleChange}
              >
                <option value={""}></option>
                <option value={30}>30</option>
                <option value={2}>2</option>
                <option value={6}>6</option>
                <option value={24}>24</option>
              </CFormSelect>
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
              <CFormSelect
                className='run-value-1'
                name='status'
                onChange={handleChange}
              >
                <option value={""}></option>
                <option value={1}>Running</option>
                <option value={2}>Paused</option>
                <option value={5}>Ended</option>
                <option value={6}>Declared</option>
              </CFormSelect>
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
            </CTableHeaderCell>

            {/* start Time */}
            <CTableHeaderCell scope="col">
              <ClearDate onClick={() => {
                setFilterColumns({ ...filterColumns, start_time: '' })
              }} />
              <CFormInput
                value={filterColumns.start_time}
                name="start_time"
                onChange={handleChange}
                type="datetime-local"
              />
            </CTableHeaderCell>

            <CTableHeaderCell scope="col">
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
            </CTableHeaderCell>
            <CTableHeaderCell scope="col">
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        {
          (isFetchingGame || isLoadingGame) ? <Loader />
            : (gameListingData?.data?.length === 0 && isFetchingGame === false) ?
              <CAlert color="warning">No data found</CAlert>
              :
              isSuccess &&
              isSuccessGame &&
              <CTableBody>
                {

                  gameListingData?.data?.map((game, index) => {
                    return (
                      <CTableRow key={index}>
                        <CTableDataCell className=' justify-content-center ' >
                          <CFormCheck id={game.id.toString()} name="checkbox" onClick={handleCheckBox} role="button" className='cursor-pointer' />
                        </CTableDataCell>

                        <CTableDataCell>{game.game_unique_id}</CTableDataCell>
                        <CTableDataCell>{game.coin}</CTableDataCell>
                        <CTableDataCell>{game.total_bid_amount_on_high_side_coin_wise}</CTableDataCell>
                        <CTableDataCell>{game.total_bid_amount_on_mid_side_coin_wise}</CTableDataCell>
                        <CTableDataCell>{game.total_bid_amount_on_low_side_coin_wise}</CTableDataCell>

                        <CTableDataCell>{`${game.low_range} - ${game.high_range}`}</CTableDataCell>
                        <CTableDataCell>{game.winning_side}</CTableDataCell>
                        <CTableDataCell>{game.price_at_time_of_game_end}</CTableDataCell>
                        <CTableDataCell>{game.duration}</CTableDataCell>

                        <CTableDataCell>
                          {
                            // 0 = yet_to_start, 1 = running, 2 = paused, 3 = stopped, 4 = waiting for results, 5 = ended, 6 = declared

                            game.status === 0 ? 'Yet to start' :
                              game.status === 1 ? 'Running' :
                                game.status === 2 ? 'Paused' :
                                  game.status === 3 ? 'Stopped' :
                                    game.status === 4 ? 'Waiting for result' :
                                      game.status === 5 ? 'Ended' :
                                        game.status === 6 ? 'Declared' : ""
                          }
                        </CTableDataCell>
                        <CTableDataCell>{game.price_at_time_of_game_start}</CTableDataCell>
                        <CTableDataCell>{game.start_time}</CTableDataCell>
                        <CTableDataCell>{game.high}</CTableDataCell>
                        <CTableDataCell>{game.low}</CTableDataCell>
                        <CTableDataCell >
                          <RemoveRedEyeIcon role={'button'} color={'primary'} onClick={handleDeclaredGame} id={game.id} />
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })
                }
              </CTableBody>
        }
      </CTable>
      {
        gameListingData?.data?.length > 0 &&
        <PaginatedItems
          total={gameListingData.total}
          items={gameListingData.data}
          itemsPerPage={10}
          handlePageClick={handlePageClick}
        />
      }

      <CModal visible={showChangeGameStatusModal} onClose={() => setShowChangeGameStatusModal(false)}>
        <CModalHeader>
          <CModalTitle>  {`Do you want to change status of  selected games?`}</CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton color="secondary" onClick={handleModalCloseButton}>Close</CButton>
          <CButton color="primary"
            onClick={handleSaveChangesButton}
          >Save changes</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={showStatusChangeSuccessModal} onClose={() => setShowStatusChangeSuccessModal(false)}>
        <CModalHeader>
          <CModalTitle>
            <CAlert color='success'>
              {`Status is changed successfully of selected games ${checkedCheckboxes}`}
            </CAlert>
          </CModalTitle>
        </CModalHeader>
      </CModal>
    </>
  )
}
export default GamesListing

