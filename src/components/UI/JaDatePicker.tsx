import DatePicker, { registerLocale } from 'react-datepicker';
import ja from 'date-fns/locale/ja';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react';

registerLocale('ja', ja);

interface JaDatePickerProps {
  selectedDate: Date; // Explicitly defining the type as Date
  onDateChange: (date: Date) => void; // A function that takes a Date and returns void
}

const JaDatePicker: React.FC<JaDatePickerProps> = ({ selectedDate, onDateChange }) => {
  const [startDate, setStartDate] = useState(selectedDate);

  useEffect(() => {
    setStartDate(selectedDate);
  }, [selectedDate]);

  const handleChange = (date: Date) => {
    setStartDate(date);
    onDateChange(date);
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={handleChange}
      locale="ja"
      className="form-input px-2 py-2 border rounded-md text-[20px]"
      popperClassName="z-50"
      calendarClassName="bg-white text-gray-700"
    />
  );
};

export default JaDatePicker
