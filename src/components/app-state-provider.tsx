"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface TextSegment {
  text: string
  isError: boolean
}

interface AppState {
  uploadedImage: string | null
  werScore: number
  cerScore: number
  missSpelledWords: number
  ocrText: TextSegment[]
  correctedText: TextSegment[]
}

interface AppContextType {
  state: AppState
  setUploadedImage: (image: string | null) => void
  setMetrics: (wer: number, cer: number, missSpelled: number) => void
  setTexts: (ocr: TextSegment[], corrected: TextSegment[]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    uploadedImage: null,
    werScore: 50,
    cerScore: 50,
    missSpelledWords: 4,
    ocrText: [
      { text: "The quick brown fox jumps over the ", isError: false },
      { text: "lasy", isError: true },
      { text: " dog. This is a ", isError: false },
      { text: "tset", isError: true },
      { text: " of OCR ", isError: false },
      { text: "detction", isError: true },
      { text: " with some ", isError: false },
      { text: "erors", isError: true },
      { text: " highlighted in red.", isError: false },
    ],
    correctedText: [
      { text: "The quick brown fox jumps over the ", isError: false },
      { text: "lazy", isError: true },
      { text: " dog. This is a ", isError: false },
      { text: "test", isError: true },
      { text: " of OCR ", isError: false },
      { text: "detection", isError: true },
      { text: " with some ", isError: false },
      { text: "errors", isError: true },
      { text: " highlighted in green.", isError: false },
    ],
  })

  const setUploadedImage = (image: string | null) => {
    setState((prev) => ({ ...prev, uploadedImage: image }))
  }

  const setMetrics = (wer: number, cer: number, missSpelled: number) => {
    setState((prev) => ({ ...prev, werScore: wer, cerScore: cer, missSpelledWords: missSpelled }))
  }

  const setTexts = (ocr: TextSegment[], corrected: TextSegment[]) => {
    setState((prev) => ({ ...prev, ocrText: ocr, correctedText: corrected }))
  }

  return <AppContext.Provider value={{ state, setUploadedImage, setMetrics, setTexts }}>{children}</AppContext.Provider>
}

export function useAppState() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}
