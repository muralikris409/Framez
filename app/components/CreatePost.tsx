"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { uploadImage } from "../actions/s3Handler";
import { axiosInstance } from "../axiosInstance/axios";
import { toast } from "react-toastify";

export default function CreatePost() {
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  const handleMediaChange = (file: File) => {
    if (!file) return;

    setMediaFile(file);

    if (file.type.startsWith("image/")) {
      setMediaType("image");
    } else if (file.type.startsWith("video/")) {
      setMediaType("video");
    } else {
      alert("Unsupported file type");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") setMedia(reader.result);
    };
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleMediaChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleMediaChange(file);
  };

  const handlePost = async () => {
    if (!mediaFile) {
      alert("Please select an image or video");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", mediaFile);

    const response = await uploadImage(formData);

    if (response?.url) {
      console.log("Uploaded Media URL:", response.url);
      await axiosInstance.post("api/post", {
        caption,
        mediaUrl: response.url,
        mediaType: mediaType,
      });
      toast("Post uploaded");
    } else {
      alert(response?.error || "Upload failed");
    }

    setUploading(false);
    setIsOpen(false);
    setCaption("");
    setMedia(null);
    setMediaFile(null);
    setMediaType(null);
  };

  return (
    <div className="my-4 mx-2 w-2/2">
      <button
        onClick={toggleModal}
        className="bg-pink-500 w-full text-white px-4 py-2 rounded-lg hover:bg-pink-600"
      >
        Create Post
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 rounded-lg p-4 shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={toggleModal}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-lg font-bold mb-4 text-center">Create Post</h2>
            <div className="mb-4">
              {media ? (
                mediaType === "image" ? (
                  <img
                    src={media}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <video
                    src={media}
                    controls
                    className="w-full h-64 object-cover rounded-lg mb-2"
                  />
                )
              ) : (
                <label
                  className={`flex items-center justify-center w-full h-64 border-2 ${
                    dragActive
                      ? "border-pink-500 bg-pink-50"
                      : "border-dashed border-gray-300"
                  } rounded-lg cursor-pointer`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <span className="text-gray-400">
                    {dragActive
                      ? "Drop file here..."
                      : "Drag & Drop or Click to Upload Image or Video"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileInputChange}
                  />
                </label>
              )}
            </div>
            <textarea
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            ></textarea>
            <button
              onClick={handlePost}
              className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
