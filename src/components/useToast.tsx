import { useState } from "react";

const useToast = () => {
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = (message: string, options?: { type: string }) => {
    setToast({ message, visible: true });
  };

  const hideToast = () => {
    setToast({ message: "", visible: false });
  };

  return { toast, showToast, hideToast };
};

export default useToast;
