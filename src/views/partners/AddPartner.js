import {
  CAlert,
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CFormLabel,
} from "@coreui/react";
import React, { useEffect, useRef, useState } from "react";
import Loader from "src/components/Loader";
import { useAddPartnerMutation } from "src/servicesRtkQuery/gamesMenuApi";
import PartnerCheckboxes from "./PartnerCheckboxes";
import { useGetCoinQuery } from "src/servicesRtkQuery/gamesMenuApi";
import { checkPassword } from "src/utils/Validation";
const AddPartner = () => {
  const countries = ["India"];

  //checkboxes ref
  const rakeRef = useRef();
  const stakeRef = useRef();
  const userDetailRef = useRef();

  const user_idRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();
  const mobileRef = useRef();
  const statusRef = useRef();
  const joining_dateRef = useRef();

  const [values, setValues] = useState({
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    status: "",
    country: "",
  });
  const [addPartner, { isSuccess, isError, isLoading, error }] = useAddPartnerMutation();

  const handleChange = (event) => {
    setErrorMsg("")
    setPasswordError('')
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const [passwordError, setPasswordError] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = checkPassword(values.password)
    if (result.isPasswordValid === false) {
      setPasswordError('Password must contains ' + result.errorMessage)
      return
    } else {

      let coin_comission = [];
      coins.map((item) => {
        return coin_comission.push({
          coin_id: item.id,
          comission: values[item.coin] ? values[item.coin] : 0,
        });
      });

      const data = {
        ...values,
        rake_comissions: coin_comission,
        is_show_total_rake: rakeRef.current.checked ? "1" : "0",
        is_show_total_stake: stakeRef.current.checked ? "1" : "0",
        is_show_user_details: userDetailRef.current.checked ? "1" : "0",
        user_column_details: {
          user_id: user_idRef.current.checked ? "1" : "0",
          name: nameRef.current.checked ? "1" : "0",
          email: emailRef.current.checked ? "1" : "0",
          mobile: mobileRef.current.checked ? "1" : "0",
          status: statusRef.current.checked ? "1" : "0",
          joining_date: joining_dateRef.current.checked ? "1" : "0",
        },
      };
      addPartner(data);
    }

  };
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  useEffect(() => {

    if (isSuccess) {
      setSuccessMsg("New member added successfully")
      setValues({
        name: "",
        email: "",
        mobile_number: "",
        password: "",
        status: "",
        country: "",
      })
    }
    if (isError) {
      setErrorMsg("hello")
    }
  }, [isSuccess, isError])

  const { data: coinsData, isSuccess: isSuccessCoinData } = useGetCoinQuery();
  let coins = [];
  if (isSuccessCoinData) {
    coins = coinsData.results;
  }
  return (
    <>
      <CContainer className="d-flex justify-content-center  ">
        {coins.length == 0 ? (
          <Loader />
        ) : (
          <CForm
            className="needs-validation"
            noValidate
            onSubmit={handleSubmit}
          >
            {successMsg ? (
              <CAlert color="success">New member added successfully</CAlert>
            ) : (
              (isError && errorMsg) && (
                <CAlert color="danger">{Object.values(error.data.message)[0][0]}</CAlert>
              )
            )}
            <CRow>
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="name"
                  label="Name *"
                  value={values.name}
                  name="name"
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormInput
                  type="email"
                  id="email"
                  label="Email address *"
                  value={values.email}
                  name="email"
                  onChange={handleChange}
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="mobile"
                  label="Mobile *"
                  value={values.mobile_number}
                  name="mobile_number"
                  onChange={handleChange}
                />
              </CCol>
              <CCol md={6}>
                <CFormSelect
                  id="country"
                  label="Country *"
                  value={values.country}
                  name="country"
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {countries.map((country, index) => {
                    return (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    );
                  })}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={6}>
                <CFormInput
                  type="text"
                  id="password"
                  label="Password *"
                  value={values.password}
                  name="password"
                  onChange={handleChange}
                />
                {passwordError && <CAlert color="danger">{passwordError}</CAlert>}

              </CCol>
              <CCol md={6}>
                <CFormSelect
                  id="status"
                  label="Status *"
                  value={values.status}
                  name="status"
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value={1} name="status">
                    {"Active"}{" "}
                  </option>
                  <option value={0} name="status">
                    {"Inactive"}{" "}
                  </option>
                  <option value={2} name="status">
                    {"Blocked"}{" "}
                  </option>
                </CFormSelect>
              </CCol>
            </CRow>

            {/* rake commsions */}
            <CRow className="mt-3">
              <CFormLabel htmlFor="exampleFormControlInput1">
                Comissions :
              </CFormLabel>
            </CRow>
            <CRow className="">
              {coins.map((coin, key) => {
                return (
                  <CCol md={2} key={key}>
                    <CFormInput
                      type="number"
                      id="comission"
                      label={coin.name}
                      min="0"
                      defaultValue={0}
                      name={coin.coin}
                      onChange={handleChange}
                    />
                  </CCol>
                );
              })}
            </CRow>

            <PartnerCheckboxes
              rakeRef={rakeRef}
              stakeRef={stakeRef}
              userDetailRef={userDetailRef}
              user_idRef={user_idRef}
              nameRef={nameRef}
              emailRef={emailRef}
              mobileRef={mobileRef}
              statusRef={statusRef}
              joining_dateRef={joining_dateRef}
            />

            <CRow className="mt-3">
              <CCol xs={12}>
                {isLoading ? (
                  <Loader />
                ) : (
                  <CButton
                    color="primary"
                    type="submit"
                    disabled={
                      !values.name ||
                      !values.email ||
                      !values.password ||
                      !values.status ||
                      !values.country ||
                      !(values.mobile_number.length === 10)
                    }
                  >
                    Add Partner
                  </CButton>
                )}
              </CCol>
            </CRow>
          </CForm>
        )}
      </CContainer>
    </>
  );
};

export default AddPartner;
