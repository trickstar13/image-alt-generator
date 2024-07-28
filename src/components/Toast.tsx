const Toast = ({ message, visible }: { message: string; visible: boolean }) => {
  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 transform rounded-md bg-black px-4 py-2 text-white transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
