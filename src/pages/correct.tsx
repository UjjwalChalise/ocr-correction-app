import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { HighlightedText } from "../components/highlighted-text";
import { useOCRStore } from "../lib/store";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from 'lucide-react';

export default function CorrectPage() {
  const navigate = useNavigate();
  const { uploadedImage, ocrText, correctedText, highlightedWords } = useOCRStore();

  const handleSave = () => {
    // For now, this does nothing as requested
    console.log("Save clicked - functionality to be implemented");
  };

  const handleBack = () => {
    navigate("/");
  };

  if (!uploadedImage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <p className="text-gray-600 mb-4">No image uploaded. Please go back to dashboard.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Text Correction</h1>
              <p className="text-gray-600">Review and correct OCR detection results</p>
            </div>
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Uploaded Image Display */}
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Document</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded document"
                  className="max-w-full h-auto max-h-64 object-contain rounded border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Text Correction Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OCR Detection */}
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="text-lg">OCR Detection</CardTitle>
              </CardHeader>
              <CardContent className="h-full pb-6">
                <ScrollArea className="h-full pr-4">
                  <HighlightedText text={ocrText} highlightedWords={highlightedWords} highlightColor="red" />
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Corrected Word */}
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="text-lg">Corrected Word</CardTitle>
              </CardHeader>
              <CardContent className="h-full pb-6">
                <ScrollArea className="h-full pr-4">
                  <HighlightedText text={correctedText} highlightedWords={highlightedWords} highlightColor="green" />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button onClick={handleSave} size="lg" className="px-8 py-3 text-lg">
              <Save className="w-5 h-5 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}