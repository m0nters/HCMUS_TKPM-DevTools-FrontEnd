import { useState, useCallback } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { uploadPlugin } from "../../services/admin/pluginService";
import { eventBus, EVENTS } from "../../services/eventBus";
import { AlertMessage, FileUploadBox } from "../../components/common";
import { estimateReadingTime } from "../../utils/string";
import { useNavigate } from "react-router-dom";

function ToolUpload() {
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [libraryFiles, setLibraryFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const navigate = useNavigate();

  const handleMainFileChange = useCallback((file: File) => {
    if (file === null) {
      setMainFile(null);
      setUploadStatus({ type: null, message: "" });
      return;
    }
    if (!file.name.endsWith(".dll")) {
      setUploadStatus({
        type: "error",
        message: "Only .dll files are supported for the main plugin.",
      });
      return;
    }
    setMainFile(file);
    setUploadStatus({ type: null, message: "" });
  }, []);

  const handleLibraryFilesChange = useCallback((files: File[]) => {
    const nonDllFiles = files.filter((file) => !file.name.endsWith(".dll"));
    if (nonDllFiles.length > 0) {
      setUploadStatus({
        type: "error",
        message: "Only .dll files are supported for libraries.",
      });
      return;
    }
    setLibraryFiles(files);
    setUploadStatus({ type: null, message: "" });
  }, []);

  const removeLibraryFile = useCallback((index: number) => {
    setLibraryFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate main plugin file
    if (!mainFile) {
      setUploadStatus({
        type: "error",
        message: "Please select a main plugin file to upload.",
      });
      return;
    }

    setUploading(true);
    setUploadStatus({ type: null, message: "" });

    try {
      const response = await uploadPlugin(mainFile, libraryFiles);

      if (response.success) {
        setUploadStatus({
          type: "success",
          message: response.message || "Plugin was uploaded successfully!",
        });

        // Reset form
        setMainFile(null);
        setLibraryFiles([]);

        // Emit event to refresh any plugin lists
        eventBus.emit(EVENTS.SIDEBAR_REFRESH);
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload failed:", error);
      setUploadStatus({
        type: "error",
        message: error.message || "Failed to upload plugin. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Upload New Tool Plugin
        </h1>
      </div>

      {/* Upload Instructions */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex items-start">
          <div className="mr-3 shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              Upload Instructions
            </h3>
            <div className="mt-1 text-sm text-blue-700">
              <p>
                You need to upload the main plugin DLL file and optionally any
                library DLLs required by the plugin.
              </p>
              <p className="mt-1">
                Only .dll files are supported. You can drag and drop files into
                the upload areas or click to select files.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload status message */}
      {uploadStatus.type && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
          <AlertMessage
            message={uploadStatus.message}
            isError={uploadStatus.type !== "success" || false}
            duration={estimateReadingTime(uploadStatus.message)}
            onDismiss={() => {
              // Update URL without triggering navigation/reload
              navigate(location.pathname, {
                replace: true,
              });
            }}
          />
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Main Plugin File upload */}
            <FileUploadBox
              label="Main Plugin File (.dll)"
              accept=".dll"
              files={mainFile}
              onChange={handleMainFileChange}
              disabled={uploading}
              required={true}
              helperText="Only .dll files are supported"
            />

            {/* Library Files upload */}
            <FileUploadBox
              label="Library Files (.dll) - Optional"
              accept=".dll"
              multiple={true}
              files={libraryFiles}
              onChange={handleLibraryFilesChange}
              onRemove={removeLibraryFile}
              disabled={uploading}
              helperText="Multiple files allowed"
            />

            {/* Submit button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading || !mainFile}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  uploading || !mainFile
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 cursor-pointer"
                } transition-colors`}
              >
                {uploading
                  ? "Uploading..."
                  : !mainFile
                  ? "Waiting for the main file..."
                  : "Upload Plugin"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ToolUpload;
