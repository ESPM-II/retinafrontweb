import React from 'react';
import { LiaCloudUploadAltSolid } from 'react-icons/lia';
import { Upload, message } from 'antd';
import { toast } from 'react-hot-toast';
const { Dragger } = Upload;

const UploadFile = ({name = "files", multiple = true, className = "", files, setFiles}) => (
  <Dragger 
    name={name}
    beforeUpload={() => false}
    fileList={files}
    multiple={multiple} 
    onChange={(info) => {
      const { status } = info.file;
      if (status !== 'uploading') {
        setFiles(info.fileList);
      }
    }}
    className={className}
  >
    <p className="flex justify-center ant-upload-drag-icon">
      <LiaCloudUploadAltSolid size="4em" className='animate-bounce'/>
    </p>
    <p className="ant-upload-text">Haz click o arrastra los archivos a esta área para subirlos</p>
    <p className="ant-upload-hint">
      Por favor subir únicamente archivos dicom.
    </p>
  </Dragger>
);
export default UploadFile;