import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const VideoPlayer = ({ zipFile }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [audioTracks, setAudioTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [subtitles, setSubtitles] = useState({});
  const [currentSubtitleUrl, setCurrentSubtitleUrl] = useState(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const playerRef = useRef(null);
  useEffect(() => {
    const extractZip = async () => {
      if (!zipFile) return;
      try {
        const response = await fetch(zipFile);
        if (!response.ok) throw new Error("Failed to fetch ZIP file");
        const zipBuffer = await response.arrayBuffer();
        const zipData = await JSZip.loadAsync(zipBuffer); // ✅ Extract Video
        const mp4File = Object.keys(zipData.files).find((file) =>
          file.endsWith(".mp4")
        );
        if (!mp4File) throw new Error("MP4 video file not found in ZIP");
        const videoBlob = new Blob(
          [await zipData.files[mp4File].async("arraybuffer")],
          { type: "video/mp4" }
        );
        setVideoUrl(URL.createObjectURL(videoBlob)); // ✅ Extract Audio Files
        const audioFiles = Object.keys(zipData.files).filter(
          (file) =>
            file.startsWith("audio/") && file.match(/\.(mp3|aac|m4a|ogg)$/)
        );
        const tracks = await Promise.all(
          audioFiles.map(async (file, index) => ({
            label: `${file.split("/").pop()}`,
            src: URL.createObjectURL(
              new Blob([await zipData.files[file].async("arraybuffer")], {
                type: "audio/mp4",
              })
            ),
            lang: file.split("/")[1].split(".")[0] || `track${index + 1}`, // Use the language code from filename if available
          }))
        );
        setAudioTracks(tracks);
        setSelectedTrack(tracks[0]?.src || null); // ✅ Extract Subtitles
        const subtitleFiles = Object.keys(zipData.files).filter(
          (file) => file.startsWith("subtitles/") && file.endsWith(".srt")
        );
        const subtitleMap = {};
        await Promise.all(
          subtitleFiles.map(async (file) => {
            const langCode = file.split("/")[1].split(".")[0]; // subtitles/hi.srt → hi
            if (langCode) {
              const srtText = await zipData.files[file].async("string"); // Convert SRT to VTT
              const vttText =
                "WEBVTT\n\n" +
                srtText
                  .replace(/\r+/g, "")
                  .replace(
                    /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/g,
                    "$1\n$2 --> $3"
                  )
                  .replace(/,/g, ".");
              const blob = new Blob([vttText], { type: "text/vtt" });
              subtitleMap[langCode] = URL.createObjectURL(blob);
            }
          })
        );
        setSubtitles(subtitleMap);
      } catch (error) {
        console.error("ZIP Extraction Error:", error);
      }
    };
    extractZip();
  }, [zipFile]);
  useEffect(() => {
    if (selectedTrack && audioRef.current && videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      audioRef.current.src = selectedTrack;
      audioRef.current.currentTime = currentTime;
    //   audioRef.current.play().catch(() => {}); // Match subtitle to selected language
      const selected = audioTracks.find((t) => t.src === selectedTrack);
      const lang = selected?.lang;
      const subtitleUrl = subtitles[lang];
      setCurrentSubtitleUrl(subtitleUrl || null);
    }
  }, [selectedTrack, subtitles]);
  
  useEffect(() => {
    if (videoUrl && videoRef.current) {
      if (playerRef.current) {
        playerRef.current.dispose(); // Prevent duplicate player instances
      }
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        muted: false,
      });
      player.src({ src: videoUrl, type: "video/mp4" });
      playerRef.current = player;
      player.on("play", () => audioRef.current?.play().catch(() => {}));
      player.on("pause", () => audioRef.current?.pause());
      player.on("seeking", () => {
        if (audioRef.current) {
          audioRef.current.currentTime = player.currentTime();
        }
      });
      player.on("volumechange", () => {
        if (audioRef.current) {
          audioRef.current.muted = player.muted();
        }
      });
      return () => player.dispose();
    }
  }, [videoUrl]);
  return (
    <div className="w-full max-w-48 mx-auto p-2 bg-white shadow-md rounded-lg border border-gray-300">
      {videoUrl ? (
        <>
          <div className="mb-2 rounded overflow-hidden border border-gray-300">
            <video
              ref={videoRef}
              className="video-js vjs-big-play-centered w-full h-28"
              controls
            >
              {currentSubtitleUrl && (
                <track
                  label="Subtitles"
                  kind="subtitles"
                  srcLang="en"
                  src={currentSubtitleUrl}
                  default
                />
              )}
            </video>
          </div>

          {audioTracks.length > 0 && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                Select Audio Track
              </label>
              <select
                onChange={(e) => setSelectedTrack(e.target.value)}
                value={selectedTrack}
                className="w-full p-1 border border-gray-300 rounded"
              >
                {audioTracks.map((track, index) => (
                  <option key={index} value={track.src}>
                    {track.label === "en.mp3"
                      ? "English"
                      : track.label === "hi.mp3"
                      ? "Hindi"
                      : track.label === "ta.mp3"
                      ? "Tamil"
                      : track.label === "te.mp3"
                      ? "Telugu"
                      : track.label === "kn.mp3"
                      ? "Kannada"
                      : track.label === "ml.mp3"
                      ? "Malayalam"
                      : track.label === "bn.mp3"
                      ? "Bengali"
                      : track.label}
                  </option>
                ))}
              </select>
              <audio ref={audioRef} hidden />
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500">
          ⏳ Loading and extracting ZIP...
        </div>
      )}
    </div>
  );
};
export default VideoPlayer;
