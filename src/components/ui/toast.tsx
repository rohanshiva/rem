"use client";

import React from "react";
import { toast as sonnerToast } from "sonner";
import { Button } from "./button";

function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => (
    <Toast
      id={id}
      title={toast.title}
      description={toast.description}
      button={toast.button}
    />
  ));
}

/** A fully custom toast that still maintains the animations and interactions. */
function Toast(props: ToastProps) {
  const { title, description, button, id } = props;

  return (
    <div 
      className="flex rounded-md w-full max-w-md items-center px-4 py-2 cursor-grab"
      style={{
        backgroundColor: 'oklch(56.78% 0.05 262.04 / 0.3)',
        border: '1px solid oklch(77.16% 0.028 262.04 / 0.15)'
      }}
    >
      <div className="flex flex-1 items-center">
        <div className="w-full">
          {title && <p className="text-sm font-medium">{title}</p>}
          {description && (
            <p className={`text-sm ${title ? "mt-1" : ""}`}>{description}</p>
          )}
        </div>
      </div>
      {button && (
        <div className="ml-4 shrink-0">
          <Button
            size="sm"
            onClick={() => {
              button.onClick();
              sonnerToast.dismiss(id);
            }}
          >
            {button.label}
          </Button>
        </div>
      )}
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title?: string;
  description?: string;
  button?: {
    label: string;
    onClick: () => void;
  };
}

export { toast, Toast };
export type { ToastProps };