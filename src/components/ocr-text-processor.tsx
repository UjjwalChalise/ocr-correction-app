import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Loader2, FileText, Zap, Clipboard, Sparkles } from "lucide-react";
import { apiService } from "../lib/api";
import { useAppState } from "../lib/app-context";
import { motion, AnimatePresence } from "framer-motion";

export function OCRTextProcessor() {
  const { state, setTexts, setMetrics } = useAppState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrInput, setOcrInput] = useState("");
  const [referenceInput, setReferenceInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleProcessText = async () => {
    if (!ocrInput.trim()) {
      setError("Please enter OCR text to process");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await apiService.processOCRText(
        ocrInput.trim(),
        referenceInput.trim() || undefined
      );

      setTexts(result.ocrSegments, result.correctedSegments);
      setMetrics(result.werScore, result.cerScore, result.missSpelledWords);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const loadSampleText = () => {
    setOcrInput(
      "Paitent suffrs from hyprtension and diabeetes. He was addmitted to the hospital with chest pain."
    );
    setReferenceInput(
      "Patient suffers from hypertension and diabetes. He was admitted to the hospital with chest pain."
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              OCR Text Refiner
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Reference Text Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Reference Text (Optional)
              </label>
              
            </div>
            <textarea
              className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter the correct reference text here..."
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value)}
            />
          </div>

          {/* OCR Text Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                OCR Text (Required)
              </label>
        
            </div>
            <textarea
              className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter the OCR detected text here..."
              value={ocrInput}
              onChange={(e) => setOcrInput(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleProcessText}
              disabled={isProcessing || !ocrInput.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md transition-all"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Refine Text
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={loadSampleText}
              disabled={isProcessing}
              className="border-gray-300 hover:bg-gray-50"
              size="lg"
            >
              Load Sample
            </Button>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Preview */}
          {state.ocrText.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h4 className="font-medium text-gray-700">Refinement Results</h4>
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-100"
                >
                  <div className="text-2xl font-bold text-red-600">
                    {state.werScore}%
                  </div>
                  <div className="text-xs text-red-500 mt-1">Word Error Rate</div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm border border-orange-100"
                >
                  <div className="text-2xl font-bold text-orange-600">
                    {state.cerScore}%
                  </div>
                  <div className="text-xs text-orange-500 mt-1">
                    Character Error Rate
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-100"
                >
                  <div className="text-2xl font-bold text-blue-600">
                    {state.missSpelledWords}
                  </div>
                  <div className="text-xs text-blue-500 mt-1">
                    Spelling Errors
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}