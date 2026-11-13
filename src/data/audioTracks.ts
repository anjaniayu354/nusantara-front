export interface AudioTrack {
  id: string;
  title: string;
  subtitle: string;
  artist: string;
  src: string;
  duration?: string;
  isDefault?: boolean;
}

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: "rising-of-nusantara",
    title: "Rising of Nusantara",
    subtitle: "Gamelan Modern & Sinematik Indonesia",
    artist: "Nusantara Cultural Ensemble",
    src: "/lagu/Rising of Nusantara Musik Gamelan Modern Indonesia Cocok Untuk Video Sinematik & Backsound.mp3",
    duration: "4:09",
    isDefault: true,
  },
  {
    id: "dance-of-nusantara",
    title: "Dance of Nusantara",
    subtitle: "Tari Etnik & Orkestra Tradisional",
    artist: "Orkestra Etnik Nusantara",
    src: "/lagu/Dance of Nusantara Musik Tari dan Orkestra Nusantara.mp3",
    duration: "2:46",
    isDefault: false,
  },
];
