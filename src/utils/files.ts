/**
 * Validates files against accepted file types
 * @param files Array of files to validate
 * @param accept String of comma-separated accepted file extensions
 * @returns Object containing valid files and invalid files
 */
export const validateFileTypes = (files: File[], accept: string) => {
  if (accept === "*") {
    return { validFiles: files, invalidFiles: [] };
  }

  // Parse accepted file types
  const acceptedTypes = accept
    .split(",")
    .map((type) => type.trim().toLowerCase().replace(".", "\\."));
  const regex = new RegExp(`(${acceptedTypes.join("|")})$`, "i");

  // Split files into valid and invalid
  const validFiles = files.filter((file) => regex.test(file.name));
  const invalidFiles = files.filter((file) => !regex.test(file.name));

  return { validFiles, invalidFiles };
};
