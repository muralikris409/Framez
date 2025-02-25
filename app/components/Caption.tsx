"use client"
import { useState } from "react";

export default function CaptionSection({ caption }: { caption: string }) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 45; 

  return (
    <div className="flex flex-row p-1 px-2  rounded-lg max-w-md overflow-hidden">
      <p className="text-gray-800 max-w-full">
        {expanded ? caption : (caption.slice(0, maxLength))}
        {caption.length > maxLength && !expanded && " "}
        {caption.length > maxLength && (
        <button
          onClick={() => setExpanded(!expanded)}
          className=" text-pink-500 hover:underline"
        >
          {expanded ? "...less" : "more..."}
        </button>
      )}
      </p>
     
    </div>
  );
}
