import {useCallback, useState} from 'react'
import {FileWithPath, useDropzone} from 'react-dropzone'
import { Button } from '../../../@/components/ui/button';

type FileUploaderProps = {
  fieldChange : (FILES: File[]) => void;
  mediaUrl : string;
}

function FileUploader({fieldChange, mediaUrl}:FileUploaderProps) {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback((acceptedFiles:FileWithPath[]) => {
    setFile(acceptedFiles);
    fieldChange(acceptedFiles);
    setFileUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [file])

  const {getRootProps, getInputProps} = useDropzone({onDrop,accept:{
    'image/*':['.png','.jpeg','.jpg','.svg']
  }})
  return (
    <div {...getRootProps()} className='flex flex-center flex-col bg-slate-900 m-2 p-4 mb-10 rounded-xl cursor-pointer h-80'>
      <input {...getInputProps()} className='cursor-pointer'/>
      {
        fileUrl ?(
          <>
          <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
             <img 
             src={fileUrl}
             alt="image"
             className='file_uploader-img'
             />
          </div>
          <p className='file_uploader-label'>Click or drag photo to replace</p>
          </>
        ):(
          <div className='file_uploader-box'>
            <img 
            src="/assets/gallery.png"
            width={96}
            height={77}
            alt="file-upload"
            />
            <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag photo here</h3>
            <p className='text-light-4 small-regular mb-6'>SVG, PHG, JPEG</p>
            <Button className="bg-slate-800 pl-4 pr-4 pb-2 rounded-xl">
              Select from computer
            </Button>
          </div>
        )
      }
    </div>
  )
}

export default FileUploader