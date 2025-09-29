export const FloatingInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  radio,
  error,
  options = [],
  required = false,
  length,
  disabled,
}) => {
  const hasValue =
    value !== null && value !== undefined && value.toString().length > 0;

  return (
    <div className="relative z-0 w-full mb-5 group">
      {type === "select" ? (
        <select
          name={name}
          id={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          autoComplete="new-password"
          className={`block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none
              focus:outline-none focus:ring-0 peer relative
              ${
                disabled
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-900 border-gray-300"
              }`}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "radio" ? (
        <div>
          <div className="flex gap-6">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() =>
                    onChange({ target: { name, value: opt.value } })
                  }
                  className="text-[#D4550B] focus:ring-[#D4550B] border"
                />
                <span className="text-gray-700">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : type === "file" ? (
        <input
          type="file"
          name={name}
          id={name}
          onChange={onChange}
          disabled={disabled}
          className={`block w-full text-sm text-gray-900 bg-transparent rounded border border-gray-300 cursor-pointer
                     focus:outline-none focus:ring-0 focus:border-gray-300 ${
                       disabled
                         ? "text-gray-400 border-gray-200 cursor-not-allowed"
                         : "text-gray-900 border-gray-300"
                     }`}
        />
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          value={value || ""}
          onChange={onChange}
          maxLength={length}
          autoComplete="new-password"
          className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none
                     focus:outline-none focus:ring-0 peer placeholder-transparent relative ${
                       disabled
                         ? "text-gray-400 border-gray-200 cursor-not-allowed"
                         : "text-gray-900 border-gray-300"
                     }`}
          style={{
            WebkitBoxShadow: "0 0 0px 1000px transparent inset",
            WebkitTextFillColor: "inherit",
          }}
          placeholder=" "
          disabled={disabled}
        />
      )}

      {type !== "file" && (
        <label
          htmlFor={name}
          className={`absolute text-sm duration-500 transform top-3 -z-10 origin-[0]
            ${hasValue ? "-translate-y-3 text-blue-600 z-10" : "text-gray-500"}
            peer-focus:-translate-y-3 peer-focus:text-blue-600`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {type !== "file" && (
        <span
          className={`absolute left-0 h-0.5 bg-blue-600 transition-all duration-500
      ${error ? "w-full bottom-6" : "w-0 peer-focus:w-full"}`}
        ></span>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
