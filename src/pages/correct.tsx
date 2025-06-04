import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { HighlightedText } from "../components/highlighted-text";
import { useAppState } from "../lib/app-context";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Download, RefreshCw } from 'lucide-react';
import { apiService } from "../lib/api";

export default function CorrectPage() {
  const navigate = useNavigate();
  const { state, setTexts, setMetrics } = useAppState();
  const [isSaving, setIsSaving] = useState(false);
  const [isReprocessing, setIsReprocessing] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Corrections saved successfully");
      // Here you would typically save to a database or file
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const correctedText = state.correctedText.map(segment => segment.text).join('');
    const blob = new Blob([correctedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'corrected-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReprocess = async () => {
    setIsReprocessing(true);
    try {
      const ocrText = state.ocrText.map(segment => segment.text).join('');
      const result = await apiService.processOCRText(ocrText);
      
      setTexts(result.ocrSegments, result.correctedSegments);
      setMetrics(result.werScore, result.cerScore, result.missSpelledWords);
    } catch (error) {
      console.error("Reprocessing failed:", error);
    } finally {
      setIsReprocessing(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  if (state.ocrText.length === 0) {
    return (
      <div className="error-page">
        <Card className="error-card">
          <p className="error-message">No text processed yet. Please go back to dashboard and process some text.</p>
          <Button onClick={handleBack}>
            <ArrowLeft size={16} className="btn-icon" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="correct-page">
      <div className="correct-container">
        <div className="correct-content">
          {/* Header */}
          <div className="correct-header">
            <div>
              <h1 className="correct-title">Text Correction</h1>
              <p className="correct-subtitle">Review and manage OCR correction results</p>
            </div>
            <div className="correct-actions">
              <Button variant="outline" onClick={handleReprocess} disabled={isReprocessing}>
                {isReprocessing ? (
                  <>
                    <RefreshCw size={16} className="btn-icon animate-spin" />
                    Reprocessing...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} className="btn-icon" />
                    Reprocess
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft size={16} className="btn-icon" />
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Metrics Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Correction Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="metrics-summary">
                <div className="metric-item">
                  <span className="metric-label">Word Error Rate:</span>
                  <span className="metric-value text-red-600">{state.werScore}%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Character Error Rate:</span>
                  <span className="metric-value text-orange-600">{state.cerScore}%</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Corrections Made:</span>
                  <span className="metric-value text-blue-600">{state.missSpelledWords}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Image Display */}
          {state.uploadedImage && (
            <Card>
              <CardHeader>
                <CardTitle>Source Document</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="image-display">
                  <img
                    src={state.uploadedImage || "/placeholder.svg"}
                    alt="Uploaded document"
                    className="document-image"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Text Correction Section */}
          <div className="text-correction-grid">
            {/* OCR Detection */}
            <Card className="text-card">
              <CardHeader>
                <CardTitle className="text-card-title">
                  Original OCR Text
                  <span className="error-count">({state.missSpelledWords} errors)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-card-content">
                <ScrollArea className="text-scroll">
                  <HighlightedText segments={state.ocrText} highlightColor="red" />
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Corrected Text */}
            <Card className="text-card">
              <CardHeader>
                <CardTitle className="text-card-title">
                  Corrected Text
                  <span className="correction-count">({state.missSpelledWords} corrections)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-card-content">
                <ScrollArea className="text-scroll">
                  <HighlightedText segments={state.correctedText} highlightColor="green" />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <Button onClick={handleExport} variant="outline" size="lg">
              <Download size={20} className="btn-icon" />
              Export Text
            </Button>
            <Button onClick={handleSave} size="lg" disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw size={20} className="btn-icon animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} className="btn-icon" />
                  Save Corrections
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}