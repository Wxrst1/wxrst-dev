
export enum ThemeType {
  CHRISTMAS = 'CHRISTMAS',
  HALLOWEEN = 'HALLOWEEN',
  NEW_YEAR = 'NEW_YEAR',
  VALENTINE = 'VALENTINE',
  SAO_JOAO = 'SAO_JOAO',
  AUTUMN = 'AUTUMN',
  CARNIVAL = 'CARNIVAL',
  EASTER = 'EASTER',
  CYBERPUNK = 'CYBERPUNK',
  HORROR = 'HORROR',
  WAR = 'WAR',
  SERIAL_KILLER = 'SERIAL_KILLER',
  LABYRINTH = 'LABYRINTH',
  NIGHTMARE = 'NIGHTMARE',
  FBI_INVESTIGATION = 'FBI_INVESTIGATION',
  DRUG_DEALER = 'DRUG_DEALER',
  SINGULARITY = 'SINGULARITY',
  SOLAR_SYSTEM = 'SOLAR_SYSTEM',
  PIRATE = 'PIRATE',
  MEDICAL = 'MEDICAL',
  BLOOD_STAIN = 'BLOOD_STAIN',
  SHOOTING = 'SHOOTING',
  AETHER_QUANTUM = 'AETHER_QUANTUM',
  RUSTIC_HARVEST = 'RUSTIC_HARVEST',
  BANK = 'BANK',
  ALCHEMIST = 'ALCHEMIST',
  GAMING_PRO = 'GAMING_PRO',
  INVESTIGATIVE_HORROR = 'INVESTIGATIVE_HORROR',
  QUANTUM_NEXUS = 'QUANTUM_NEXUS',
  NEURAL_CANVAS = 'NEURAL_CANVAS',
  VOID_COMMERCE = 'VOID_COMMERCE',
  INTERROGATION_ROOM = 'INTERROGATION_ROOM',
  THE_HEIST = 'THE_HEIST',
  THE_CORRUPTION = 'THE_CORRUPTION',
  THE_MUSEUM = 'THE_MUSEUM',
  MATRIX = 'MATRIX',
  STEAMPUNK = 'STEAMPUNK',
  THE_EXORCISM = 'THE_EXORCISM'
}

export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  links: { id?: number; label: string; url: string; status?: string; category?: string }[];
  socials?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    discord?: string;
    steam?: string;
  };
  status_mode?: string;
  status_emoji?: string;
  activity_playing?: string;
  activity_watching?: string;
  activity_working?: string;
  featured_project?: string;
  song_on_repeat?: string;
  timezone?: string;
}

export const DEFAULT_PROFILE: UserProfile = {
  name: "Agent Zero",
  title: "Lead Digital Architect",
  bio: "Specializing in reality-bending interfaces and secure data extraction protocols.",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow",
  links: [
    { label: "GitHub", url: "#" },
    { label: "Twitter", url: "#" },
    { label: "LinkedIn", url: "#" }
  ],
  socials: {
    github: "http://github.com/",
    twitter: "https://twitter.com/",
    linkedin: "https://linkedin.com/in/"
  }
};

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  url?: string;
  category: string;
  timestamp: string;
  status: 'ACTIVE' | 'CRITICAL' | 'STABLE';
  codeSnippet?: string;
  mazePos?: { x: number, y: number };
  clickCount?: number;
}

export const MOCK_DATA: ContentItem[] = [
  {
    id: '001',
    title: 'Quantum Entanglement Protocol',
    description: 'Establishment of non-local communication channels across interstellar distances.',
    category: 'PHYSICS',
    timestamp: '2024-12-12T08:30:00Z',
    status: 'ACTIVE',
    codeSnippet: 'fn connect<T>(node: Node) -> Result<T, Error> { ... }',
    mazePos: { x: 1, y: 8 }
  },
  {
    id: '002',
    title: 'Neural Link Latency Test',
    description: 'Measured synaptic bridge delays in experimental cerebral-computer interfaces.',
    category: 'BIOTECH',
    timestamp: '2024-10-31T14:20:00Z',
    status: 'CRITICAL',
    mazePos: { x: 8, y: 1 }
  },
  {
    id: '003',
    title: 'Sub-Zero Data Storage',
    description: 'Persisting volatile memory states using liquid nitrogen cooling arrays.',
    category: 'HARDWARE',
    timestamp: '2024-06-24T09:45:00Z',
    status: 'STABLE',
    mazePos: { x: 8, y: 8 }
  },
  {
    id: '004',
    title: 'The Whispering Shadows',
    description: 'Strange occurrences reported in the eastern maintenance tunnel near sector 7.',
    category: 'ANOMALY',
    timestamp: '2024-10-15T03:00:00Z',
    status: 'CRITICAL',
    mazePos: { x: 5, y: 5 }
  },
  {
    id: '005',
    title: 'Aether Engine Calibration',
    description: 'Fine-tuning the pressure regulators for the brass-plated steam condensers.',
    category: 'MECHANICAL',
    timestamp: '2024-04-17T11:15:00Z',
    status: 'STABLE',
    mazePos: { x: 1, y: 1 }
  }
];

export const getAutoTheme = (): ThemeType => {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  if (m === 12 && d <= 26) return ThemeType.CHRISTMAS;
  if ((m === 12 && d >= 27) || (m === 1 && d <= 5)) return ThemeType.NEW_YEAR;
  if (m === 2 && d >= 7 && d <= 15) return ThemeType.VALENTINE;
  if (m === 10 && d >= 15 && d <= 31) return ThemeType.HALLOWEEN;
  if (m === 6 && d >= 15 && d <= 30) return ThemeType.SAO_JOAO;
  if (m >= 9 && m <= 11) return ThemeType.AUTUMN;
  return ThemeType.AETHER_QUANTUM;
};
