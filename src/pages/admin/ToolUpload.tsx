import { useState, useCallback } from "react";
import { uploadPlugin } from "../../services/admin/pluginService";
import { eventBus, EVENTS } from "../../services/eventBus";
import {
  AlertMessage,
  Button,
  FileUploadBox,
  InfoBox,
} from "../../components/common";
import { estimateReadingTime } from "../../utils/";

function ToolUpload() {
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [libraryFiles, setLibraryFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  const handleMainFileChange = useCallback((file: File) => {
    setMainFile(file); // assume file is valid, since all the validation is done in `FileUploadBox` component
  }, []);

  const handleLibraryFilesChange = useCallback((files: File[]) => {
    setLibraryFiles(files); // assume files are valid, since all the validation is done in `FileUploadBox` component
  }, []);

  const removeLibraryFile = useCallback((index: number) => {
    setLibraryFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 2FA, this is optional since we have checked this in the submit button already
    if (!mainFile) {
      setUploadStatus({
        isError: true,
        message: "Please select a main plugin file to upload.",
      });
      return;
    }

    setUploading(true);
    setUploadStatus(null); // Reset status message

    try {
      const response = await uploadPlugin(mainFile, libraryFiles);

      if (response.success) {
        setUploadStatus({
          isError: false,
          message: response.message || "Plugin was uploaded successfully!",
        });

        // Reset form
        setMainFile(null);
        setLibraryFiles([]);

        // Emit event to refresh any plugin lists
        eventBus.emit(EVENTS.SIDEBAR_REFRESH);
      } else {
        setUploadStatus({
          isError: true,
          message:
            response.message || "Failed to upload plugin. Please try again.",
        });
      }
    } catch (error: any) {
      setUploadStatus({
        isError: true,
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

      <InfoBox
        title="Upload Instructions"
        content={[
          "You need to upload the main plugin DLL file and optionally any library DLLs required by the plugin.",
          "Only .dll files are supported. You can drag and drop files into the upload areas or click to select files.",
        ]}
        type="info"
      />

      {/* Upload status message */}
      {uploadStatus && (
        <AlertMessage
          message={uploadStatus.message}
          isError={uploadStatus.isError}
          duration={estimateReadingTime(uploadStatus.message)}
          onDismiss={() => {
            setUploadStatus(null);
          }}
          position="top-center"
        />
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
              onError={(message) => {
                setUploadStatus({
                  isError: true,
                  message: message,
                });
              }}
              disabled={uploading}
              required={true}
              title="Drop main plugin file here or click to browse"
              helperText="Only .dll files are supported"
            />

            {/* Library Files upload */}
            <FileUploadBox
              label="Library Files (.dll) - Optional"
              accept=".dll"
              multiple={true}
              files={libraryFiles}
              onChange={handleLibraryFilesChange}
              onError={(message) => {
                setUploadStatus({
                  isError: true,
                  message: message,
                });
              }}
              onRemoveFileAtIndex={removeLibraryFile}
              disabled={uploading}
              title="Drop library files here or click to browse"
              helperText="Multiple files allowed"
            />

            {/* Submit button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={uploading || !mainFile}
                className="w-auto" // Override full-width default
              >
                {uploading
                  ? "Uploading..."
                  : !mainFile
                  ? "Waiting for the main file..."
                  : "Upload Plugin"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ToolUpload;
