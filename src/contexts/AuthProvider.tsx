import * as React from 'react'
import { PropsWithChildren } from 'react'
import Profile from '../api/interfaces/response/profile'
import { getProfile } from '../api/Profile'
import { Logout } from "../api/Logout"
import { useAsync } from '../utils/hooks'

const defaultValue = {
  // login: () => { },
  logout: () => { },
  profile: {} as Profile
}

/* async function bootstrapAppData() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('bootstrap', {token})
    queryCache.setQueryData('list-items', data.listItems, {
      staleTime: 5000,
    })
    for (const listItem of data.listItems) {
      setQueryDataForBook(listItem.book)
    }
    user = data.user
  }
  return user
} */


export const AuthContext = React.createContext(defaultValue);
AuthContext.displayName = 'AuthContext'

function AuthProvider(props: PropsWithChildren<{}>) {
  const {
    data: profile,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync({});

  React.useEffect(() => {
    run((async () => {
      return (await getProfile()).data;
    })())
  }, [run])

  const logout = React.useCallback(async () => {
    await Logout();
    // queryCache.clear()
    // setData(null)
    
    run((async () => {
      return (await getProfile()).data;
    })())
  }, [run])

  const value = React.useMemo(
    () => ({ profile, logout, /*login, logout, register*/ }),
    [/*login, logout, register,*/ profile, logout],
  )

  // if (isSuccess) {
  return <AuthContext.Provider value={value} {...props} />
  // }
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

export { AuthProvider, useAuth, /*useClient*/ }