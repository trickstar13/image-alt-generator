import { useState } from "react";
import useToast from "@/components/useToast.tsx";
import Toast from "@/components/Toast.tsx";

const ImageUpload = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [altText, setAltText] = useState("");
  const [cost, setCost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast, showToast } = useToast();

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

  return (
    <div className="mx-auto mt-8 max-w-md rounded-lg bg-white p-4 shadow-md">
      <input
        type="file"
        onChange={handleImageUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
      />
      {preview && (
        <img
          src={preview}
          alt="プレビュー"
          className="mt-4 h-auto max-w-full rounded-md"
        />
      )}
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
      {altText && (
        <div className="mt-4 rounded-md bg-gray-100 p-4">
          <p className="text-gray-700">{altText}</p>
          <button
            onClick={handleCopyToClipboard}
            className="mt-2 w-full rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            コピー
          </button>
          <h3 className="mb-2 mt-4 text-lg font-semibold">Cost:</h3>
          <p className="text-gray-700">{cost} JPY</p>
        </div>
      )}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
};

export default ImageUpload;
