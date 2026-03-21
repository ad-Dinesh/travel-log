import { useState } from "react";

const PasswordInput = ({ value, onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative mb-4">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="Password"
        className="w-full border border-gray-300 rounded-lg p-3 outline-none"
      />

      <span
        onClick={() => setShow(!show)}
        className="absolute right-3 top-3 cursor-pointer text-sm"
      >
        {show ? "Hide" : "Show"}
      </span>
    </div>
  );
};

export default PasswordInput;