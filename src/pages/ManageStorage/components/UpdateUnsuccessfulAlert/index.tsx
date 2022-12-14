import { AxiosError } from "axios";
import { BsExclamationCircle } from "react-icons/bs";
import { instanceOfUpdateS3CredentialResponse, UpdateS3CredentialResponse } from "../../../../api/interfaces/response/update_s3_credential";

function UpdateS3CredentialResponseMsg(resp?: UpdateS3CredentialResponse) {
  if (resp === null || resp === undefined) return <>"An error occurred."</>;
  const { testHeadBucketSuccess, testHeadBucketError, testPublicAccessSuccess, testPublicAccessError, testSignedLinkSuccess, testSignedLinkError, skipTestPublicAccess } = resp;
  return <>
    <p className="break-words">
      {testHeadBucketSuccess ? "Head bucket test passed." : "Head bucket test failed. " + testHeadBucketError}
    </p>

    <p className="break-words">
      {skipTestPublicAccess && "Skipped initializing public bucket policy."}
    </p>


    {!skipTestPublicAccess &&
      <p className="break-words">
        {testPublicAccessSuccess ? "Public access test passed." : "Public access test failed. " + testPublicAccessError}
      </p>
    }
    <p className="break-words">
      {testSignedLinkSuccess ? "Signed link test passed." : "Signed link test failed. " + testSignedLinkError}
    </p>
  </>
}

export default function UpdateUnsuccessfulAlert({ error }: { error?: AxiosError }) {
  if (error === undefined || error === null) return null;

  console.log("inside here");
  console.log(error.response?.data);


  let info: JSX.Element;
  if (instanceOfUpdateS3CredentialResponse(error.response?.data)) {
    info = UpdateS3CredentialResponseMsg(error.response?.data);
  } else {
    info = <p className="text-mono">{JSON.stringify(error.response?.data)}</p>
  }

  return <div className="bg-red-100 py-5 px-6 mb-3 text-base text-red-700 inline-flex items-center w-full break-words" role="alert">
    <BsExclamationCircle size={'1.5em'} style={{ marginRight: "15px", minWidth: '30px' }} />
    <div className="min-w-0">
      <p>Save unsuccessful.</p>
      {info}
    </div>
  </div>
}