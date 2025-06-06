import { useEffect, useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import PageLoadingSpinner from '../../components/Loading/PageLoadingSpinner'
// import { verifyUserAPI } from '~/apis'

function AccountVerification() {
  let [searchParams] = useSearchParams()
  const { token } = Object.fromEntries([...searchParams])

  const [verified, setVerified] = useState(false)

  // useEffect(() => {
  //   if (email && token) {
  //     verifyUserAPI({ email, token }).then(() => setVerified(true))
  //   }
  // }, [email, token])

  if (token) {
    return <Navigate to='/404' />
  }

  if (!verified) {
    return <PageLoadingSpinner caption='Verifying your account...' />
  }

  return <Navigate to={`/login?verifiedEmail=${email}`} replace={true} />
}

export default AccountVerification
