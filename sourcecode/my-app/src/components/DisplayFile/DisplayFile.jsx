import { useState } from "react";
import Papa from 'papaparse'

const DisplayFile = ({file}) => {
  const [error, setError] = useState("");
  const [data, setData] = useState([]);

  function handleParse() {
    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      const rows = Object.keys(parsedData[0]);
      const columns = Object.values(parsedData[0]);
      const res = rows.reduce((acc, e, i) => {
        return [...acc, [[e], columns[i]]];
      }, []);
      console.log(res);
      setData(res);
    };
    reader.readAsText(file);
  }

  return (
    <>
      <div>
        <button onClick={handleParse}>Parse</button>
      </div>
      <div>
        {error
          ? error
          : data.map((e, i) => (
            <div key={i} className='item'>
              {e[0]}:{e[1]}
            </div>
          ))
        }
      </div>
    </>
  );
};

export default DisplayFile;