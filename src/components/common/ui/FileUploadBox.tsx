import { useState, useRef, useCallback } from "react";
import {
  DocumentArrowUpIcon,
  DocumentPlusIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { validateFileTypes } from "../../../utils/";

interface FileUploadBoxProps {
  label: string;
  multiple?: boolean;
  accept?: string; // make it the same as the `accept` prop of <input type="file" />
  files: File | File[] | null;
  onChange: (files: File | File[] | null) => void;
  onRemoveFileAtIndex?: (index: number) => void;
  onError?: (message: string) => void; // Add this new prop

  disabled?: boolean;
  required?: boolean;
  title?: string;
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
 * @param {function} [onRemoveFileAtIndex] - Callback to remove a file at specified index, only for multiple
 * @param {function} [onError] - Callback for error messages (e.g. invalid file type)
 * @param {boolean} [disabled=false] - Whether the upload is disabled
 * @param {boolean} [required=false] - Whether the field is required
 * @param {string} [title] - Title displayed in the upload area
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

export function FileUploadBox({
  label,
  multiple = false,
  accept = "*",
  files,
  onChange,
  onRemoveFileAtIndex,
  onError,
  disabled = false,
  required = false,
  title,
  helperText,
  maxFiles = Infinity,
}: FileUploadBoxProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileList = multiple ? (files as File[]) : files ? [files as File] : [];
  const fileCount = fileList.length;
  const fileTypes = accept.split(",").join(", "); // for text display

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDraggingOver(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  }, []);

  // Add this helper function to handle files from any source
  const processFiles = useCallback(
    (inputFiles: File[]) => {
      // Validate files against accepted types
      const { validFiles, invalidFiles } = validateFileTypes(
        inputFiles,
        accept,
      );

      // Handle invalid files
      if (invalidFiles.length > 0 && onError) {
        const message = multiple
          ? `Only ${fileTypes} files are supported. ${
              invalidFiles.length
            } invalid file${
              invalidFiles.length !== 1 ? "s were" : " was"
            } rejected.`
          : `Only ${fileTypes} files are supported.`;
        onError(message);

        // If all files are invalid, stop processing
        if (invalidFiles.length === inputFiles.length) return;
      }

      // Skip if no valid files
      if (validFiles.length === 0) return;

      // Update with new files
      onChange(
        multiple
          ? [...fileList, ...validFiles].slice(0, maxFiles)
          : validFiles[0],
      );
    },
    [multiple, accept, fileTypes, onChange, fileList, maxFiles, onError],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);

      if (disabled) return;

      // e.g. dragging text, image,...
      if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) {
        // onError?.("Bullshit 🖕");
        onError?.("No files were dropped");
        return;
      }

      // Process the dropped files
      processFiles(Array.from(e.dataTransfer.files));
    },
    [disabled, onError, processFiles],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        onError?.("No files were selected");
        return;
      }

      // Process the selected files
      processFiles(Array.from(e.target.files));
    },
    [disabled, processFiles],
  );

  const dropZoneClasses = isDraggingOver
    ? "border-blue-500 bg-blue-50"
    : "border-gray-300 bg-gray-50";

  const dropContent = isDraggingOver ? (
    <>
      {multiple ? (
        <PlusCircleIcon className="h-12 w-12 animate-bounce text-blue-500" />
      ) : (
        <DocumentArrowUpIcon className="h-12 w-12 animate-bounce text-blue-500" />
      )}
      <p className="mt-2 text-sm font-medium text-blue-600">
        {multiple ? "Release to add files" : "Release to upload file"}
      </p>
    </>
  ) : (
    <>
      {multiple ? (
        <PlusCircleIcon className="h-10 w-10 text-gray-400" />
      ) : (
        <DocumentArrowUpIcon className="h-10 w-10 text-gray-400" />
      )}
      <p className="mt-1 text-sm text-gray-600">
        {title ||
          (multiple
            ? `Drop files here or click to browse`
            : `Drop file here or click to browse`)}
      </p>
      {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </>
  );

  return (
    <>
      <div className="mb-1 flex items-center justify-between">
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
        className={`flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed text-center transition-colors hover:bg-gray-100 ${dropZoneClasses} ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="pointer-events-none relative flex min-w-24 flex-col items-center justify-center pt-5 pb-6">
          {!multiple && fileList.length > 0 ? (
            // Single file selected view
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="pointer-events-auto absolute top-2 right-0 cursor-pointer rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-red-500"
                aria-label="Remove file"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
              <DocumentPlusIcon className="h-10 w-10 text-green-500" />
              <p className="mt-1 text-sm font-medium text-gray-700">
                {fileList[0].name}
              </p>
              <p className="mt-1 text-xs text-gray-500">
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
        <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
          <h3 className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium">
            Selected Files
          </h3>
          <ul className="divide-y divide-gray-200">
            {fileList.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-start">
                  <p className="mr-4 text-sm font-medium text-gray-700">
                    {index + 1}
                  </p>
                  <DocumentArrowUpIcon className="mr-2 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveFileAtIndex?.(index)}
                  className={`text-red-500 hover:text-red-700 ${
                    disabled ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  disabled={disabled}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
