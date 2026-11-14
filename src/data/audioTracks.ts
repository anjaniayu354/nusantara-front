export interface AudioTrack {
  id: string;
  title: string;
  subtitle: string;
  artist: string;
  region?: string;
  src: string;
  duration?: string;
  isDefault?: boolean;
}

export const AUDIO_TRACKS: AudioTrack[] = [
  // --- Kategori: Nusantara & Kebangsaan ---
  {
    id: "rising-of-nusantara",
    title: "Rising of Nusantara",
    subtitle: "Musik Gamelan Modern Indonesia Sinematik",
    artist: "Nusantara Cultural Ensemble",
    region: "Nusantara",
    src: "/lagu/Rising of Nusantara Musik Gamelan Modern Indonesia Cocok Untuk Video Sinematik & Backsound.mp3",
    duration: "6:55",
    isDefault: true,
  },
  {
    id: "dance-of-nusantara",
    title: "Dance of Nusantara",
    subtitle: "Musik Tari dan Orkestra Tradisional Nusantara",
    artist: "Orkestra Etnik Nusantara",
    region: "Nusantara",
    src: "/lagu/Dance of Nusantara Musik Tari dan Orkestra Nusantara.mp3",
    duration: "4:06",
  },
  {
    id: "heart-of-nusantara",
    title: "Heart of Nusantara",
    subtitle: "Majestic Cinematic Orchestral Music",
    artist: "Orkestra Mahakarya Nusantara",
    region: "Nusantara",
    src: "/lagu/Heart of Nusantara Majestic Cinematic Orchestral Background Music.mp3",
    duration: "3:51",
  },
  {
    id: "dewantara-sacred-forest",
    title: "DEWANTARA 🌿",
    subtitle: "The Sacred Forest Cinematic Soundscape",
    artist: "Donkgedank",
    region: "Nusantara",
    src: "/lagu/Donkgedank - DEWANTARA 🌿 The Sacred Forest.mp3",
    duration: "4:38",
  },
  {
    id: "purwaswara-first-sound",
    title: "PURWASWARA 🌿",
    subtitle: "The Journey to The First Sound Cinematic",
    artist: "Donkgedank",
    region: "Nusantara",
    src: "/lagu/Donkgedank - PURWASWARA 🌿 The Journey to The First Sound Cinematic, Sad, Epic.mp3",
    duration: "4:51",
  },

  // --- Kategori: Pulau Jawa & Banyuwangi ---
  {
    id: "gending-jawa-symphony",
    title: "Symphony of Gamelan (Gending)",
    subtitle: "Majestic Javanese Orchestral Gending",
    artist: "Gamelan Kyai Gending & Javanese Orchestra",
    region: "Jawa",
    src: "/lagu/Symphony of Gamelan Majestic Javanese Orchestral Music.mp3",
    duration: "2:05",
  },
  {
    id: "tanah-leluhur",
    title: "Tanah Leluhur",
    subtitle: "Musik Gamelan Modern Paling Epic",
    artist: "Harmoni Budaya Nusantara",
    region: "Jawa",
    src: "/lagu/Nusantara - Tanah Leluhur - Musik Gamelan Modern Paling Epic.mp3",
    duration: "5:06",
  },
  {
    id: "kidung-mantra-osing",
    title: "Kidung Mantra Suku Osing",
    subtitle: "Mistik Kidung Mantra Asli Osing Banyuwangi",
    artist: "Suku Osing Banyuwangi",
    region: "Banyuwangi",
    src: "/lagu/MISTIK MERINDING - KIDUNG MANTRA ASLI SUKU OSING - OSING PEOPLE SONG - BANYUWANGI.mp3",
    duration: "5:20",
  },
  {
    id: "kacapi-suling-pajajaran",
    title: "Kacapi Suling Klasik",
    subtitle: "Degung Tradisional Pajajaran",
    artist: "Degung Klasik Pasundan",
    region: "Jawa Barat",
    src: "/lagu/Kacapi Suling Klasik Degung Pajajaran.mp3",
    duration: "5:16",
  },
  {
    id: "kendang-pencak-silat",
    title: "Kendang Pencak Energik",
    subtitle: "Ritme Dinamis Musik Pencak Silat",
    artist: "Nayaga Kendang Sunda",
    region: "Jawa Barat",
    src: "/lagu/Kendang Pencak Energik, cocok untuk Usik...!!.mp3",
    duration: "6:19",
  },
  {
    id: "spirit-of-java-siliwangi",
    title: "👑 Spirit of Java",
    subtitle: "Prabu Siliwangi — Sacred Flute of Pajajaran",
    artist: "Suling Bambu & Degung Sunda",
    region: "Jawa Barat",
    src: "/lagu/👑 Spirit of Java Prabu Siliwangi — Sacred Flute of Pajajaran.mp3",
    duration: "3:29",
  },

  // --- Kategori: Pulau Sumatera (Aceh, Riau, Padang / Minang, Lampung & Sumsel) ---
  {
    id: "bungong-jeumpa-aceh",
    title: "Bungong Jeumpa",
    subtitle: "Orchestral Cover – NusaVestra Symphony",
    artist: "NusaVestra Symphony",
    region: "Aceh",
    src: "/lagu/Bungong Jeumpa (Orchestral Cover) – Nusantara Symphony Series NusaVestra.mp3",
    duration: "5:16",
  },
  {
    id: "selayang-pandang-riau",
    title: "Selayang Pandang",
    subtitle: "Orchestral Cover Melayu Riau – NusaVestra Symphony",
    artist: "NusaVestra Symphony",
    region: "Riau",
    src: "/lagu/Selayang Pandang (Orchestral Cover) – Nusantara Symphony Series NusaVestra.mp3",
    duration: "5:12",
  },
  {
    id: "spirit-of-sumatra-flower",
    title: "🌺 Spirit of Sumatra",
    subtitle: "Mystical Saluang Flute Journey (Minangkabau)",
    artist: "Saluang & Talempong Minang",
    region: "Padang & Minang",
    src: "/lagu/🌺 Spirit of Sumatra When the Corpse Flower Blooms — Mystical Saluang Flute Journey.mp3",
    duration: "3:28",
  },
  {
    id: "vibes-of-sriwijaya",
    title: "Vibes Of Sriwijaya",
    subtitle: "Epic Cinematic Backsound Nusantara",
    artist: "Donkgedank",
    region: "Lampung & Sumsel",
    src: "/lagu/Donkgedank - Vibes Of Sriwijaya (Epic Cinematic Backsound Nusantara).mp3",
    duration: "7:17",
  },

  // --- Kategori: Bali & Kepulauan Nusa Tenggara ---
  {
    id: "spirit-of-bali-barong",
    title: "🌙 Spirit of Bali",
    subtitle: "Barong Awakens Sacred Temple Music",
    artist: "Gamelan Gong Kebyar Bali",
    region: "Bali",
    src: "/lagu/🌙 Spirit of Bali Barong Awakens Sacred Temple Music of Bali.mp3",
    duration: "2:27",
  },
  {
    id: "spirit-of-bali-kecak",
    title: "🔥 Spirit of Bali",
    subtitle: "Sacred Trance Ocean Temple & Kecak",
    artist: "Kecak Pura Uluwatu",
    region: "Bali",
    src: "/lagu/🔥 Spirit of Bali Sacred Trance of the Ocean Temple Balinese Gamelan & Kecak.mp3",
    duration: "4:01",
  },

  // --- Kategori: Sulawesi ---
  {
    id: "spirit-of-sulawesi-celebes",
    title: "🌊 Spirit of Sulawesi",
    subtitle: "The Emerald Seas of Celebes",
    artist: "Pappasang & Bahari Bugis",
    region: "Sulawesi",
    src: "/lagu/🌊 Spirit of Sulawesi The Emerald Seas of Celebes.mp3",
    duration: "3:30",
  },
  {
    id: "instrumen-tari-makassar",
    title: "Instrumen Tari Makassar",
    subtitle: "Sinematik Gendang Bulo & Puwi-Puwi",
    artist: "Ensemble Tari Makassar",
    region: "Sulawesi Selatan",
    src: "/lagu/Instrumen Musik Makassar, Cocok untuk Tari Kreasi, Sinematik Makassar, Free (No Copyright).mp3",
    duration: "4:43",
  },

  // --- Kategori: Kalimantan (Borneo) ---
  {
    id: "spirit-of-borneo-nabau",
    title: "🐍 Spirit of Borneo",
    subtitle: "Black Rainforest The Legend of Nabau",
    artist: "Sape Dayak & Etnik Rimba Borneo",
    region: "Kalimantan",
    src: "/lagu/🐍 Spirit of Borneo Black Rainforest The Legend of Nabau.mp3",
    duration: "3:27",
  },
  {
    id: "borneo-wooden-pulse",
    title: "The Forest Has A Heartbeat 🌿🔥",
    subtitle: "Borneo Wooden Pulse & Rainforest Dance",
    artist: "Sape & Perkusi Rimba Borneo",
    region: "Kalimantan",
    src: "/lagu/THE FOREST HAS A HEARTBEAT 🌿🔥 Borneo Wooden Pulse & Rainforest Dance.mp3",
    duration: "3:06",
  },

  // --- Kategori: Papua ---
  {
    id: "spirit-of-papua-paradise",
    title: "🌿 Spirit of Papua",
    subtitle: "The Last Paradise on Earth Cinematic Tribal",
    artist: "Tifa Melodi Rimba Papua",
    region: "Papua",
    src: "/lagu/🌿 Spirit of Papua The Last Paradise on Earth Cinematic Tribal Music.mp3",
    duration: "3:28",
  },
];
