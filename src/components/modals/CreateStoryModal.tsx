import React, { useState, useRef, ChangeEvent } from 'react';
import { X, Upload, Image, Music, Type, Filter, Move } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from "@/lib/utils";

interface StoryText {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState("upload");
  const [texts, setTexts] = useState<StoryText[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [filter, setFilter] = useState("none");
  const [bgColor, setBgColor] = useState(isDarkMode ? "#1f2937" : "#ffffff");
  const [selectedMusic, setSelectedMusic] = useState<File | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleMusicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedMusic(file);
    }
  };

  const addNewText = () => {
    const newText: StoryText = {
      id: Date.now().toString(),
      text: "Double click to edit",
      x: 50,
      y: 50,
      fontSize: 20,
      color: "#000000"
    };
    setTexts([...texts, newText]);
    setSelectedTextId(newText.id);
  };

  const updateTextPosition = (id: string, x: number, y: number) => {
    setTexts(texts.map(text => 
      text.id === id ? { ...text, x, y } : text
    ));
  };

  const handleTextChange = (id: string, newText: string) => {
    setTexts(texts.map(text =>
      text.id === id ? { ...text, text: newText } : text
    ));
  };

  const filters = {
    none: "",
    grayscale: "grayscale(100%)",
    sepia: "sepia(100%)",
    blur: "blur(2px)",
    brightness: "brightness(150%)",
    contrast: "contrast(150%)"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-4xl h-[80vh] flex flex-col",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
      )}>
        <DialogHeader>
          <DialogTitle className={isDarkMode ? "text-white" : "text-black"}>
            Create Story
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 gap-4">
          {/* Preview Area */}
          <div className={cn(
            "flex-1 relative border rounded-lg overflow-hidden",
            isDarkMode ? "border-gray-700" : "border-gray-200"
          )}>
            <div
              ref={canvasRef}
              className="w-full h-full relative"
              style={{
                backgroundColor: !previewUrl ? bgColor : undefined,
                filter: filters[filter as keyof typeof filters]
              }}
            >
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              )}
              
              {texts.map((text) => (
                <div
                  key={text.id}
                  className="absolute cursor-move"
                  style={{
                    left: `${text.x}px`,
                    top: `${text.y}px`,
                    fontSize: `${text.fontSize}px`,
                    color: text.color,
                  }}
                  onClick={() => setSelectedTextId(text.id)}
                >
                  {text.text}
                </div>
              ))}
            </div>
          </div>

          {/* Tools Panel */}
          <div className={cn(
            "w-72",
            isDarkMode ? "text-gray-200" : "text-gray-900"
          )}>
            <Tabs defaultValue="upload" onValueChange={setActiveTab}>
              <TabsList className={cn(
                "grid w-full grid-cols-5",
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              )}>
                <TabsTrigger value="upload" className={isDarkMode ? "data-[state=active]:bg-gray-600" : ""}>
                  <Upload className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="background" className={isDarkMode ? "data-[state=active]:bg-gray-600" : ""}>
                  <Image className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="text" className={isDarkMode ? "data-[state=active]:bg-gray-600" : ""}>
                  <Type className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="filter" className={isDarkMode ? "data-[state=active]:bg-gray-600" : ""}>
                  <Filter className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="music" className={isDarkMode ? "data-[state=active]:bg-gray-600" : ""}>
                  <Music className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "w-full",
                    isDarkMode ? "bg-gray-700 hover:bg-gray-600" : ""
                  )}
                >
                  Upload Media
                </Button>
              </TabsContent>

              <TabsContent value="background" className="space-y-4">
                <Input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className={cn(
                    "w-full h-10",
                    isDarkMode ? "bg-gray-700" : ""
                  )}
                />
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <Button 
                  onClick={addNewText} 
                  className={cn(
                    "w-full",
                    isDarkMode ? "bg-gray-700 hover:bg-gray-600" : ""
                  )}
                >
                  Add Text
                </Button>
                {selectedTextId && (
                  <div className="space-y-4">
                    <Input
                      value={texts.find(t => t.id === selectedTextId)?.text || ""}
                      onChange={(e) => handleTextChange(selectedTextId, e.target.value)}
                      placeholder="Enter text"
                      className={isDarkMode ? "bg-gray-700 text-white" : ""}
                    />
                    <Input
                      type="color"
                      value={texts.find(t => t.id === selectedTextId)?.color || "#000000"}
                      onChange={(e) => {
                        setTexts(texts.map(text =>
                          text.id === selectedTextId ? { ...text, color: e.target.value } : text
                        ));
                      }}
                      className={isDarkMode ? "bg-gray-700" : ""}
                    />
                    <div>
                      <label className={cn(
                        "text-sm",
                        isDarkMode ? "text-gray-300" : ""
                      )}>Font Size</label>
                      <Slider
                        value={[texts.find(t => t.id === selectedTextId)?.fontSize || 20]}
                        min={10}
                        max={100}
                        step={1}
                        onValueChange={([value]) => {
                          setTexts(texts.map(text =>
                            text.id === selectedTextId ? { ...text, fontSize: value } : text
                          ));
                        }}
                        className={isDarkMode ? "[&_[role=slider]]:bg-gray-200" : ""}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="filter" className="space-y-4">
                {Object.keys(filters).map((filterName) => (
                  <Button
                    key={filterName}
                    onClick={() => setFilter(filterName)}
                    variant={filter === filterName ? "default" : "outline"}
                    className={cn(
                      "w-full capitalize",
                      isDarkMode ? "bg-gray-700 hover:bg-gray-600 border-gray-600" : ""
                    )}
                  >
                    {filterName}
                  </Button>
                ))}
              </TabsContent>

              <TabsContent value="music" className="space-y-4">
                <Input
                  ref={musicInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleMusicChange}
                  className="hidden"
                />
                <Button
                  onClick={() => musicInputRef.current?.click()}
                  className={cn(
                    "w-full",
                    isDarkMode ? "bg-gray-700 hover:bg-gray-600" : ""
                  )}
                >
                  Upload Background Music
                </Button>
                {selectedMusic && (
                  <p className={cn(
                    "text-sm truncate",
                    isDarkMode ? "text-gray-300" : ""
                  )}>
                    Selected: {selectedMusic.name}
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className={isDarkMode ? "border-gray-600 text-white hover:bg-gray-700" : ""}
          >
            Cancel
          </Button>
          <Button
            className={isDarkMode ? "bg-[#1D9BF0] hover:bg-[#1aa3d4]" : ""}
          >
            Create Story
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoryModal;