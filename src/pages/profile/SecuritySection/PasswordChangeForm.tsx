import { memo } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Button, PasswordInput } from "../../../components/";
import { PasswordChangeFormData } from "../../../schemas/profile";

interface PasswordChangeFormProps {
  register: UseFormRegister<PasswordChangeFormData>;
  errors: FieldErrors<PasswordChangeFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
}

export const PasswordChangeForm = memo(function PasswordChangeForm({
  register,
  errors,
  onSubmit,
  isLoading,
}: PasswordChangeFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <PasswordInput
        label="Current Password"
        {...register("oldPassword")}
        error={errors.oldPassword?.message}
        disabled={isLoading}
      />

      <PasswordInput
        label="New Password"
        {...register("newPassword")}
        error={errors.newPassword?.message}
        helpText="Minimum 8 characters, with uppercase, lowercase, number and special character."
        disabled={isLoading}
      />

      <PasswordInput
        label="Confirm New Password"
        {...register("confirmNewPassword")}
        error={errors.confirmNewPassword?.message}
        disabled={isLoading}
      />

      <div className="pt-4">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Updating..." : "Change Password"}
        </Button>
      </div>
    </form>
  );
});
