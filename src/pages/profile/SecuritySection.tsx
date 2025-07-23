import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertMessage, Button, PasswordInput } from "../../components/";
import { useChangePasswordMutation } from "../../hooks/";
import {
  PasswordChangeFormData,
  passwordChangeSchema,
} from "../../schemas/profile";
import { estimateReadingTime } from "../../utils/";

export function SecuritySection() {
  const [updateStatus, setUpdateStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const changePasswordMutation = useChangePasswordMutation();

  const onSubmit = async (data: PasswordChangeFormData) => {
    setUpdateStatus(null);
    changePasswordMutation.mutate(data, {
      onSuccess: (response: any) => {
        setUpdateStatus({
          isError: false,
          message: response.message || "Password changed successfully!",
        });
        reset(); // Clear form
      },
      onError: (err: any) => {
        setUpdateStatus({
          isError: true,
          message:
            err.message || "Failed to change password. Please try again.",
        });
      },
    });
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <PasswordInput
          label="Current Password"
          {...register("oldPassword")}
          error={errors.oldPassword?.message}
          disabled={changePasswordMutation.isPending}
        />

        <PasswordInput
          label="New Password"
          {...register("newPassword")}
          error={errors.newPassword?.message}
          helpText="Minimum 8 characters, with uppercase, lowercase, number and special character."
          disabled={changePasswordMutation.isPending}
        />

        <PasswordInput
          label="Confirm New Password"
          {...register("confirmNewPassword")}
          error={errors.confirmNewPassword?.message}
          disabled={changePasswordMutation.isPending}
        />

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending
              ? "Updating..."
              : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
