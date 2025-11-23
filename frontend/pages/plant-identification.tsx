"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function PlantIdentification() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [plantInfo, setPlantInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const identifyPlant = async () => {
    if (!selectedImage) {
      alert("Please upload an image first!");
      return;
    }
  
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("organs", "leaf"); // Specify plant part (e.g., leaf, flower)
      formData.append("images", selectedImage);
  
      // Log the FormData content (only for debugging)
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
  
      // Use backend endpoint to identify the plant
      const response = await axios.post(
        "http://localhost:8000/api/identify-plant", // Backend API endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setPlantInfo(response.data);
    } catch (error) {
      console.error("Error identifying plant:", error);
      alert("Failed to identify the plant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">Plant Identification</h1>
      <p className="text-gray-600 mb-4">
        Upload an image of a plant to identify it using our system.
      </p>

      {/* File Upload Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {/* Identify Button */}
      <Button
        onClick={identifyPlant}
        disabled={loading}
        className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md"
      >
        {loading ? "Identifying..." : "Identify Plant"}
      </Button>

      {/* Display Results */}
      {plantInfo && (
        <div className="mt-6 bg-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-bold mb-2">Plant Details:</h3>
          {plantInfo?.results?.map((result: any, index: number) => (
            <div key={index} className="mb-4">
              <p>
                <strong>Name:</strong> {result.species?.scientificName || "N/A"}
              </p>
              <p>
                <strong>Probability:</strong> {(result.score * 100).toFixed(2)}%
              </p>
              {result.species?.url && (
                <p>
                  <strong>More Info:</strong>{" "}
                  <a
                    href={result.species.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    Click here
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
