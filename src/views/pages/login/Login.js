import React, { useEffect, useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { useNavigate } from "react-router-dom";
import { setTokenInLocalSorage, setRoleInLocalSorage } from "src/utils/localStorage";
import { useLazyLoginQuery } from "src/servicesRtkQuery/authApi";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPassInvalid, setIsPassInvalid] = useState(false);
  let navigate = useNavigate();

  const [trigger, result] = useLazyLoginQuery();
  const { isSuccess, isFetching, isError, error } = result;

  const handleOnChange = (e) => {
    setIsEmailInvalid(false);
    setIsPassInvalid(false);
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleOnClick = () => {
    if (email === "" || password === "") {
      setIsEmailInvalid(true);
      setIsPassInvalid(true);
    } else {
      trigger({ email, password });
    }
  };
  useEffect(() => {
    if (isSuccess && !isFetching) {
      if (result.data.results.user.user_type == 'team_member') {
        const role = result.data.results?.user?.role
        setRoleInLocalSorage(JSON.parse(role).toString(), result.data.results.user.user_type)
      }
      setTokenInLocalSorage(result.data.results.token);
      setIsEmailInvalid(false);
      setIsPassInvalid(false);
      window.location.reload();
      if (result.data.results.user.user_type == 'team_member') {
        navigate(`/nothing`);
      } else {
        navigate('/dashboard')
      }
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    if (isError && !isFetching) {
      if (Object.keys(error.data.message)[0] === "email") {
        setIsEmailInvalid(true);
      } else if (Object.keys(error.data.message)[0] === "password") {
        setIsPassInvalid(true);
      } else {
        setIsEmailInvalid(true);
      }
    }
  }, [isError, isFetching]);

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center log">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6} className="sigup">
            <CCardGroup>
              <CCard className="p-4 main-screen-log">
                <CCardBody>
                  <CForm className=" needs-validation">
                    <p className="text-medium-emphasis">
                      Sign In to your account
                    </p>
                    <CInputGroup className="mb-3 ic ">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        value={email}
                        name="email"
                        onChange={handleOnChange}
                        feedbackInvalid="Please provide a valid email."
                        invalid={isEmailInvalid}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4 ic">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={handleOnChange}
                        feedbackInvalid="Please provide a valid password."
                        invalid={isPassInvalid}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6} className="log-bt">
                        <CButton
                          color="primary"
                          className="px-4 me-2"
                          onClick={handleOnClick}
                          disabled={isFetching}
                        >
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};
export default Login;
