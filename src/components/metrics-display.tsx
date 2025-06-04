import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useOCRStore } from "../lib/store";

export function MetricsDisplay() {
  const { werScore, cerScore, missSpelledWords } = useOCRStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">WER</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{werScore}%</div>
          <p className="text-xs text-gray-500 mt-1">Word Error Rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">CER</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{cerScore}%</div>
          <p className="text-xs text-gray-500 mt-1">Character Error Rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Miss spelled words</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{missSpelledWords}</div>
          <p className="text-xs text-gray-500 mt-1">Total errors found</p>
        </CardContent>
      </Card>
    </div>
  );
}