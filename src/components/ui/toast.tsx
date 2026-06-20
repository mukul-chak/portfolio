"use client";

// AlignUI Toast v0.0.0

import { type ReactElement } from "react";
import { toast as sonnerToast, Toaster, type ToasterProps } from "sonner";

const defaultOptions: ToasterProps = {
  className: "group/toast",
  position: "bottom-center",
};

const customToast = (
  renderFunc: (t: string | number) => ReactElement,
  options: ToasterProps = {},
) => {
  const mergedOptions = { ...defaultOptions, ...options };
  return sonnerToast.custom(renderFunc, mergedOptions);
};

const toast = {
  ...sonnerToast,
  custom: customToast,
};

export { toast, Toaster };
