interface SpellCorrectResponse {
  corrected_text: string
  corrections: Array<{
    original: string
    corrected: string
    position: number
  }>
}

interface WERResponse {
  wer: number
  errors: number
  total_words: number
}

interface CERResponse {
  cer: number
  errors: number
  total_characters: number
}

interface TextSegment {
  text: string
  isError: boolean
}

class APIService {
  private baseURL = 'http://localhost:8000'

  async spellCorrect(text: string): Promise<SpellCorrectResponse> {
    const formData = new FormData()
    formData.append('text', text)

    const response = await fetch(`${this.baseURL}/spell-correct/`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Spell correction failed: ${response.statusText}`)
    }

    return response.json()
  }

  async calculateWER(reference: string, original: string, hypothesis: string): Promise<WERResponse> {
    const formData = new FormData()
    formData.append('reference', reference)
    formData.append('original', original)
    formData.append('hypothesis', hypothesis)

    const response = await fetch(`${this.baseURL}/wer/`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`WER calculation failed: ${response.statusText}`)
    }

    return response.json()
  }

  async calculateCER(reference: string, original: string, hypothesis: string): Promise<CERResponse> {
    const formData = new FormData()
    formData.append('reference', reference)
    formData.append('original', original)
    formData.append('hypothesis', hypothesis)

    const response = await fetch(`${this.baseURL}/cer/`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`CER calculation failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Helper function to convert corrections to TextSegments
  convertToTextSegments(originalText: string, corrections: Array<{original: string, corrected: string, position: number}>): {
    ocrSegments: TextSegment[]
    correctedSegments: TextSegment[]
  } {
    const ocrSegments: TextSegment[] = []
    const correctedSegments: TextSegment[] = []
    
    let currentPos = 0
    const sortedCorrections = corrections.sort((a, b) => a.position - b.position)

    for (const correction of sortedCorrections) {
      // Add text before the error
      if (correction.position > currentPos) {
        const beforeText = originalText.slice(currentPos, correction.position)
        ocrSegments.push({ text: beforeText, isError: false })
        correctedSegments.push({ text: beforeText, isError: false })
      }

      // Add the error/correction
      ocrSegments.push({ text: correction.original, isError: true })
      correctedSegments.push({ text: correction.corrected, isError: true })

      currentPos = correction.position + correction.original.length
    }

    // Add remaining text
    if (currentPos < originalText.length) {
      const remainingText = originalText.slice(currentPos)
      ocrSegments.push({ text: remainingText, isError: false })
      correctedSegments.push({ text: remainingText, isError: false })
    }

    return { ocrSegments, correctedSegments }
  }

  // Process OCR text and get all metrics
  async processOCRText(ocrText: string, referenceText?: string): Promise<{
    correctedText: string
    ocrSegments: TextSegment[]
    correctedSegments: TextSegment[]
    werScore: number
    cerScore: number
    missSpelledWords: number
  }> {
    try {
      // Get spell corrections
      const spellResult = await this.spellCorrect(ocrText)
      
      // Convert to segments
      const { ocrSegments, correctedSegments } = this.convertToTextSegments(
        ocrText, 
        spellResult.corrections
      )

      let werScore = 0
      let cerScore = 0

      // Calculate WER and CER if reference text is provided
      if (referenceText) {
        const [werResult, cerResult] = await Promise.all([
          this.calculateWER(referenceText, ocrText, spellResult.corrected_text),
          this.calculateCER(referenceText, ocrText, spellResult.corrected_text)
        ])
        
        werScore = Math.round(werResult.wer * 100)
        cerScore = Math.round(cerResult.cer * 100)
      }

      return {
        correctedText: spellResult.corrected_text,
        ocrSegments,
        correctedSegments,
        werScore,
        cerScore,
        missSpelledWords: spellResult.corrections.length
      }
    } catch (error) {
      console.error('API processing error:', error)
      throw error
    }
  }
}

export const apiService = new APIService()
export type { SpellCorrectResponse, WERResponse, CERResponse, TextSegment }