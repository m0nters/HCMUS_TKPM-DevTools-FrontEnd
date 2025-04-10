import { OutputFieldProps } from "../OutputField";
import XMLViewer from "react-xml-viewer";

function JSONOutput({ field, value, isLoading = false }: OutputFieldProps) {
  return (
    <div
      className={`border border-gray-300 rounded-md p-4 ${
        isLoading ? "animate-pulse" : ""
      }`}
    >
      {value ? (
        <XMLViewer
          xml={typeof value === "string" ? value : JSON.stringify(value)}
          collapsible={true}
        />
      ) : (
        <span className="text-gray-400">{field.placeholder}</span>
      )}
    </div>
  );
}

export default JSONOutput;
