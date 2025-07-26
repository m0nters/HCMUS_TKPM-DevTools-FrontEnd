import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { AlertMessage } from "../../../components/";
import { useChangePasswordMutation } from "../../../hooks/";
import {
  PasswordChangeFormData,
  passwordChangeSchema,
} from "../../../schemas/profile";
import { estimateReadingTime } from "../../../utils/";
import { PasswordChangeForm } from "./PasswordChangeForm";

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

  const onSubmit = useCallback(
    async (data: PasswordChangeFormData) => {
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
    },
    [changePasswordMutation, reset],
  );

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

      <PasswordChangeForm
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={changePasswordMutation.isPending}
      />
    </div>
  );
}
