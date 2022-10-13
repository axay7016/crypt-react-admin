import { CSpinner } from '@coreui/react'
import React from 'react'

const Loader = ({color = "primary"}) => {
    return (
        <CSpinner color={color} />
    )
}

export default Loader