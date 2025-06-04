import { create } from "zustand";

interface OCRData {
  uploadedImage: string | null;
  werScore: number;
  cerScore: number;
  missSpelledWords: number;
  ocrText: string;
  correctedText: string;
  highlightedWords: string[];
}

interface OCRStore extends OCRData {
  setUploadedImage: (image: string) => void;
  setMetrics: (wer: number, cer: number, missSpelled: number) => void;
  setTexts: (ocr: string, corrected: string, highlighted: string[]) => void;
  reset: () => void;
}

const initialState: OCRData = {
  uploadedImage: null,
  werScore: 12,
  cerScore: 8,
  missSpelledWords: 5,
  ocrText:
    "The quick brown fox jumps over the lazy dog. This is a sample text with some errors that need correction. Machine learning and artificial intelligence are revolutionizing the way we process documents.",
  correctedText:
    "The quick brown fox jumps over the lazy dog. This is a sample text with some errors that need correction. Machine learning and artificial intelligence are revolutionizing the way we process documents.",
  highlightedWords: ["quick", "sample", "errors", "Machine", "artificial"],
};

export const useOCRStore = create<OCRStore>((set) => ({
  ...initialState,
  setUploadedImage: (image) => set({ uploadedImage: image }),
  setMetrics: (wer, cer, missSpelled) =>
    set({
      werScore: wer,
      cerScore: cer,
      missSpelledWords: missSpelled,
    }),
  setTexts: (ocr, corrected, highlighted) =>
    set({
      ocrText: ocr,
      correctedText: corrected,
      highlightedWords: highlighted,
    }),
  reset: () => set(initialState),
}));