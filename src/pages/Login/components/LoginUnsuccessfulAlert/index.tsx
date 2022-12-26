import { AxiosResponse } from "axios";
import { BsExclamationCircle } from "react-icons/bs";
import { LoginResult } from "../../../../api/interfaces/response/login";
import ResendVerificationEmail from "../ResendVerificationEmail";

export default function LoginUnsuccessfulAlert({ resp, email }: { resp: AxiosResponse<LoginResult, any>, email: string }) {

  const { success,
    userId,
    badCredentials,
    disabled,
    error
  } = resp.data;


  let info: JSX.Element;
  info = <p className="text-mono">{JSON.stringify(error)}</p>

  return <div className="bg-red-100 py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-full break-words" role="alert">
    <BsExclamationCircle size={'1.5em'} style={{ marginRight: "15px", minWidth: '30px' }} />
    <div className="min-w-0">
      {/* <p>Registration unsuccessful.</p> */}
      {badCredentials && <p>Invalid email address or password.</p>}
      {disabled &&
        <div>
          <p>Please check your inbox for the verification link.</p>
          <ResendVerificationEmail email={email} />
        </div>
      }
      <p>{error}</p>
      {/* {msg === undefined && info} */}
    </div>
  </div>
}