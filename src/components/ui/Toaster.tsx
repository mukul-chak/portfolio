"use client";

import { type ReactNode } from "react";
import { Toast } from "@base-ui/react/toast";

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="w-[260px] rounded-lg border border-rule bg-white px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0"
    >
      <Toast.Title className="text-[14px] font-bold text-heading" />
      <Toast.Description className="mt-0.5 text-[13px] text-muted" />
    </Toast.Root>
  ));
}

/** App-wide toast provider + bottom-center viewport. */
export default function Toaster({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider>
      {children}
      <Toast.Portal>
        <Toast.Viewport className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}
