"use client";

import { useState } from "react";
import { CheckoutModal } from "./CheckoutModal";

interface CheckoutButtonProps {
  packageId?: string;
  children: React.ReactNode;
  className?: string;
}

export function CheckoutButton({ packageId, children, className }: CheckoutButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {children}
      </button>
      <CheckoutModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        preselectedPackage={packageId}
      />
    </>
  );
}
