import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { TiffViewer } from "../components/tiff-viewer";
import { MetricsDisplay } from "../components/metrics-display";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../lib/app-context";

export default function Dashboard() {
  const navigate = useNavigate();
  const { state } = useAppState();

  const handleCorrectClick = () => {
    navigate("/correct");
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* Header */}
          <div className="dashboard-header">
            <h1 className="dashboard-title">OCR Dashboard</h1>
            <p className="dashboard-subtitle">Upload and analyze document images</p>
          </div>

          {/* TIFF Viewer Section */}
          <Card>
            <CardHeader>
              <CardTitle>Document Viewer</CardTitle>
            </CardHeader>
            <CardContent>
              <TiffViewer />
            </CardContent>
          </Card>

          {/* Metrics Display */}
          {state.uploadedImage && (
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
                  Correct
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}