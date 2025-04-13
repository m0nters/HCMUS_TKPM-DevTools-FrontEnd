import { useState } from "react";
import { AlertMessage, Button, PasswordInput } from "../../components/common";
import { changePassword } from "../../services/user/";
import { estimateReadingTime } from "../../utils/string";

function SecuritySection() {
  const [oldPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmNewPassword) {
      setError("New passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({
        oldPassword,
        newPassword,
        confirmNewPassword,
      });

      // Success case
      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      // Handle error from API
      setError("Failed to change password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold border-b pb-4">
        Security & Password
      </h2>

      {error && (
        <AlertMessage
          message={error}
          isError={true}
          duration={estimateReadingTime(error)}
          onDismiss={() => setError("")}
        />
      )}

      {success && (
        <AlertMessage
          message={success}
          isError={false}
          duration={estimateReadingTime(success)}
          onDismiss={() => setSuccess("")}
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

export default SecuritySection;
