import { useState, useRef, useCallback } from "react";
import {
  DocumentArrowUpIcon,
  DocumentPlusIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface FileUploadBoxProps {
  label: string;
  multiple?: boolean;
  accept?: string;
  files: File | File[];
  onChange: (files: File | File[]) => void;
  onRemove?: (index: number) => void;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  maxFiles?: number;
}

/**
 * FileUploadBox - A reusable file upload component with drag and drop support
 *
 * This component provides a complete file upload interface with:
 * - Single or multiple file uploads
 * - Drag and drop functionality with visual feedback
 * - File type validation via accept prop
 * - Accessible click-to-upload behavior
 * - File list display for multiple uploads with remove capability
 * - Support for disabled state
 * - Size display for uploaded files
 *
 * @param {string} label - The label for the upload field
 * @param {boolean} [multiple=false] - Whether multiple file selection is allowed
 * @param {string} [accept="*"] - File types to accept (e.g. ".dll,.exe")
 * @param {File|File[]} files - The currently selected file(s)
 * @param {function} onChange - Callback when files are added (receives File or File[])
 * @param {function} [onRemove] - Callback to remove a file at specified index
 * @param {boolean} [disabled=false] - Whether the upload is disabled
 * @param {boolean} [required=false] - Whether the field is required
 * @param {string} [helperText] - Helper text displayed below the upload area
 * @param {number} [maxFiles=Infinity] - Maximum number of files allowed (for multiple)
 *
 * @example
 * // Single file upload
 * <FileUploadBox
 *   label="Upload Document"
 *   accept=".pdf,.doc,.docx"
 *   files={document}
 *   onChange={setDocument}
 *   required
 *   helperText="Max file size: 5MB"
 * />
 *
 * @example
 * // Multiple file upload with file removal
 * <FileUploadBox
 *   label="Upload Images"
 *   multiple
 *   accept=".jpg,.png,.gif"
 *   files={images}
 *   onChange={setImages}
 *   onRemove={handleRemoveImage}
 *   maxFiles={5}
 *   helperText="Up to 5 images (JPG, PNG, GIF)"
 * />
 */

function FileUploadBox({
  label,
  multiple = false,
  accept = "*",
  files,
  onChange,
  onRemove,
  disabled = false,
  required = false,
  helperText,
  maxFiles = Infinity,
}: FileUploadBoxProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileList = multiple ? (files as File[]) : files ? [files as File] : [];
  const fileCount = fileList.length;

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDraggingOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);

      if (
        disabled ||
        !e.dataTransfer.files ||
        e.dataTransfer.files.length === 0
      ) {
        return;
      }

      const droppedFiles = Array.from(e.dataTransfer.files);

      // Filter by accept attribute if provided
      const validFiles =
        accept !== "*"
          ? droppedFiles.filter((file) => {
              // Convert accept string like ".dll" to proper regex
              const acceptedTypes = accept
                .split(",")
                .map((type) => type.trim().toLowerCase().replace(".", "\\."));
              const regex = new RegExp(`(${acceptedTypes.join("|")})$`, "i");
              return regex.test(file.name);
            })
          : droppedFiles;

      if (validFiles.length === 0) {
        return;
      }

      if (multiple) {
        // For multiple files, combine with existing or limit to max
        const newFiles = [...fileList, ...validFiles].slice(0, maxFiles);
        onChange(newFiles);
      } else {
        // For single file, just take the first valid one
        onChange(validFiles[0]);
      }
    },
    [disabled, multiple, accept, onChange, fileList, maxFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const selectedFiles = Array.from(e.target.files);

      if (multiple) {
        const newFiles = [...fileList, ...selectedFiles].slice(0, maxFiles);
        onChange(newFiles);
      } else {
        onChange(selectedFiles[0]);
      }
    },
    [multiple, onChange, fileList, maxFiles]
  );

  const dropZoneClasses = isDraggingOver
    ? "border-blue-500 bg-blue-50"
    : "border-gray-300 bg-gray-50";

  const dropContent = isDraggingOver ? (
    <>
      {multiple ? (
        <PlusCircleIcon className="w-12 h-12 text-blue-500 animate-bounce" />
      ) : (
        <DocumentArrowUpIcon className="w-12 h-12 text-blue-500 animate-bounce" />
      )}
      <p className="mt-2 text-sm font-medium text-blue-600">
        {multiple ? "Release to add files" : "Release to upload file"}
      </p>
    </>
  ) : (
    <>
      {multiple ? (
        <PlusCircleIcon className="w-10 h-10 text-gray-400" />
      ) : (
        <DocumentArrowUpIcon className="w-10 h-10 text-gray-400" />
      )}
      <p className="mt-1 text-sm text-gray-600">
        {multiple
          ? `Drop files here or click to browse`
          : `Drop file here or click to browse`}
      </p>
      {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {multiple && (
          <span className="text-xs text-gray-500">
            {fileCount} file{fileCount !== 1 ? "s" : ""} added
          </span>
        )}
      </div>

      <div
        className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${dropZoneClasses} ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="relative flex flex-col items-center justify-center pt-5 pb-6">
          {!multiple && fileList.length > 0 ? (
            // Single file selected view
            <>
              {fileList.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(multiple ? [] : null);
                  }}
                  className="absolute top-2 right-0 p-1 text-gray-500 hover:text-red-500 hover:bg-gray-200 rounded-full cursor-pointer"
                  aria-label="Remove file"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
              <DocumentPlusIcon className="w-10 h-10 text-green-500" />
              <p className="mt-1 text-sm text-gray-700 font-medium">
                {fileList[0].name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(fileList[0].size / 1024).toFixed(2)} KB
              </p>
            </>
          ) : (
            // Drop zone content
            dropContent
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleFileInputChange}
          disabled={disabled}
        />
      </div>

      {/* File list for multiple files */}
      {multiple && fileList.length > 0 && (
        <div className="mt-3 border rounded-lg border-gray-200 overflow-hidden">
          <h3 className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm font-medium">
            Selected Files
          </h3>
          <ul className="divide-y divide-gray-200">
            {fileList.map((file, index) => (
              <li
                key={index}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <DocumentArrowUpIcon className="w-5 h-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className={`text-red-500 hover:text-red-700 ${
                      disabled ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                    disabled={disabled}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default FileUploadBox;
