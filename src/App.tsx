import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  Upload,
  Scissors,
  Undo,
  Redo,
  Download,
  Volume2,
  Maximize,
} from 'lucide-react';

function App() {
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([100]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoFile(url);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    const time = value[0];
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value[0] / 100;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCut = () => {
    // TODO: Implement cut functionality
    console.log('Cut at:', currentTime);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export video');
  };

  return (
    <div className="h-screen w-full bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <h1 className="text-xl font-bold">Video Editor</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Undo className="mr-2 h-4 w-4" />
            Undo
          </Button>
          <Button variant="outline" size="sm">
            <Redo className="mr-2 h-4 w-4" />
            Redo
          </Button>
          <Button onClick={handleExport} size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-60px)]">
        {/* Left Sidebar - Tools */}
        <aside className="w-16 border-r border-border bg-muted/30 p-2">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="icon" title="Upload">
              <Upload className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" title="Cut">
              <Scissors className="h-5 w-5" />
            </Button>
          </div>
        </aside>

        {/* Center - Video Preview */}
        <main className="flex-1 p-6">
          <Card className="h-full overflow-hidden">
            <div className="flex h-full items-center justify-center bg-black/90">
              {videoFile ? (
                <video
                  ref={videoRef}
                  src={videoFile}
                  className="max-h-full max-w-full"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-16 w-16 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Upload a video to get started
                  </p>
                  <label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button asChild>
                      <span>Choose Video File</span>
                    </Button>
                  </label>
                </div>
              )}
            </div>
          </Card>
        </main>

        {/* Right Sidebar - Properties */}
        <aside className="w-80 border-l border-border bg-muted/30 p-4">
          <h2 className="mb-4 font-semibold">Properties</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">
                Video Information
              </label>
              <div className="rounded-lg border border-border bg-background p-3 text-sm">
                <p>Duration: {formatTime(duration)}</p>
                <p>Current: {formatTime(currentTime)}</p>
                {videoRef.current && (
                  <>
                    <p>
                      Resolution:{' '}
                      {videoRef.current.videoWidth}x{videoRef.current.videoHeight}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom - Timeline */}
      <footer className="border-t border-border bg-muted/30 p-4">
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <Button
            onClick={togglePlayPause}
            disabled={!videoFile}
            variant="outline"
            size="icon"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          {/* Time Display */}
          <span className="text-sm font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Timeline Slider */}
          <div className="flex-1">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              disabled={!videoFile}
            />
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            <Slider
              value={volume}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-24"
            />
          </div>

          {/* Cut Button */}
          <Button onClick={handleCut} disabled={!videoFile} variant="secondary">
            <Scissors className="mr-2 h-4 w-4" />
            Cut
          </Button>
        </div>
      </footer>
    </div>
  );
}

export default App;
