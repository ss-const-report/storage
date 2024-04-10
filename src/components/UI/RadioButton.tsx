import React, { useEffect, useState } from 'react';

type RadioButtonOption = {
  id: string;
  label: string;
};

type RadioButtonListProps = {
  options: RadioButtonOption[];
  onRadioChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  optionString: string | null

};

const RadioButtonList: React.FC<RadioButtonListProps> = ({ options, onRadioChange, optionString }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  useEffect(() => {
    setSelectedOption(optionString);
  }, [optionString]);
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.id);
    onRadioChange(event); // Call the prop function
  };

  return (
    <ul className="flex flex-col sm:flex-row">
      {options.map((option) => (
        <li key={option.id} className="inline-flex items-center gap-x-2.5 py-3 px-4 text-sm font-medium bg-white border text-gray-800
                                       -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ms-px sm:mt-0 sm:first:rounded-se-none
                                        sm:first:rounded-es-lg sm:last:rounded-es-none sm:last:rounded-se-lg ">
          <div className="relative flex items-start w-full">
            <div className="flex items-center h-7">
              <input
                id={option.id}
                type="radio"
                className="border-gray-200 rounded-full disabled:opacity-50"
                checked={selectedOption === option.id}
                onChange={handleRadioChange}
              />
            </div>
            <label htmlFor={option.id} className="ms-3 block w-full text-[20px] text-gray-600">
              {option.label}
            </label>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default RadioButtonList;
