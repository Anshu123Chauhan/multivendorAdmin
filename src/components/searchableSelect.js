import React, { useState } from 'react';
import './layout.css'

function SearchableSelect({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    console.log("event.target.value",event.target.value)
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setSearchTerm('');
    setIsOpen(false);
    onSelect(option);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="searchable-select">
      <div className="selected-option btn btn-outline-dark m-1 w-100" onClick={toggleDropdown}>
        {selectedOption || 'Select an option'}
      </div>
      {isOpen && (
        <div className="dropdown m-1 w-100 shadow overflow-hidden" style={{height:'400px'}}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            autoFocus
            className='w-100 form-control'
            onChange={handleSearchChange}
          />
          <ul className='p-3 selectWindow' style={{overflow: 'scroll', height: '400px'}}>
            {filteredOptions.map((option) => (
              <li className='list-unstyled my-1 option p-1 px-3' key={option} onClick={() => handleOptionClick(option)}>
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default SearchableSelect;