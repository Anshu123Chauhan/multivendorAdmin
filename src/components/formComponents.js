import React from "react";
import Input from "./inputContainer";

const address = ({
  formdata,
  handleInputChange,
  city,
  province,
  zip,
  address,
  country,
  province_code,
  country_code,
}) => {
  return (
    <div className="w-full mt-5 md:mt-10 shadow rounded-xl border bg-white p-3 md:p-5 border-r text-sm md:text-base">
      <p className="text-slate-500 font-semibold text-sm md:text-lg">
        Store Address:
      </p>
      <div className="md:p-5 p-3 flex flex-col gap-3">
        <div className="mt-2 flex justify-between flex-col md:flex-row gap-3 md:gap-5">
          <Input.normal
            label="Enter City"
            name="city"
            value={city}
            placeholder="Enter City"
            onChange={handleInputChange}
          />
          <Input.normal
            label="Enter Province"
            name="province"
            value={province}
            placeholder="Enter Province"
            onChange={handleInputChange}
          />
          <Input.normal
            label="Enter ZIP"
            name="zip"
            value={zip}
            placeholder="Enter ZIP"
            onChange={handleInputChange}
          />
        </div>
        <Input.textArea
          label="Enter Address"
          name="address"
          rows="5"
          value={address}
          placeholder="Enter Address"
          onChange={handleInputChange}
        />
        <div className="mt-2 flex justify-between flex-col md:flex-row gap-3 md:gap-5">
          <Input.normal
            label="Enter Country"
            name="country"
            value={country}
            placeholder="Enter Country"
            onChange={handleInputChange}
          />
          <Input.normal
            label="Enter Province Code"
            name="province_code"
            value={province_code}
            placeholder="Enter Province Code"
            onChange={handleInputChange}
          />
          <Input.normal
            label="Enter Country Code"
            name="country_code"
            value={country_code}
            placeholder="Enter Country Code"
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

const Form = { address };

export default Form;
