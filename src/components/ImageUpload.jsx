import React, { useState } from "react";
import useToast from "./useToast";
import Toast from "./Toast";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [altText, setAltText] = useState("");
  const [cost, setCost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast, showToast } = useToast();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setAltText(""); // 新しい画像がセットされたときにaltTextをクリア
    setCost(""); // コストもクリア
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
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
      <input
        type="file"
        onChange={handleImageUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
      />
      {preview && (
        <img
          src={preview}
          alt="プレビュー"
          className="mt-4 max-w-full h-auto rounded-md"
        />
      )}
      <button
        onClick={handleGenerateAlt}
        disabled={!image || isGenerating}
        className={`mt-4 w-full py-2 px-4 bg-blue-500 text-white rounded-md ${
          !image || isGenerating
            ? "opacity-50 cursor-not-allowed"
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
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p className="text-gray-700">{altText}</p>
          <button
            onClick={handleCopyToClipboard}
            className="mt-2 w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            コピー
          </button>
          <h3 className="text-lg font-semibold mt-4 mb-2">Cost:</h3>
          <p className="text-gray-700">{cost} JPY</p>
        </div>
      )}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
};

export default ImageUpload;
