import { CTableHeaderCell } from '@coreui/react'
import React, { useMemo } from 'react'

const ColumnHeader = ({ headerCells }) => {
  const headerCellsMemo = useMemo(() => {
    return (
      headerCells.map((cell, index) => {
        return (
          <CTableHeaderCell scope="col" key={index}>
            {cell}
          </CTableHeaderCell>
        )
      })
    )
  }, [headerCells])
  return headerCellsMemo
}
export default ColumnHeader

