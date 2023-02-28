import { DropzoneInputProps, DropzoneState } from 'react-dropzone';
import styled from 'styled-components';
import { formatBytes } from '../../utils/utils';

type DragEvents = { isDragAccept: boolean, isDragReject: boolean, isFocused: boolean };

const getColor = (props: DropzoneInputProps & DragEvents) => {
  if (props.isDragAccept) {
    // return '#00e676';
    return '#2196f3';
  }
  if (props.isDragReject) {
    // return '#ff1744';
    return '#2196f3';
  }
  if (props.isFocused) {
    return '#2196f3';
  }
  return '#eeeeee';
}

const DropzoneContainer = styled.div<DropzoneInputProps & DragEvents>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;


// import styles from "./AppDropzone.module.css";
export default function AppDropzone({
  dropState
}: { dropState: DropzoneState }) {

  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps,

    isFocused, isDragAccept, isDragReject

  } = dropState;

  return (
    // <div >
    <DropzoneContainer {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
      <input {...getInputProps()} />
      <p>Drag and drop an .ipa or .apk{/*, .aab, or a .zip file of a macOS .app*/}</p>

      {acceptedFiles.map(f => {
        const { name, size, type } = f;
        return <div className='text-gray-600 pt-2'>
          <span className='font-semibold'>{name} </span>
          <span>({formatBytes(size)}) is ready for upload.</span>
        </div>
      })}

    </DropzoneContainer>
  );

}