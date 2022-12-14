interface AuthProvider {
  userId: string,
  providerKey: string,
  providerName: string,
  providerInfoName?: string
}

export default AuthProvider