import { useDropzone } from 'react-dropzone';


import styles from "./AppDropzone.module.css";
export default function AppDropzone() {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps
  } = useDropzone({
    // disabled: true,
    accept: {
      'application/zip': [],
      // 'application/data': [],
      // 'image/png': []
    }
  });



  return (
    // <div >
    <div {...getRootProps({ className: styles['dropzone'] })}>
      <input {...getInputProps()} />
      <p>Drag and drop an .ipa, .apk, .aab, or a .zip file of a macOS .app</p>
    </div>
    //   {/* <aside>
    //     <h4>Files</h4>
    //     <ul>{files}</ul>
    //   </aside> */}
    // </div>
  );

}