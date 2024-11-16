import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";

export default function ExportData({ data }: any) {
  return (
    <CSVLink data={data} filename={"export.csv"}>
      <button className="btn-export" title="Export data to CSV">
        <FontAwesomeIcon icon={faFileExport} />
        <span>Export</span>
      </button>
    </CSVLink>
  );
}