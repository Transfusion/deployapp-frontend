import { BsCheckCircle } from "react-icons/bs";

export default function SaveSuccessfulAlert() {
  return <div className="bg-green-100 py-5 px-6 mb-3 text-base text-green-700 inline-flex items-center w-full" role="alert">
  <BsCheckCircle size={'1.5em'} style={{ marginRight: "15px", minWidth: '30px' }} />
  <div className="min-w-0">
    <p>Save successful.</p>
  </div>
</div>
}