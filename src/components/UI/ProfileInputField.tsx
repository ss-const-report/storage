import React from 'react';

type CustomInputProps = {
    id: string;
    label: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    validationMessage?: string;
  };

const ProfileInputField = ({ id, label, placeholder = '', value, onChange, validationMessage }: CustomInputProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {validationMessage && <p className="text-red-500 text-sm italic">{validationMessage}</p>}
    </div>
  );
};

export default ProfileInputField;
