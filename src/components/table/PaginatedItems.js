import React from 'react'
import ReactPaginate from 'react-paginate';

const PaginatedItems = ({ total, itemsPerPage, handlePageClick }) => {
    return (
        <>
            {
                total > 0 &&
                <ReactPaginate
                    breakLabel="..."
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={Math.ceil(total / itemsPerPage)}
                    renderOnZeroPageCount={null}
                    className=" customePagination"
                    nextLabel="next >"
                    marginPagesDisplayed={1}
                    previousLabel="< previous"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                />
            }
        </>
    )
}
export default PaginatedItems