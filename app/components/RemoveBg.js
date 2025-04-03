"use client";

import Image from "next/image";
import React, { useState } from "react";

export default function RemoveBg() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📌 Image Select करने पर Preview दिखाएं
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 📌 Background Remove API Call
  const handleRemoveBg = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process image");

      const data = await response.json();
      console.log("API Response:", data);

      if (data.imageUrl) {
        const buff = data.imageUrl
        // console.log("buff", buff)

        const base64Image = Buffer.from(buff.data).toString("base64");
        // console.log("data 1", base64Image)

        const imageUrl = `data:image/png;base64,${base64Image}`;
        // console.log("data 2")
        setOutput(imageUrl);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-gray-900 min-h-screen">
      {/* 📌 Image Upload */}
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {/* 📌 Original Image Preview */}
      {preview && (
        <div className="flex gap-4">
          <div>
            <p className="text-center text-sm font-semibold">Original Image</p>
            <img src={preview} alt="Preview" className="w-48 h-48 object-cover border" />
          </div>

          {/* 📌 Removed BG Image */}
          {output && (
            <div>
              <p className="text-center text-sm font-semibold">Removed BG</p>
              <img src={output} alt="Removed BG" className="w-48 h-48 object-cover border" />
            </div>
          )}
        </div>
      )}

      {/* 📌 Remove Background Button */}
      <button
        onClick={handleRemoveBg}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Remove Background"}
      </button>

      {/* 📌 Download Button */}
      {output && (
        <a href={output} download="removed-bg.png" className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
          Download Image
        </a>
      )}
    </div>
  );
}
