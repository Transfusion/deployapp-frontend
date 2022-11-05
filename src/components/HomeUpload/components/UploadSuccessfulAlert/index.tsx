import { BsCheckCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function UploadSuccessfulAlert({ id }: { id: string }) {
  const navigate = useNavigate();

  return <div className="bg-green-100 py-5 px-6 mb-3 text-base text-green-700 inline-flex items-center w-full" role="alert">
    <BsCheckCircle size={'1.5em'} style={{ marginRight: "15px", minWidth: '30px' }} />
    <div className="min-w-0">
      <p>Save successful. <span className="font-bold hover:underline cursor-pointer" onClick={() => {
        navigate(`/manage/${id}`)
      }}>Click here</span> to manage your uploaded app</p>
    </div>
  </div>
}