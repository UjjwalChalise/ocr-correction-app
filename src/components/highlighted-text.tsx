interface TextSegment {
  text: string
  isError: boolean
}

interface HighlightedTextProps {
  text: string
  highlightedWords: String[]
  highlightColor: "red" | "green"
}

export function HighlightedText({text, highlightedWords, highlightColor }: HighlightedTextProps) {
  return (
    <div className="highlighted-text">
      {highlightedWords?.map((highlightedWords, index) => (
        <span
          key={index}
          className={highlightedWords ? `highlight-${highlightColor}` : ''}
        >
          {text}
        </span>
      ))}
    </div>
  )
}