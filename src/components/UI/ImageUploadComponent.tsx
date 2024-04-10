import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
    width: number;
    height: number;
    onImageParseStringChange: (newString: string) => void;
    dragDropText: string;
    imageSrc: string; // New prop for the initial image source
}

const ImageUploadComponent: React.FC<ImageUploadProps> = ({ width, height, onImageParseStringChange, dragDropText, imageSrc }) => {
    const [localImageSrc, setLocalImageSrc] = useState<string | undefined>(imageSrc);

    useEffect(() => {
        setLocalImageSrc(imageSrc);
    }, [imageSrc]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        const file = acceptedFiles[0];
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newImageString = e.target?.result?.toString() || '';
                setLocalImageSrc(newImageString);
                onImageParseStringChange(newImageString);
            };
            reader.readAsDataURL(file);
        } else {
            setLocalImageSrc('');
            onImageParseStringChange('');
        }
    }, [onImageParseStringChange]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div className='relative'>
            {
                localImageSrc && <button
                    type="button"
                    className="absolute right-[-16px] top-[-16px] bg-white rounded-full p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    onClick={() => setLocalImageSrc(undefined)}
                >
                    <span className="sr-only">Close menu</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            }
            <div
                {...getRootProps()}
                style={{ height: height, width: width }}
                className={`bg-zinc-300 bg-opacity-0 rounded-[1px] border-2 border-white border-dashed flex place-items-center items-center
                        justify-center text-center text-white font-bold overflow-hidden`}
            >
                <input {...getInputProps()} />
                {localImageSrc && <img src={localImageSrc} alt="Uploaded" className=' max-w-full max-h-full'/>}
                {!localImageSrc && (
                    <div className="text-[#ec4ee7] text-[20px] font-medium">
                        {isDragActive ? dragDropText : dragDropText}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploadComponent;
