import * as React from 'react'
import { PropsWithChildren } from 'react'
import Profile from '../api/interfaces/response/profile'
import { getUnwrappedProfile } from '../api/Profile'
import { Logout } from "../api/Logout"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse, AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

const defaultValue = {
  // login: () => { },
  logout: (() => { }) as Function,
  profile: {} as Profile | undefined,

  isFetching: false,
  isLoading: false,
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
  // const {
  //   data: profile,
  //   status,
  //   error,
  //   isLoading,
  //   isIdle,
  //   isError,
  //   isSuccess,
  //   run,
  //   setData,
  // } = useAsync({});

  const { isLoading,
    isError,
    error,
    data: profile,
    isFetching,
    isPreviousData, } = useQuery(['profile'], () => getUnwrappedProfile(), { refetchOnWindowFocus: true });

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  // deleting
  const { isLoading: logoutLoading, isSuccess: logoutSuccess, error: logoutError, mutate: logout } = useMutation<AxiosResponse<void, any>, AxiosError, string>((id: string) => {
    return Logout();
  }, {
    // this object is a MutateOptions
    onSuccess: async () => {
      queryClient.invalidateQueries(['profile']);
      navigate('/');
    }
  });


  // React.useEffect(() => {
  //   run((async () => {
  //     return (await getProfile()).data;
  //   })())
  // }, [run])

  // const logout = React.useCallback(async () => {
  //   await Logout();
  //   // queryCache.clear()
  //   // setData(null)

  //   run((async () => {
  //     return (await getProfile()).data;
  //   })())
  // }, [run])

  const value = React.useMemo(
    () => ({ profile, logout, isLoading, isFetching, /*login, logout, register*/ }),
    [/*login, logout, register,*/ profile, logout, isLoading, isFetching],
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