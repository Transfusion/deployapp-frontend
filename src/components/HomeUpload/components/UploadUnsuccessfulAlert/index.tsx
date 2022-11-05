import { AxiosError } from "axios";
import { BsExclamationCircle } from "react-icons/bs";

export default function UploadUnsuccessfulAlert({ error }: { error?: AxiosError }) {
  if (error === undefined || error === null) return null;
  const info = <p className="text-mono">{JSON.stringify(error.response?.data)}</p>

  return <div className="bg-red-100 py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-full" role="alert">
    <BsExclamationCircle size={'1.5em'} style={{ marginRight: "15px", minWidth: '30px' }} />
    <div className="min-w-0">
      <p>Upload unsuccessful.</p>
      {info}
    </div>
  </div>
}