import { useDropzone } from "react-dropzone";
import AppDropzone from "../AppDropzone";
import DropzoneCredentialsPicker from "../DropzoneCredentialsPicker";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import classNames from "classnames";
import _ from "lodash";
import { useRef, useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import { uploadAppBinaryUnwrapped } from "../../api/AppBinaryUpload";
import { UploadAppBinaryRequest } from "../../api/interfaces/request/upload_appbinary";
import { AppBinary } from "../../api/interfaces/response/app_binary";
import { StorageCredential } from "../../api/interfaces/response/storage_credential";
import UploadUnsuccessfulAlert from "./components/UploadUnsuccessfulAlert";
import UploadSuccessfulAlert from "./components/UploadSuccessfulAlert";

interface UploadMutationReq {
  data: UploadAppBinaryRequest,
  onUploadProgress?: (progressEvent: ProgressEvent) => void
}

export default function HomeUpload() {
  // const [credId, setCredId] = useState<string | undefined>(undefined);
  const [storageCred, setStorageCred] = useState<StorageCredential | undefined>(undefined);

  const uploadAbortControllerRef = useRef<AbortController | null>(null);

  const { data, isLoading, isSuccess, error, mutate, reset } = useMutation<AppBinary, AxiosError, UploadMutationReq>((req: UploadMutationReq) => {
    uploadAbortControllerRef.current = new AbortController()

    const { data, onUploadProgress } = req;
    return uploadAppBinaryUnwrapped(data, onUploadProgress, uploadAbortControllerRef.current.signal);
  }, {
    // this object is a MutateOptions
    // onSuccess: onDeleteSuccess
  });

  const dropState = useDropzone({
    disabled: isLoading,
    accept: {
      '': ['.ipa', '.apk'],
    },
    maxFiles: 1,
    multiple: false,
    // onDropAccepted: files => {
    //   console.log("onDropAccepted");
    //   console.log(files);
    // },
    maxSize: 262144000, // 250 MB
  });

  const { acceptedFiles, fileRejections } = dropState;
  const acceptedFile = _.head(acceptedFiles);
  const { name, size, type } = acceptedFile || {};

  console.log("from homeupload", acceptedFiles);

  const [uploadProgressEvt, setUploadProgressEvt] = useState<ProgressEvent<EventTarget>>();
  const UPE = uploadProgressEvt;

  const performUpload = () => {
    console.log(acceptedFiles);
    const file = acceptedFile;
    if (_.isUndefined(storageCred) || _.isUndefined(file)) return;
    mutate({
      data: {
        storageCredentialId: storageCred.id,
        binary: file,
        credentialCreatedOn: storageCred.createdOn
      },
      onUploadProgress: evt => { console.log(evt); setUploadProgressEvt(evt); },
    });
  }

  const cancelUpload = () => {
    uploadAbortControllerRef.current?.abort();
    reset();
  }

  return <>
    <DropzoneCredentialsPicker onCredentialSelected={setStorageCred} />
    <AppDropzone dropState={dropState} />

    {fileRejections.map(({ file, errors }) => {
      return <div className="text-gray-500 flex flex-row">
        <BsExclamationCircle size={'1.5em'} style={{ marginRight: "10px" }} />
        {file.name} is not a valid app.
      </div>
    })}

    {isLoading && <div className="bg-blue-100 py-5 px-6 mb-3 text-base text-blue-700 inline-flex items-center w-full" role="alert">
      <BsExclamationCircle size={'1.5em'} style={{ marginRight: "15px" }} />
      <div className="h-fit">
        <p>Uploading <span className='font-semibold'>{name} </span> {UPE !== undefined && (UPE.loaded / UPE.total * 100).toFixed(2)}%</p>
      </div>
    </div>}

    {error && <UploadUnsuccessfulAlert error={error} />}
    {isSuccess && <UploadSuccessfulAlert id={data.id} />}

    <button disabled={!acceptedFiles.length || _.isUndefined(storageCred) /*|| isLoading*/}
      onClick={isLoading ? cancelUpload : performUpload}
      className={isLoading ? classNames('text-base', 'hover:text-white', 'border-2',
        'text-red-700', 'border-red-700', 'hover:bg-red-800', 'enabled:focus:ring-red-300',
        'disabled:text-gray-500', 'disabled:border-gray-500', 'disabled:bg-gray-100',
        'focus:ring-4', 'focus:outline-none', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2',
      ) : classNames('text-base', 'hover:text-white', 'border-2',
        'text-blue-700', 'border-blue-700', 'hover:bg-blue-800', 'enabled:focus:ring-blue-300',
        'disabled:text-gray-500', 'disabled:border-gray-500', 'disabled:bg-gray-100',
        'focus:ring-4', 'focus:outline-none', 'font-medium', 'text-sm', 'p-2', 'text-center', 'mt-2',
        // 'mr-2', 'mb-2',
        // 'dark:border-blue-500', 'dark:hover:text-white', 'dark:hover:bg-blue-600', 'dark:focus:ring-blue-800'

      )}>{isLoading ? "Cancel" : "Upload"}</button>
  </>
}