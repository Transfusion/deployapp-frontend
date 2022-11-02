import { BsCheckCircle } from "react-icons/bs";
import { Message } from "rsuite";

export default function AsyncJobSuccessfulAlert({ message }: {
  message: string,
}) {
  return <div className="bg-green-100 py-5 px-6 my-3 text-base text-green-700 inline-flex items-center w-full" role="alert">
    <BsCheckCircle size={'1.5em'} style={{ marginRight: "15px", minWidth: '30px' }} />
    <div className="min-w-0">
      <p>{message}</p>
    </div>
  </div>
}