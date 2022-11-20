import { Apk } from "../../../../api/interfaces/response/app_binary";
import { InfoCell } from "../../../../components/InfoCell";
import { humanReadableDate, formatBytes } from "../../../../utils/utils";

export default function PublicAboutIPA({ binary }: {
  binary: Apk
}) {
  return <>
    <div className="flex flex-row flex-wrap gap-3 py-2">
      <InfoCell title={"Type"} value={binary.type} />

      <InfoCell title={"Version"} value={binary.version} />
      <InfoCell title={"Build"} value={binary.build} />
      <InfoCell title={"Upload Date"} value={humanReadableDate(binary.uploadDate)} />
      {/* <InfoCell title={"Name"} value={binary.name} /> */}
      <InfoCell title={"Last Install Date"} value={humanReadableDate(binary.lastInstallDate)} />
      <InfoCell title={"Bundle ID"} value={binary.identifier} />

      <InfoCell title={"Size"} value={formatBytes(binary.sizeBytes)} />

      {/* <InfoCell title={"File Name"} value={binary.fileName ?? 'N/A'} /> */}

      {/* <InfoCell title={"Storage Cred. ID"} value={binary.storageCredential} /> */}

      <InfoCell title={"Min. SDK version"} value={binary.minSdkVersion} />
      <InfoCell title={"Min. OS version"} value={binary.minOsVersion} />
      <InfoCell title={"Target SDK version"} value={binary.targetSdkVersion} />
    </div>
  </>
}