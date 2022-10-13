import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthRoute from './routes/AuthRoute'
import './scss/style.scss'
import DefaultLayout from './layout/DefaultLayout'
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers

// const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

function App() {
  return (
    <>
      <Suspense fallback={loading}>
        <Routes>
          <Route
            exact path="/login"
            name="Login Page"
            element={<AuthRoute />}
          />
          <Route path="*" name="Notfound" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
