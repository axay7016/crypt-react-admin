import { cilPencil } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CAlert, CTable, CTableBody, CTableDataCell, CTableHead, CTableRow } from '@coreui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from 'src/components/Loader'
import ColumnHeader from 'src/components/table/ColumnHeader'
import { useGetCouponQuery } from 'src/servicesRtkQuery/gamesMenuApi'

const CouponListing = () => {
    const navigate = useNavigate();


    const headerCells = ['Name', 'Code', 'Amount', 'Start Date', 'End Date', 'Usage', 'Status', 'Created At', 'Action'];
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetCouponQuery()

    let coupons = []
    if (isSuccess) {
        coupons = data.results.data
    }
    const handleCouponEdit = (event) => {
        const data = coupons.find(coupon => coupon.id === +event.currentTarget.id)
        navigate("/coupons/update-coupon", { state: data });
    }
    return (
        <>

            {
                isLoading ? <Loader /> :
                    isError ? <CAlert color="danger">{error}</CAlert> :
                        isSuccess &&
                        <CTable>
                            <CTableHead>
                                <CTableRow>
                                    <ColumnHeader headerCells={headerCells} />
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {

                                    coupons.map((coupon) => {
                                        return (
                                            <CTableRow key={coupon.id} >

                                                <CTableDataCell >{coupon.name}</CTableDataCell>
                                                <CTableDataCell >{coupon.code}</CTableDataCell>
                                                <CTableDataCell >{coupon.amount}</CTableDataCell>
                                                <CTableDataCell >{coupon.start_date}</CTableDataCell>
                                                <CTableDataCell >{coupon.end_date}</CTableDataCell>
                                                <CTableDataCell >{coupon.total_usage}</CTableDataCell>
                                                <CTableDataCell >{coupon.status === 1 ? 'active' : 'inactive'}</CTableDataCell>
                                                <CTableDataCell >{coupon.created_at}</CTableDataCell>

                                                <CTableDataCell  >
                                                    <CIcon role={'button'} className='cursor-pointer text-primary' size="lg"
                                                        icon={cilPencil} id={coupon.id} onClick={handleCouponEdit} />
                                                </CTableDataCell>
                                            </CTableRow>
                                        )
                                    })}
                            </CTableBody>
                        </CTable>
            }
        </>
    )
}

export default CouponListing

// - {{base_url}}/admin/coupon   post
//  {
//     "name": "coin3",
//     "code": "coin34567",
//     "amount": "78.369",
//     "start_date": "2022-07-15 16:08:26",
//     "end_date": "2022-07-18 16:08:26",
//     "total_usage": "10",
//     "partner_url": "365",
//     "status": "1"
//  }

//  -{{base_url}}/admin/coupon  get

//  -{{base_url}}/admin/coupon/1  put 
//  {
//     "name": "coinfirst",
//     "code": "coin34567",
//     "amount": "78.369",
//     "start_date": "2022-07-15 16:08:26",
//     "end_date": "2022-07-18 16:08:26",
//     "total_usage": "10",
//     "partner_url": "365",
//     "status": "1"
// }


// get Response
//   {
    //     "id": 3,
    //     "name": "coin3",----
    //     "code": "coin34567",-------
    //     "amount": "78.37",withcoin-------
    //     "start_date": "15 Jul 2022 12:00AM",---------
    //     "end_date": "18 Jul 2022 12:00AM",----------------
    //     "total_usage": 10,------Usage (NO of USe/total usage)
    //     "no_of_usage": null,------
    //     "partner_url": 365,
    //     "is_first_time_deposit_bonus": null,
    //     "status": 1, ------------1 for active and 0 for inactive
    //     "created_at": "10 Aug 2022 6:27AM",--------
    //     "updated_at": "10 Aug 2022 6:27AM"
    // }


// name 
// code 
// amount ...coin Dropdown
// start_date
// end_date
// partner URL
// total usage
// "is_first_time_deposit_bonus checkbox 
// status dropdown inactive active[[radioClasses]]

