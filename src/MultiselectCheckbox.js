import React, { useState } from 'react';

const MultiselectCheckbox = ({ options }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const option = options.find((opt) => opt.moduleLinkId === value);
    
    if (checked) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      setSelectedOptions(selectedOptions.filter((opt) => opt.moduleLinkId !== value));
    }
  };

  return (
    <div>
      {options.map((option, index) => (
        <div key={index}>
          <input
            type="checkbox"
            id={`checkbox-${index}`}
            value={option.moduleLinkId}
            //checked={selectedOptions.some((opt) => opt.moduleLinkId === option.moduleLinkId)}
            onChange={handleCheckboxChange}
          />
          <label htmlFor={`checkbox-${index}`}>{option.linkName}</label>
        </div>
      ))}
     
    </div>
  );
};

export default MultiselectCheckbox;
