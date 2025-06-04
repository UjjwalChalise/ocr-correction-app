import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Upload, Download, Trash2, Eye, EyeOff } from 'lucide-react'
import { useAppState } from "../lib/app-context"

interface Highlight {
  id: string
  x: number
  y: number
  width: number
  height: number
  color: string
  label: string
  visible: boolean
}

export function TiffViewer() {
  const { state, setUploadedImage } = useAppState()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tiffData, setTiffData] = useState<ImageData | null>(null)
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentColor, setCurrentColor] = useState("#ff0000")
  const [currentLabel, setCurrentLabel] = useState("")
  const [scale, setScale] = useState(1)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ffa500", "#800080"]

  const loadTiffFile = useCallback(async (file: File) => {
    try {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        setTiffData(imageData)
        setCanvasSize({ width: img.width, height: img.height })
        
        // Also update the app state
        setUploadedImage(URL.createObjectURL(file))
      }

      const url = URL.createObjectURL(file)
      img.src = url
    } catch (error) {
      console.error("Error loading TIFF file:", error)
    }
  }, [setUploadedImage])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      loadTiffFile(file)
    }
  }

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !tiffData) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const tempCanvas = document.createElement("canvas")
    const tempCtx = tempCanvas.getContext("2d")
    if (!tempCtx) return

    tempCanvas.width = tiffData.width
    tempCanvas.height = tiffData.height
    tempCtx.putImageData(tiffData, 0, 0)

    ctx.save()
    ctx.scale(scale, scale)
    ctx.drawImage(tempCanvas, 0, 0)
    ctx.restore()

    highlights.forEach((highlight) => {
      if (!highlight.visible) return

      ctx.fillStyle = highlight.color + "40"
      ctx.strokeStyle = highlight.color
      ctx.lineWidth = 2

      const x = highlight.x * scale
      const y = highlight.y * scale
      const width = highlight.width * scale
      const height = highlight.height * scale

      ctx.fillRect(x, y, width, height)
      ctx.strokeRect(x, y, width, height)

      if (highlight.label) {
        ctx.fillStyle = highlight.color
        ctx.font = "12px Arial"
        ctx.fillText(highlight.label, x, y - 5)
      }
    })
  }, [tiffData, highlights, scale])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!tiffData) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / scale
    const y = (event.clientY - rect.top) / scale

    setIsDrawing(true)
    setStartPos({ x, y })
  }

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !tiffData) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const endX = (event.clientX - rect.left) / scale
    const endY = (event.clientY - rect.top) / scale

    const width = Math.abs(endX - startPos.x)
    const height = Math.abs(endY - startPos.y)

    if (width > 5 && height > 5) {
      const newHighlight: Highlight = {
        id: Date.now().toString(),
        x: Math.min(startPos.x, endX),
        y: Math.min(startPos.y, endY),
        width,
        height,
        color: currentColor,
        label: currentLabel || `Highlight ${highlights.length + 1}`,
        visible: true,
      }

      setHighlights((prev) => [...prev, newHighlight])
    }

    setIsDrawing(false)
  }

  const toggleHighlight = (id: string) => {
    setHighlights((prev) => prev.map((h) => (h.id === id ? { ...h, visible: !h.visible } : h)))
  }

  const deleteHighlight = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id))
  }

  const exportHighlights = () => {
    const data = JSON.stringify(highlights, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "highlights.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="tiff-viewer">
      {/* Top Section - TIFF Viewer */}
      <div className="viewer-main">
        <div className="viewer-content">
          {/* Canvas Area */}
          <div className="canvas-container">
            {!tiffData ? (
              <div className="upload-prompt">
                <div className="upload-content">
                  <Upload size={48} className="upload-icon" />
                  <p className="upload-title">Upload a TIFF file to get started</p>
                  <Button onClick={() => fileInputRef.current?.click()}>Choose File</Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".tiff,.tif,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <ScrollArea className="canvas-scroll">
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width * scale}
                  height={canvasSize.height * scale}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  className="canvas"
                />
              </ScrollArea>
            )}
          </div>

          {/* Controls */}
          <div className="controls-panel">
            <Card>
              <CardHeader>
                <CardTitle className="control-title">File Controls</CardTitle>
              </CardHeader>
              <CardContent className="control-content">
                <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                  <Upload size={16} className="btn-icon" />
                  Upload TIFF
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".tiff,.tif,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="zoom-controls">
                  <label className="control-label">Zoom</label>
                  <div className="zoom-buttons">
                    <Button size="sm" variant="outline" onClick={() => setScale((prev) => Math.max(0.1, prev - 0.1))}>
                      -
                    </Button>
                    <span className="zoom-display">{Math.round(scale * 100)}%</span>
                    <Button size="sm" variant="outline" onClick={() => setScale((prev) => Math.min(3, prev + 0.1))}>
                      +
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="control-title">Highlighting</CardTitle>
              </CardHeader>
              <CardContent className="control-content">
                <div className="label-input">
                  <label className="control-label">Label</label>
                  <input
                    className="text-input"
                    value={currentLabel}
                    onChange={(e) => setCurrentLabel(e.target.value)}
                    placeholder="Highlight label"
                  />
                </div>

                <div className="color-picker">
                  <label className="control-label">Color</label>
                  <div className="color-grid">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setCurrentColor(color)}
                        className={`color-button ${currentColor === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Section - Highlights List */}
      <div className="highlights-section">
        <div className="highlights-content">
          <div className="highlights-list">
            <div className="highlights-header">
              <h3 className="highlights-title">Highlights ({highlights.length})</h3>
              <div className="highlights-actions">
                <Button size="sm" variant="outline" onClick={exportHighlights}>
                  <Download size={16} className="btn-icon" />
                  Export
                </Button>
              </div>
            </div>

            <ScrollArea className="highlights-scroll">
              <div className="highlights-items">
                {highlights.map((highlight) => (
                  <div key={highlight.id} className="highlight-item">
                    <div className="highlight-color" style={{ backgroundColor: highlight.color }} />
                    <div className="highlight-info">
                      <div className="highlight-label">{highlight.label}</div>
                      <div className="highlight-coords">
                        {Math.round(highlight.x)}, {Math.round(highlight.y)} - {Math.round(highlight.width)}×{Math.round(highlight.height)}
                      </div>
                    </div>
                    <div className="highlight-actions">
                      <Button size="sm" variant="ghost" onClick={() => toggleHighlight(highlight.id)}>
                        {highlight.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteHighlight(highlight.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}

                {highlights.length === 0 && (
                  <div className="no-highlights">
                    No highlights yet. Click and drag on the image to create highlights.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}