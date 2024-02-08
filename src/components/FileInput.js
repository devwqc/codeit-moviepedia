import { useEffect, useRef } from 'react';

function FileInput({ name, value, onChange }) {
  const inputRef = useRef();

  const handleChange = (e) => {
    const nextValue = e.target.files[0];
    onChange(name, nextValue);
  };

  useEffect(() => {
    if (inputRef.current) {
      console.log(inputRef.current);
    }
  }, []);

  return <input type="file" onChange={handleChange} ref={inputRef} />;
}

export default FileInput;
