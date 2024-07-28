import { useState } from "react";

const useToast = () => {
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast({ message: "", visible: false });
    }, 3000);
  };

  return { toast, showToast };
};

export default useToast;
