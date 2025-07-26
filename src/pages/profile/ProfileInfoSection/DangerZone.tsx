import {
  ExclamationTriangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { memo } from "react";

interface DangerZoneProps {
  onDeleteClick: () => void;
  isDeleting: boolean;
}

export const DangerZone = memo(function DangerZone({
  onDeleteClick,
  isDeleting,
}: DangerZoneProps) {
  return (
    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-6">
      <div className="flex items-start gap-3">
        <ExclamationTriangleIcon className="mt-0.5 h-6 w-6 text-red-600" />
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-semibold text-red-900">
            Danger Zone
          </h3>
          <p className="mb-4 text-red-700">
            Once you delete your account, there is no going back. This action
            cannot be undone. All your data, including favorites and
            preferences, will be permanently removed.
          </p>
          <button
            onClick={onDeleteClick}
            disabled={isDeleting}
            className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:bg-red-400"
          >
            <TrashIcon className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
});
