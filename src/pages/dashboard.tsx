import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TiffViewer } from "../components/tiff-viewer";
import { MetricsDisplay } from "../components/metrics-display";
import { OCRTextProcessor } from "../components/ocr-text-processor";
import { APIStatus } from "../components/api-status";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../lib/app-context";

export default function Dashboard() {
  const navigate = useNavigate();
  const { state } = useAppState();

  const handleCorrectClick = () => {
    navigate("/correct");
  };

  const hasProcessedText = state.ocrText.length > 0;

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* Header */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">OCR Dashboard</h1>
            <p className="dashboard-subtitle">Upload images and process OCR text with AI-powered correction</p>
          </div>

          {/* API Status */}
          <APIStatus />

          {/* Two-column layout */}
          <div className="dashboard-grid">
            {/* Left Column - TIFF Viewer */}
            <div className="dashboard-left">
              <Card>
                <CardHeader>
                  <CardTitle>Document Viewer</CardTitle>
                </CardHeader>
                <CardContent>
                  <TiffViewer />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - OCR Processing */}
            <div className="dashboard-right">
              <OCRTextProcessor />
            </div>
          </div>

          {/* Metrics Display */}
          {hasProcessedText && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetricsDisplay />
                </CardContent>
              </Card>

              {/* Correct Button */}
              <div className="correct-button-container">
                <Button onClick={handleCorrectClick} size="lg" className="correct-button">
                  View Corrections
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}