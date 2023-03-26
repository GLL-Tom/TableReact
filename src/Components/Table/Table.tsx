import { useState } from "react";
import getValueFromPath from "../../helpers/getValueFromPath";
// import sortByHeader from "../../helpers/sortByHeader";
import './Table.css';

const GenerateHeaders = ({ headers, handleSort }: { headers: any[], handleSort: any }) => {
  return (
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th key={`headers_${index}`}>
            <button onClick={() => handleSort(header)} className={header.style}>
              {header.label}
            </button>
          </th>
        ))}
      </tr>
    </thead>
  )
}
const GenerateBody = ({ headers, objectList }: { headers: any[], objectList: any[] }) => {
  return (
    <tbody>
      {objectList.map((object, index) => (
        <tr key={`row_${index}`}>
          {headers.map((header) => <td key={`data_${header.label}_${index}`} className={header.style}>
            {getValueFromPath(header.path, object)}
          </td>)}
        </tr>
      ))}

    </tbody>
  )
}

// AJOUTER DES BOUTONS USR LES HEADERS POUR TRIER
// AJOUTER UN MENU FILTRE
const Table = ({ liste, headers }: { liste: any[], headers: any[] }) => {
  const [sortedList, setSortedList] = useState(liste);
  const [sortColumnLabel, setSortColumnLabel] = useState(headers[0]);
  const [isAscendingOrder, setAscendingOrder] = useState(true);

  const sortByHeader = (header: any, objectList: any[], isAscending: boolean) => {
    const sortedData = objectList.sort((a: any, b: any) => {
      if (getValueFromPath(header.path, a) < getValueFromPath(header.path, b)) {
        return isAscending ? -1 : 1;
      } else if (getValueFromPath(header.path, a) > getValueFromPath(header.path, b)) {
        return isAscending ? 1 : -1;
      }
      return 0;
    });
    return sortedData;
  }

  const handleSort = (header: any) => {
    let isAscending = true;
    if (sortColumnLabel === header) {
      isAscending = !isAscendingOrder;
    }
    setAscendingOrder(isAscending);
    setSortColumnLabel(header);
    const sortedData = sortByHeader(header, liste, isAscending);
    header["style"] += ' sort';
    console.log(header["style"]);
    setSortedList(sortedData);
  }

  if (liste.length == 0) {
    return null;
  }
  return (
    <>
      <table>
        <GenerateHeaders headers={headers} handleSort={handleSort} />
        <GenerateBody headers={headers} objectList={sortedList} />
      </table>
    </>
  )
}

export default Table;