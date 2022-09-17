import { useDropzone } from "react-dropzone";
import AppDropzone from "../AppDropzone";
import DropzoneCredentialsPicker from "../DropzoneCredentialsPicker";

import { BsExclamationCircle } from "react-icons/bs";
import classNames from "classnames";

export default function HomeUpload() {

  const dropState = useDropzone({
    // disabled: true,
    accept: {
      '': ['.ipa', '.apk'],
    },
    maxFiles: 1,
    multiple: false,
    onDropAccepted: files => {
      console.log("onDropAccepted");
      console.log(files);
    },
    maxSize: 157286400, // 150 MB
  });

  const { acceptedFiles, fileRejections } = dropState;

  console.log("from homeupload", acceptedFiles);

  return <>
    <DropzoneCredentialsPicker />
    <AppDropzone dropState={dropState} />

    {fileRejections.map(({ file, errors }) => {
      return <div className="text-gray-500 flex flex-row">
        <BsExclamationCircle size={'1.5em'} style={{ marginRight: "10px" }} />
        {file.name} is not a valid app.
      </div>
    })}

    <button /*disabled={!acceptedFiles.length}*/ className={classNames('text-base', 'hover:text-white', 'border-2',

      'text-blue-700', 'border-blue-700', 'hover:bg-blue-800', 'enabled:focus:ring-blue-300',

      'disabled:text-gray-500', 'disabled:border-gray-500', 'disabled:bg-gray-100',

      'focus:ring-4', 'focus:outline-none', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2',
      // 'mr-2', 'mb-2',
      // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

    )}>Upload</button>
  </>
}