import React from 'react';

interface CustomInputProps {
  title?: string;
  width?: string;
  value?: string | number | undefined;
  inputType?: string; // Adding inputType prop
  disabled? : boolean
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<CustomInputProps & { isInvalid?: boolean }> = ({ title, width, value, inputType, disabled = false, 
                                                                              handleChange, isInvalid }) => {
  return (
    <div className={`relative z-0 w-full m-5 group ${isInvalid ? 'border border-red-500' : ''}`} style={{ width }}>
      <input
        type={inputType}
        name="floating_email"
        value={value}
        id="floating_email"
        className="block py-2.5 px-0 w-full text-[20px] text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none
                   focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required
        disabled={disabled}  // Use the disabled prop here to control the input state
        onChange={handleChange}
      />
      <label  className=" text-[20px] peer-focus:font-medium absolute text-sm text-gray-500 
                          duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4
                          rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-placeholder-shown:scale-100
                          peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
        {title || 'title'}
      </label>
    </div>
  );
};

export default CustomInput;
