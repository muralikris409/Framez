"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { uploadImage } from "../actions/s3Handler"; // Import the server action
import { axiosInstance } from "../axiosInstance/axios";
import { toast } from "react-toastify";

export default function CreatePost() {
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [image, setImage] =  useState<string | null>(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  const handleImageChange = (e:any) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") 
       setImage(reader.result);
    };
  };

  const handlePost = async () => {
    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await uploadImage(formData);

    if (response?.url) {
      console.log("Uploaded Image URL:", response.url);
      await axiosInstance.post("api/post",{
        caption,
        imageUrl:response?.url,
      });
      toast("Post uploaded")
    } else {
      alert(response?.error || "Upload failed");
    }

    setUploading(false);
    setIsOpen(false);
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
              {image ? (
                <img
                  src={image}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg mb-2"
                />
              ) : (
                <label className="flex items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
                  <span className="text-gray-400">Upload Image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
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
