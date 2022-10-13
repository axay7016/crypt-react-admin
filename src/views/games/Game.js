import React, { useEffect, useState } from "react";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CImage,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CRow,
  CContainer,
  CCol,
  CFormLabel
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import { setGames } from "src/redux/tableDataSlice";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";
import { cilColorBorder } from "@coreui/icons";

const Game = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const games = useSelector((state) => state.tableDataReducer.games);

  // useEffect(() => {
  //   onGetCms().then((res) => {
  //     if (res.status === 200) {
  //       dispatch(setCms(res.data));
  //     } else {
  //       console.log(res);
  //     }
  //   });
  // }, []);

  const editDestination = (id) => {
    navigate(`/admin/edit-cms/${id}`);
  };

  return (
    <>
      <CContainer>
        <CRow>

        </CRow>
        <CRow>
          <CCol md={4}>
            <CFormLabel htmlFor="above">Above</CFormLabel>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">User ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Stake</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Payout</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {games?.results?.map((item, index) => {
                  return (
                    <CTableRow key={index}>
                      <CTableDataCell onClick={() => editDestination(item._id)}>
                        <CIcon
                          style={{ cursor: "pointer" }}
                          icon={cilColorBorder}
                          height={25}
                          width={25}
                          customClassName="nav-icon"
                        />
                      </CTableDataCell>
                      <CTableDataCell >{item.title}</CTableDataCell>
                      <CTableDataCell>{item.slug}</CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            </CTable>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="mid">Mid</CFormLabel>

            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">User ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Stake</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Payout</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {games?.results?.map((item, index) => {
                  return (
                    <CTableRow key={index}>
                      <CTableDataCell onClick={() => editDestination(item._id)}>
                        <CIcon
                          style={{ cursor: "pointer" }}
                          icon={cilColorBorder}
                          height={25}
                          width={25}
                          customClassName="nav-icon"
                        />
                      </CTableDataCell>
                      <CTableDataCell >{item.title}</CTableDataCell>
                      <CTableDataCell>{item.slug}</CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            </CTable>
          </CCol>
          <CCol md={4}>
            <CFormLabel htmlFor="below">Below</CFormLabel>

            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">User ID</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Stake</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Payout</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {games?.results?.map((item, index) => {
                  return (
                    <CTableRow key={index}>
                      <CTableDataCell onClick={() => editDestination(item._id)}>
                        <CIcon
                          style={{ cursor: "pointer" }}
                          icon={cilColorBorder}
                          height={25}
                          width={25}
                          customClassName="nav-icon"
                        />
                      </CTableDataCell>
                      <CTableDataCell >{item.title}</CTableDataCell>
                      <CTableDataCell>{item.slug}</CTableDataCell>
                    </CTableRow>
                  );
                })}
              </CTableBody>
            </CTable>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
};

export default Game;
