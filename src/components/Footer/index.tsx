import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getUnwrappedBackendInfo } from "../../api/BackendActuator";
import { getUnwrappedStorageInfo } from "../../api/StorageActuator";


export default function Footer() {

  const { isLoading: backendIsLoading,
    isError,
    error,
    data: backendVersions,
    isFetching,
    isPreviousData, } = useQuery(['backend_version'], () => getUnwrappedBackendInfo());

  const backendGit = backendVersions?.git.build.version;
  const backendAbbrev = backendVersions?.git.commit.id.abbrev;
  const backendFull = backendVersions?.git.commit.id.full;
  const backendBranch = backendVersions?.git.branch;

  const { isLoading: storageIsLoading,
    data: storageVersions,
  } = useQuery(['storage_version'], () => getUnwrappedStorageInfo(), { refetchOnWindowFocus: true });

  const storageGit = storageVersions?.git.build.version;
  const storageAbbrev = storageVersions?.git.commit.id.abbrev;
  const storageFull = storageVersions?.git.commit.id.full;
  const storageBranch = storageVersions?.git.branch;

  const [technicalShown, setTechnicalShown] = useState(false);


  return <>
    <footer className="py-4 w-full">
      <div className="block text-sm text-gray-500 justify-center flex pb-2">

        <a className="hover:underline underline-offset-4 decoration-2 hover:text-blue-700"
          href="https://github.com/Transfusion/deployapp-platform"
          target={"_blank"}>Star DeployApp on GitHub</a>
        <div className="border-l-2 rounded border-solid border-gray-500 mx-4" />
        <span className="inline cursor-pointer hover:underline underline-offset-4 decoration-2 hover:text-blue-700" onClick={() => {
          setTechnicalShown(!technicalShown);
        }}>Technical Info</span>
      </div>

      {technicalShown && <>
        <div className="block text-sm text-gray-500 justify-center flex whitespace-pre">
          <span>Backend:{' '}</span>
          {backendIsLoading ? "Loading..." :
            <>
              <span>{backendGit}{' '}</span>
              <span>{backendBranch}{' '}</span>
              <a target="_blank" className="inline hover:underline underline-offset-4 decoration-2 hover:text-blue-700" href={`https://github.com/Transfusion/deployapp-backend/commits/${backendFull}`}>({backendAbbrev})</a>
            </>
          }
        </div>

        <div className="block text-sm text-gray-500 justify-center flex whitespace-pre">
          <span>Storage:{' '}</span>
          {storageIsLoading ? "Loading..." :
            <>
              <span>{storageGit}{' '}</span>
              <span>{storageBranch}{' '}</span>
              <a target="_blank" className="inline hover:underline underline-offset-4 decoration-2 hover:text-blue-700" href={`https://github.com/Transfusion/deployapp-storage-service/commits/${storageFull}`}>({storageAbbrev})</a>
            </>
          }
        </div>
      </>}

    </footer>
  </>
}