import classNames from "classnames";
import { BsExclamationCircle } from "react-icons/bs";

export default function DropzoneCredentialsPicker() {
  return <>
    <div className="bg-blue-100 py-5 px-6 mb-3 text-base text-blue-700 inline-flex items-center w-full" role="alert">

      <BsExclamationCircle size={'1.5em'} style={{ marginRight: "15px" }} />

      <div>
        <p>Add storage credentials to get started.</p>
        <div>
          <button type="button" className={classNames('hover:text-white', 'border-2', 'border-blue-700', 'hover:bg-blue-800', 'focus:ring-4', 'focus:outline-none', 'focus:ring-blue-300', 'font-medium', 'text-sm', 'px-2', 'py-2', 'text-center',
            'mt-2',
            // 'mr-2', 'mb-2',

            // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

          )}>Manage Credentials</button>
        </div>
      </div>

    </div>
  </>
}