import { AxiosError } from "axios";
import { BsExclamationCircle } from "react-icons/bs";

export default function ToggleUnsuccessfulAlert({ error }: { error?: AxiosError }) {
  if (error === undefined || error === null) return null;

  console.log("inside ToggleUnsuccessfulAlert");
  console.log(error.response?.data);


  let info: JSX.Element;
  info = <p className="text-mono">{JSON.stringify(error.response?.data)}</p>

  return <div className="bg-red-100 py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-full break-words" role="alert">
    <BsExclamationCircle size={'1.5em'} style={{ marginRight: "15px", minWidth: '30px' }} />
    <div className="min-w-0">
      <p>Save unsuccessful.</p>
      {info}
    </div>
  </div>
}