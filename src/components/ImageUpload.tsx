import { useState, useRef } from "react";
import useToast from "@/components/useToast.tsx";
import Toast from "@/components/Toast.tsx";

const ImageUpload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [altText, setAltText] = useState("");
  const [cost, setCost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast, showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setAltText("");
    setCost("");
  };

  const handleGenerateAlt = async () => {
    if (!image) return;

    setIsGenerating(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch("/api/generate-alt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate alt text");
      }

      const data = await response.json();
      setAltText(data.alt);
      setCost(data.cost); // コストを設定
    } catch (error) {
      console.error("Error generating alt text:", error);
      showToast("Altテキストの生成に失敗しました。");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(altText);
    showToast("Altテキストがクリップボードにコピーされました！");
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview("");
    setAltText("");
    setCost("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-md rounded-lg bg-white p-4 shadow-md">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
      />
      {preview && (
        <div className="relative mt-4">
          <img
            src={preview}
            alt="プレビュー"
            className="h-auto max-w-full rounded-md"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute -right-4 -top-4 m-2 flex size-6 items-center justify-center rounded-full border bg-white/[50] leading-none text-black hover:ring-2 hover:ring-black"
            aria-label="画像を削除"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
      {!altText && (
        <button
          onClick={handleGenerateAlt}
          disabled={!image || isGenerating}
          className={`mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white ${
            !image || isGenerating
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-blue-600"
          }`}
        >
          {!image
            ? "画像を選択してください"
            : isGenerating
              ? "生成中..."
              : "altを生成"}
        </button>
      )}
      {altText && (
        <>
          <h2 className="mb-1 mt-4 text-lg font-semibold">Altテキスト</h2>
          <div className="rounded-md bg-gray-100 p-4">
            <p className="text-gray-700">{altText}</p>
            <button
              onClick={handleCopyToClipboard}
              className="mt-2 w-full rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              コピー
            </button>
          </div>
          <p className="mt-2 text-right text-sm text-gray-700">
            生成コスト：{cost} JPY
          </p>
        </>
      )}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
};

export default ImageUpload;
