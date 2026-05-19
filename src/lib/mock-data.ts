// Mock data for Haven prototype
export type Zone = {
  id: string;
  name: string;
  municipality: string;
  center: [number, number]; // lat, lng (not used precisely - SVG map)
};

export const zones: Zone[] = [
  { id: "kralingen", name: "Rotterdam Kralingen", municipality: "Rotterdam", center: [51.923, 4.532] },
  { id: "centrum", name: "Rotterdam Centrum", municipality: "Rotterdam", center: [51.922, 4.479] },
  { id: "noord", name: "Rotterdam Noord", municipality: "Rotterdam", center: [51.94, 4.47] },
  { id: "west", name: "Rotterdam West", municipality: "Rotterdam", center: [51.92, 4.45] },
  { id: "zuid", name: "Rotterdam Zuid", municipality: "Rotterdam", center: [51.88, 4.49] },
  { id: "delfshaven", name: "Rotterdam Delfshaven", municipality: "Rotterdam", center: [51.91, 4.44] },
  { id: "crooswijk", name: "Rotterdam Crooswijk", municipality: "Rotterdam", center: [51.93, 4.51] },
];

export type Interest = { id: string; name: string; icon: string; subs: string[] };
export const interests: Interest[] = [
  { id: "sports", name: "Sports", icon: "🏀", subs: ["Basketball", "Football", "Running", "Walking", "Tennis", "Gym/Fitness", "Cycling"] },
  { id: "board", name: "Board Games", icon: "🎲", subs: ["Strategy", "Party games", "Chess", "Card games"] },
  { id: "literature", name: "Literature", icon: "📚", subs: ["Book club", "Poetry", "Quiet reading", "Writing"] },
  { id: "music", name: "Music", icon: "🎵", subs: ["Concerts", "Choir", "Jam sessions", "Music appreciation", "DJ events"] },
  { id: "dance", name: "Dance", icon: "💃", subs: ["Beginner dance", "Salsa", "Hip-hop", "Folk"] },
  { id: "gaming", name: "Gaming", icon: "🎮", subs: ["Console", "PC", "Retro", "Tabletop RPG"] },
  { id: "cooking", name: "Cooking", icon: "🍳", subs: ["Community dinners", "Cooking workshops", "Baking", "Cultural food nights"] },
  { id: "arts", name: "Arts & Crafts", icon: "🎨", subs: ["Painting", "Pottery", "Drawing"] },
];

export const ageRanges = ["18–25", "25–35", "35–45", "45–60", "60+"] as const;
export type AgeRange = typeof ageRanges[number];

export type ParticipationState = "Interested" | "Maybe" | "Join" | "Remind me later" | "Bring a friend" | "Spectator";

export type EventStatus = "live" | "scheduled" | "almost-full" | "full" | "at-risk" | "cancelled" | "minimum-reached";

export type CivicEvent = {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  icon: string;
  description: string;
  zoneId: string;
  locationName: string;
  // SVG coordinates in 0-100 range for the mock map
  pin: { x: number; y: number };
  coords: string;
  startTime: string; // human readable
  startInMin: number; // sort
  organiser: string;
  organiserVerified: boolean;
  status: EventStatus;
  isLive: boolean;
  minCapacity: number;
  maxCapacity: number;
  currentRegistration: number;
  beginnerFriendly: boolean;
  skillLevel: "Any" | "Beginner" | "Intermediate" | "Advanced";
  ageRangeMin: number;
  ageRangeMax: number;
  accessibility: string;
  peopleComeAlone: boolean;
  welcomeHost: boolean;
  teamBased: boolean;
  teamSize?: number;
  spectatorsAllowed: boolean;
  bringFriendAllowed: boolean;
  distanceKm: number;
  recommendationReason: string;
  whatToBring: string[];
};

export const events: CivicEvent[] = [
  {
    id: "evt-1",
    title: "Beginner 3v3 Basketball Run",
    category: "Sports", subcategory: "Basketball", icon: "🏀",
    description: "Casual 3v3 pickup. Teams assigned on the spot. Welcome host on site.",
    zoneId: "kralingen", locationName: "Kralingen Court",
    pin: { x: 62, y: 48 }, coords: "51.9231, 4.5321",
    startTime: "Today 18:00", startInMin: 30,
    organiser: "Rotterdam Sports", organiserVerified: true,
    status: "almost-full", isLive: false,
    minCapacity: 6, maxCapacity: 12, currentRegistration: 8,
    beginnerFriendly: true, skillLevel: "Beginner",
    ageRangeMin: 18, ageRangeMax: 99,
    accessibility: "Wheelchair accessible court",
    peopleComeAlone: true, welcomeHost: true,
    teamBased: true, teamSize: 3,
    spectatorsAllowed: true, bringFriendAllowed: true,
    distanceKm: 1.2,
    recommendationReason: "Recommended because you selected basketball, beginner level, evenings, and events within 2km.",
    whatToBring: ["Water bottle", "Comfortable shoes"],
  },
  {
    id: "evt-2",
    title: "Quiet Reading Circle",
    category: "Literature", subcategory: "Quiet reading", icon: "📚",
    description: "Bring a book. Read together in silence with tea. No talking expected.",
    zoneId: "kralingen", locationName: "Kralingen Library",
    pin: { x: 38, y: 36 }, coords: "51.9242, 4.5289",
    startTime: "Sat 14:00", startInMin: 60 * 28,
    organiser: "Rotterdam Library", organiserVerified: true,
    status: "minimum-reached", isLive: false,
    minCapacity: 3, maxCapacity: 10, currentRegistration: 5,
    beginnerFriendly: true, skillLevel: "Any",
    ageRangeMin: 18, ageRangeMax: 99,
    accessibility: "Step-free entry, hearing loop available",
    peopleComeAlone: true, welcomeHost: true,
    teamBased: false,
    spectatorsAllowed: true, bringFriendAllowed: true,
    distanceKm: 0.6,
    recommendationReason: "Recommended because you chose quiet activities, literature, and events where people usually come alone.",
    whatToBring: ["A book", "Reading glasses if needed"],
  },
  {
    id: "evt-3",
    title: "Community Dinner — Surinamese Night",
    category: "Cooking", subcategory: "Cultural food nights", icon: "🍲",
    description: "Cook and share a meal together. All skill levels welcome.",
    zoneId: "kralingen", locationName: "Buurthuis Kralingen",
    pin: { x: 54, y: 62 }, coords: "51.9210, 4.5350",
    startTime: "Fri 19:00", startInMin: 60 * 50,
    organiser: "Buurthuis Kralingen", organiserVerified: true,
    status: "scheduled", isLive: false,
    minCapacity: 8, maxCapacity: 24, currentRegistration: 12,
    beginnerFriendly: true, skillLevel: "Any",
    ageRangeMin: 18, ageRangeMax: 99,
    accessibility: "Accessible kitchen and seating",
    peopleComeAlone: true, welcomeHost: true,
    teamBased: false,
    spectatorsAllowed: false, bringFriendAllowed: true,
    distanceKm: 1.0,
    recommendationReason: "Recommended because you chose cooking, community dinners, and friendly weekend events.",
    whatToBring: ["Apron (optional)", "Appetite"],
  },
  {
    id: "evt-4",
    title: "Board Game Night — Catan & Co.",
    category: "Board Games", subcategory: "Strategy", icon: "🎲",
    description: "Drop-in board game night. Beginners paired with friendly regulars.",
    zoneId: "centrum", locationName: "Centrale Bibliotheek",
    pin: { x: 28, y: 50 }, coords: "51.9220, 4.4790",
    startTime: "Now — live", startInMin: 0,
    organiser: "Spel & Buur", organiserVerified: true,
    status: "almost-full", isLive: true,
    minCapacity: 6, maxCapacity: 16, currentRegistration: 13,
    beginnerFriendly: true, skillLevel: "Any",
    ageRangeMin: 18, ageRangeMax: 99,
    accessibility: "Elevator access",
    peopleComeAlone: true, welcomeHost: true,
    teamBased: false,
    spectatorsAllowed: true, bringFriendAllowed: true,
    distanceKm: 3.4,
    recommendationReason: "Recommended because you selected board games and events where people usually come alone.",
    whatToBring: ["Nothing — games provided"],
  },
  {
    id: "evt-5",
    title: "Evening Walking Group",
    category: "Sports", subcategory: "Walking", icon: "🚶",
    description: "Easy 4km loop around Kralingse Plas. Chat optional.",
    zoneId: "kralingen", locationName: "Kralingse Plas — North entrance",
    pin: { x: 72, y: 30 }, coords: "51.9281, 4.5301",
    startTime: "Today 19:30", startInMin: 120,
    organiser: "Wandelclub Rotterdam", organiserVerified: true,
    status: "scheduled", isLive: false,
    minCapacity: 3, maxCapacity: 30, currentRegistration: 9,
    beginnerFriendly: true, skillLevel: "Any",
    ageRangeMin: 18, ageRangeMax: 99,
    accessibility: "Flat paved route",
    peopleComeAlone: true, welcomeHost: true,
    teamBased: false,
    spectatorsAllowed: false, bringFriendAllowed: true,
    distanceKm: 1.5,
    recommendationReason: "Recommended because you chose walking and low-pressure evening activities.",
    whatToBring: ["Comfortable shoes", "Light jacket"],
  },
  {
    id: "evt-6",
    title: "Beginner Salsa Class",
    category: "Dance", subcategory: "Beginner dance", icon: "💃",
    description: "First-time friendly. Partners rotated. No experience needed.",
    zoneId: "centrum", locationName: "Dansstudio Centrum",
    pin: { x: 22, y: 64 }, coords: "51.9201, 4.4810",
    startTime: "Sun 16:00", startInMin: 60 * 40,
    organiser: "Stichting Dans Rotterdam", organiserVerified: true,
    status: "scheduled", isLive: false,
    minCapacity: 6, maxCapacity: 20, currentRegistration: 4,
    beginnerFriendly: true, skillLevel: "Beginner",
    ageRangeMin: 18, ageRangeMax: 60,
    accessibility: "Step-free entry",
    peopleComeAlone: true, welcomeHost: true,
    teamBased: false,
    spectatorsAllowed: true, bringFriendAllowed: true,
    distanceKm: 3.6,
    recommendationReason: "Recommended because you selected dance and beginner-friendly events.",
    whatToBring: ["Comfortable shoes"],
  },
  {
    id: "evt-7",
    title: "Language Café — English / Dutch",
    category: "Literature", subcategory: "Conversation", icon: "🗣️",
    description: "Practice languages over coffee. Newcomers especially welcome.",
    zoneId: "noord", locationName: "Café Buurt Noord",
    pin: { x: 48, y: 18 }, coords: "51.9401, 4.4720",
    startTime: "Wed 18:30", startInMin: 60 * 70,
    organiser: "Welkom Rotterdam", organiserVerified: true,
    status: "scheduled", isLive: false,
    minCapacity: 4, maxCapacity: 20, currentRegistration: 7,
    beginnerFriendly: true, skillLevel: "Any",
    ageRangeMin: 18, ageRangeMax: 99,
    accessibility: "Step-free entry",
    peopleComeAlone: true, welcomeHost: true,
    teamBased: false,
    spectatorsAllowed: false, bringFriendAllowed: true,
    distanceKm: 4.1,
    recommendationReason: "Recommended because you selected literature and newcomer-friendly events.",
    whatToBring: ["Nothing"],
  },
];

export type RecommendationInputs = {
  hobbies: string[];
  zoneId: string;
  ageRange: AgeRange;
  beginnerPreferred: boolean;
  radiusKm: number;
};

export type Notification = {
  id: string;
  text: string;
};

export const sampleNotifications: Notification[] = [
  { id: "n1", text: "Street basketball near you tonight. Want to join a team?" },
  { id: "n2", text: "A quiet reading circle has 3 open spots this Saturday." },
  { id: "n3", text: "Two people nearby are joining a beginner-friendly walking group." },
];

export const municipalityMetrics = {
  eventsThisMonth: 42,
  totalAttendances: 318,
  firstTimePercent: 37,
  hobbyTrends: [
    { label: "Basketball demand", zone: "Kralingen", delta: "+18%" },
    { label: "Board games", zone: "Centrum", delta: "reaching capacity fastest" },
    { label: "Walking groups", zone: "Noord", delta: "+9%" },
    { label: "Community dinners", zone: "Delfshaven", delta: "+12%" },
  ],
  heatmap: [
    { zone: "Kralingen", intensity: 0.9 },
    { zone: "Centrum", intensity: 0.7 },
    { zone: "Noord", intensity: 0.5 },
    { zone: "Delfshaven", intensity: 0.6 },
    { zone: "Crooswijk", intensity: 0.3 },
    { zone: "Zuid", intensity: 0.4 },
  ],
  individualProfilesAccessible: 0,
};

export type AiProposal = {
  id: string;
  title: string;
  zone: string;
  summary: string;
  suggestedTime: string;
};

export const aiProposals: AiProposal[] = [
  {
    id: "ai-1",
    title: "Beginner 3v3 Street Run",
    zone: "Kralingen",
    summary: "AI detected high basketball interest in Kralingen tonight. 14 nearby users selected basketball. Weather is clear.",
    suggestedTime: "Today 18:30",
  },
  {
    id: "ai-2",
    title: "Karaoke Welcome Night",
    zone: "Centrum",
    summary: "7 nearby users selected karaoke this week. Venue: KaraokeBar Centrum available Friday.",
    suggestedTime: "Fri 20:00",
  },
];
