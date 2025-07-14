import { useState } from "react";
import { AlertMessage, Button, PasswordInput } from "../../components/";
import { changePassword } from "../../services/";
import { estimateReadingTime } from "../../utils/";

export function SecuritySection() {
  const [oldPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmPassword] = useState("");
  const [updateStatus, setUpdateStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateStatus(null);

    if (newPassword !== confirmNewPassword) {
      setUpdateStatus({
        isError: true,
        message: "New passwords don't match.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await changePassword({
        oldPassword,
        newPassword,
        confirmNewPassword,
      });
      if (response.success) {
        // Success case
        setUpdateStatus({
          isError: false,
          message: response.message,
        });
      } else {
        setUpdateStatus({
          isError: true,
          message: response.message,
        });
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      // Handle error from API
      setUpdateStatus({
        isError: true,
        message: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="border-b pb-4 text-xl font-semibold">
        Security & Password
      </h2>

      {updateStatus && (
        <AlertMessage
          message={updateStatus.message}
          isError={updateStatus.isError}
          duration={estimateReadingTime(updateStatus.message)}
          onDismiss={() => setUpdateStatus(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          label="Current Password"
          value={oldPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          helpText="Minimum 8 characters, with uppercase, lowercase, number and special character."
        />

        <PasswordInput
          label="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div className="pt-4">
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Updating..." : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
