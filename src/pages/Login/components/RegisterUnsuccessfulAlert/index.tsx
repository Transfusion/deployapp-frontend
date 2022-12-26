import { AxiosError } from "axios";
import { BsExclamationCircle } from "react-icons/bs";
import { RegisterResult } from "../../../../api/interfaces/response/register";
import ResendVerificationEmail from "../ResendVerificationEmail";

export default function RegisterUnsuccessfulAlert({ error, email }: { error?: AxiosError<RegisterResult, any>, email: string }) {

  if (error === undefined || error === null) return null;

  console.log("inside ToggleUnsuccessfulAlert");
  console.log(error.response?.data);

  const { already_registered, pending_verification } = error.response?.data ?? {
    already_registered: null,
    pending_verification: null
  };

  let info: JSX.Element;
  info = <p className="text-mono">{JSON.stringify(error.response?.data)}</p>

  return <div className="bg-red-100 py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-full break-words" role="alert">
    <BsExclamationCircle size={'1.5em'} style={{ marginRight: "15px", minWidth: '30px' }} />
    <div className="min-w-0">
      {/* <p>Registration unsuccessful.</p> */}
      {(already_registered && !pending_verification) && <p>You have already registered. Please proceed to login or reset your password.</p>}
      {(already_registered && pending_verification) &&
        <div>
          <p>Please check your inbox for the verification link.</p>

          <ResendVerificationEmail email={email} />
        </div>
      }
      {!error.response?.data && <p>An error has occurred. Please try again later.</p>}
      {/* <p>{msg}</p> */}
      {/* {msg === undefined && info} */}
    </div>
  </div>
}