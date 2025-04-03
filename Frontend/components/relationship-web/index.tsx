"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Network, ZoomIn, ZoomOut, RefreshCw, Move, Info } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { nodeData, edgeData } from "./data"
import { useTheme } from "next-themes"

const RelationshipWeb = () => {
  const [selectedNode, setSelectedNode] = useState(null)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [hoveredNode, setHoveredNode] = useState(null)
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const nodesRef = useRef({})
  const [isDragging, setIsDragging] = useState(false)
  const [draggedNode, setDraggedNode] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [tooltipContent, setTooltipContent] = useState(null)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [showHelp, setShowHelp] = useState(false)
  const { theme } = useTheme()

  // Initialize nodes with positions
  useEffect(() => {
    // Position nodes in a circular layout
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2.5

    // Group nodes by category for better positioning
    const groupedNodes = {}
    nodeData.forEach((node) => {
      if (!groupedNodes[node.group]) {
        groupedNodes[node.group] = []
      }
      groupedNodes[node.group].push(node)
    })

    // Position nodes based on groups
    const groups = Object.keys(groupedNodes)
    const nodesWithPositions = nodeData.map((node) => {
      const groupSize = groupedNodes[node.group].length
      const nodeIndexInGroup = groupedNodes[node.group].indexOf(node)

      let radius
      let angleOffset

      switch (node.group) {
        case "Promoters":
          radius = Math.min(window.innerWidth, window.innerHeight) * 0.15
          angleOffset = 0
          break
        case "Executive":
          radius = Math.min(window.innerWidth, window.innerHeight) * 0.25
          angleOffset = 0
          break
        case "Tech":
        case "Operations":
        case "Business":
        case "Finance":
        case "HR":
          radius = Math.min(window.innerWidth, window.innerHeight) * 0.35
          angleOffset = groups.indexOf(node.group) * (Math.PI / 3)
          break
        case "External":
          radius = Math.min(window.innerWidth, window.innerHeight) * 0.42
          angleOffset = nodeIndexInGroup * (Math.PI / 2)
          break
        default:
          radius = Math.min(window.innerWidth, window.innerHeight) * 0.3
          angleOffset = 0
      }

      const angle = (2 * Math.PI * nodeIndexInGroup) / groupSize + angleOffset

      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        radius: node.group === "Promoters" ? 30 : 25,
      }
    })

    setNodes(nodesWithPositions)
    setEdges(edgeData)
  }, [])

  // Get node color based on group and theme
  const getNodeColor = useCallback(
    (group, isHovered, isSelected) => {
      const lightModeColors = {
        Promoters: "#FF7043",
        Executive: "#42A5F5",
        Tech: "#66BB6A",
        Operations: "#FFEE58",
        Business: "#AB47BC",
        Finance: "#FFA726",
        HR: "#EF5350",
        External: "#26C6DA",
      }

      const darkModeColors = {
        Promoters: "#FF7043",
        Executive: "#42A5F5",
        Tech: "#66BB6A",
        Operations: "#FFEE58",
        Business: "#AB47BC",
        Finance: "#FFA726",
        HR: "#EF5350",
        External: "#26C6DA",
      }

      const colors = theme === "dark" ? darkModeColors : lightModeColors
      const color = colors[group] || "#BDBDBD"

      if (isSelected) {
        return color // Full opacity for selected
      } else if (isHovered) {
        return color // Full opacity for hovered
      } else {
        return color + "CC" // Add 80% opacity for normal state
      }
    },
    [theme],
  )

  // Handle mouse down on node
  const handleMouseDown = (e, node) => {
    e.stopPropagation()
    setIsDragging(true)
    setDraggedNode(node.id)
    const rect = e.target.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Handle mouse move
  const handleMouseMove = (e) => {
    if (isDragging && draggedNode) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - containerRect.left - dragOffset.x - translate.x) / scale
      const y = (e.clientY - containerRect.top - dragOffset.y - translate.y) / scale

      setNodes((prevNodes) => prevNodes.map((node) => (node.id === draggedNode ? { ...node, x, y } : node)))
    } else if (isPanning) {
      const dx = e.clientX - panStart.x
      const dy = e.clientY - panStart.y
      setTranslate((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }))
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false)
    setDraggedNode(null)
    setIsPanning(false)
  }

  // Handle node click
  const handleNodeClick = (e, node) => {
    e.stopPropagation()
    setSelectedNode(node.id === selectedNode ? null : node.id)
  }

  // Handle node hover
  const handleNodeHover = (e, node) => {
    setHoveredNode(node.id)

    // Set tooltip content and position
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipPos({
      x: rect.left + window.scrollX + node.radius + 10,
      y: rect.top + window.scrollY,
    })
    setTooltipContent(node)
    setShowTooltip(true)
  }

  // Handle node hover end
  const handleNodeHoverEnd = () => {
    setHoveredNode(null)
    setShowTooltip(false)
  }

  // Clear selection when clicking on container
  const handleContainerClick = () => {
    setSelectedNode(null)
  }

  // Handle zoom in
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2))
  }

  // Handle zoom out
  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5))
  }

  // Handle reset
  const handleReset = () => {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
  }

  // Handle pan start
  const handlePanStart = (e) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle mouse button or left click + Alt key
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }

  // Get connected nodes for a given node
  const getConnectedNodes = (nodeId) => {
    return edges
      .filter((edge) => edge.source === nodeId || edge.target === nodeId)
      .map((edge) => (edge.source === nodeId ? edge.target : edge.source))
  }

  // Check if a node is connected to the selected node
  const isConnectedToSelected = (nodeId) => {
    if (!selectedNode) return false
    return getConnectedNodes(selectedNode).includes(nodeId)
  }

  // Handle wheel event for zooming
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault()
      const delta = e.deltaY * -0.01
      setScale((prevScale) => Math.max(0.5, Math.min(prevScale + delta, 2)))
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
      return () => {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [handleWheel])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Recalculate node positions on window resize
      setNodes((prevNodes) => {
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2.5

        return prevNodes.map((node) => {
          // Keep relative positions but adjust to new center
          const dx = node.x - centerX
          const dy = node.y - centerY
          return {
            ...node,
            x: centerX + dx,
            y: centerY + dy,
          }
        })
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-background to-background/80 transition-colors duration-300"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleContainerClick}
      onMouseDown={handlePanStart}
    >
      <div className="absolute top-4 left-4 flex items-center text-foreground z-10">
        <Network className="w-6 h-6 mr-2" />
        <h1 className="text-xl font-bold">Organizational Relationship Web</h1>
      </div>

      {/* Zoom and pan controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleZoomIn}
                variant="outline"
                size="icon"
                className="bg-background/60 backdrop-blur-sm border-border/40"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom In</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleZoomOut}
                variant="outline"
                size="icon"
                className="bg-background/60 backdrop-blur-sm border-border/40"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Zoom Out</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleReset}
                variant="outline"
                size="icon"
                className="bg-background/60 backdrop-blur-sm border-border/40"
                aria-label="Reset view"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset View</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-background/60 backdrop-blur-sm border-border/40 cursor-move"
                aria-label="Pan"
              >
                <Move className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pan (Alt+Drag)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setShowHelp(!showHelp)}
                variant="outline"
                size="icon"
                className="bg-background/60 backdrop-blur-sm border-border/40"
                aria-label="Help"
              >
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Help</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <ThemeToggle />
      </div>

      {/* Help panel */}
      {showHelp && (
        <Card className="absolute top-16 right-4 w-72 bg-card/95 backdrop-blur-sm shadow-lg border-border/40 z-20 animate-in fade-in-0 zoom-in-95 slide-in-from-top-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Click node</span>
              <span>View details</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Drag node</span>
              <span>Reposition</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Ctrl+Scroll</span>
              <span>Zoom in/out</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Alt+Drag</span>
              <span>Pan view</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Middle click</span>
              <span>Pan view</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information panel for selected node */}
      {selectedNode && (
        <Card className="absolute top-16 right-4 w-72 bg-card/95 backdrop-blur-sm shadow-lg border-border/40 z-10 animate-in fade-in-0 zoom-in-95 slide-in-from-top-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{nodes.find((n) => n.id === selectedNode)?.label}</CardTitle>
            <CardDescription>{nodes.find((n) => n.id === selectedNode)?.role}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">{nodes.find((n) => n.id === selectedNode)?.description}</p>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">Connected to:</h4>
              <div className="flex flex-wrap gap-1.5">
                {getConnectedNodes(selectedNode).map((nodeId) => {
                  const node = nodes.find((n) => n.id === nodeId)
                  return (
                    <Badge
                      key={nodeId}
                      variant="outline"
                      className="text-xs"
                      style={{
                        backgroundColor: getNodeColor(node?.group, false, false) + "40",
                        borderColor: getNodeColor(node?.group, false, false),
                      }}
                    >
                      {node?.label}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tooltip for hover */}
      {showTooltip && tooltipContent && !selectedNode && (
        <div
          className="fixed bg-popover/90 backdrop-blur-sm text-popover-foreground p-2 rounded text-sm z-50 pointer-events-none border border-border/40 shadow-md"
          style={{
            left: tooltipPos.x + "px",
            top: tooltipPos.y + "px",
            maxWidth: "200px",
          }}
        >
          <div className="font-bold">{tooltipContent.label}</div>
          <div className="text-xs opacity-90">{tooltipContent.role}</div>
        </div>
      )}

      {/* Legend */}
      <Card className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm border-border/40 shadow-md z-10">
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-xs">Department Legend</CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-3 pb-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.keys(
              nodes.reduce((acc, node) => {
                acc[node.group] = true
                return acc
              }, {}),
            ).map((group) => (
              <div key={group} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: getNodeColor(group, false, false) }}
                ></div>
                <span className="text-xs">{group}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{
          transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
          transformOrigin: "center",
          transition: "transform 0.2s ease",
        }}
      >
        <defs>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-muted-foreground" />
          </marker>
        </defs>

        {/* Draw edges */}
        {edges.map((edge, index) => {
          const sourceNode = nodes.find((n) => n.id === edge.source)
          const targetNode = nodes.find((n) => n.id === edge.target)
          if (!sourceNode || !targetNode) return null

          const isConnectedToSelectedNode =
            selectedNode && (edge.source === selectedNode || edge.target === selectedNode)

          return (
            <line
              key={`edge-${index}`}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              className={`${isConnectedToSelectedNode ? "stroke-foreground" : "stroke-muted-foreground/30"}`}
              strokeWidth={isConnectedToSelectedNode ? 2 : 1}
              strokeOpacity={selectedNode && !isConnectedToSelectedNode ? 0.3 : 1}
              strokeDasharray={isConnectedToSelectedNode ? "none" : "none"}
              markerEnd="url(#arrowhead)"
            />
          )
        })}

        {/* Draw nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNode === node.id
          const isHovered = hoveredNode === node.id
          const isConnected = isConnectedToSelected(node.id)
          const opacity = selectedNode ? (isSelected || isConnected ? 1 : 0.4) : 1

          return (
            <g
              key={`node-${node.id}`}
              ref={(el) => (nodesRef.current[node.id] = el)}
              onMouseDown={(e) => handleMouseDown(e, node)}
              onClick={(e) => handleNodeClick(e, node)}
              onMouseEnter={(e) => handleNodeHover(e, node)}
              onMouseLeave={handleNodeHoverEnd}
              style={{
                cursor: isDragging && draggedNode === node.id ? "grabbing" : "pointer",
                transition: "opacity 0.3s ease",
                opacity,
              }}
            >
              {/* Node glow effect for selected/hovered */}
              {(isSelected || isHovered) && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius + 5}
                  fill={getNodeColor(node.group, isHovered, isSelected)}
                  opacity={0.4}
                  filter="url(#glow)"
                />
              )}

              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius}
                fill={getNodeColor(node.group, isHovered, isSelected)}
                stroke={isSelected ? "var(--foreground)" : isHovered ? "var(--foreground)" : "var(--muted-foreground)"}
                strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                className={isDragging && draggedNode === node.id ? "animate-pulse" : ""}
              />

              {/* Node text background for better readability */}
              <circle cx={node.x} cy={node.y} r={node.radius * 0.7} fill="rgba(0, 0, 0, 0.3)" />

              {/* Node text */}
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fontWeight={isSelected || isHovered ? "bold" : "normal"}
                fill="var(--background)"
                pointerEvents="none"
              >
                {node.shortLabel}
              </text>

              {/* Drag indicator */}
              {(isHovered || isSelected) && (
                <circle cx={node.x} cy={node.y - node.radius - 8} r={3} fill="var(--foreground)" opacity={0.7} />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default RelationshipWeb

