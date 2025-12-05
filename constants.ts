import { WordConfig, PlayerScore } from './types';

export const PUZZLE_DATA: WordConfig[] = [
  {
    id: 'cosbuddies',
    displayName: 'COSBUDDIES',
    answer: 'COSBUDDIES',
    clue: 'We represent the helping hand for all Cosplayers, helping with repairs and navigation.',
    hint: 'They are the medics for costumes in distress.',
    secretIndex: 3, // B
    secretPosition: 0,
    direction: 'ACROSS',
    number: 1
  },
  {
    id: 'gaming',
    displayName: 'GAMING',
    answer: 'GAMING',
    clue: 'Manages tournaments, free-play zones, and keeps the high scores rolling.',
    hint: 'Where digital warriors compete and play.',
    secretIndex: 1, // A
    secretPosition: 1,
    direction: 'ACROSS',
    number: 2
  },
  {
    id: 'welcoming',
    displayName: 'WELCOMING',
    answer: 'WELCOMING',
    clue: 'The first smile attendees see; responsible for badge distribution and crowd flow at entry.',
    hint: 'The first faces you see, granting passage to the realm.',
    secretIndex: 7, // N
    secretPosition: 2,
    direction: 'ACROSS',
    number: 3
  },
  {
    id: 'stage',
    displayName: 'STAGE',
    answer: 'STAGE',
    clue: 'Controls the main event flow, assisting hosts and ensuring schedule adherence.',
    hint: 'Timekeepers of the main spectacle.',
    secretIndex: 3, // G
    secretPosition: 3,
    direction: 'ACROSS',
    number: 4
  },
  {
    id: 'damage',
    displayName: 'DAMAGE',
    answer: 'DAMAGE',
    clue: 'Crisis management and rapid response for any on-ground issues.',
    hint: 'The rapid response team for sudden chaos.',
    secretIndex: 1, // A
    secretPosition: 4,
    direction: 'ACROSS',
    number: 5
  },
  {
    id: 'social',
    displayName: 'SOCIAL',
    answer: 'SOCIAL',
    clue: 'Captures the vibe for Instagram and Twitter live updates.',
    hint: 'Broadcasters of the moment to the digital world.',
    secretIndex: 5, // L
    secretPosition: 5,
    direction: 'ACROSS',
    number: 6
  },
  {
    id: 'food',
    displayName: 'FOOD',
    answer: 'FOOD',
    clue: 'Keeps the volunteers and staff fed and hydrated.',
    hint: 'They ensure the army marches on a full stomach.',
    secretIndex: 1, // O
    secretPosition: 6,
    direction: 'ACROSS',
    number: 7
  },
  {
    id: 'research',
    displayName: 'RESEARCH',
    answer: 'RESEARCH',
    clue: 'Collects data and feedback from attendees to improve future shows.',
    hint: 'Gatherers of opinions to shape the future.',
    secretIndex: 0, // R
    secretPosition: 7,
    direction: 'ACROSS',
    number: 8
  },
  {
    id: 'media',
    displayName: 'MEDIA',
    answer: 'MEDIA',
    clue: 'Escorts press, photographers, and manages the media registration desk.',
    hint: 'Escorts for the press and photographers.',
    secretIndex: 1, // E
    secretPosition: 8,
    direction: 'ACROSS',
    number: 9
  },
  {
    id: 'cci',
    displayName: 'CCI',
    answer: 'CCI',
    clue: 'Comic Con India Core Information desk and merchandise.',
    hint: 'The central hub for information and treasure.',
    secretIndex: 0, // C
    secretPosition: 9,
    direction: 'DOWN',
    number: 10
  },
  {
    id: 'cosplay',
    displayName: 'COSPLAY',
    answer: 'COSPLAY',
    clue: 'Manages the contest registration, prejudging, and green room.',
    hint: 'Organizers of the masquerade and competition.',
    secretIndex: 1, // O
    secretPosition: 10,
    direction: 'DOWN',
    number: 11
  },
  {
    id: 'mechanic',
    displayName: 'MECHANIC',
    answer: 'MECHANIC',
    clue: 'Handles on-ground logistics, setup repairs, and physical assets.',
    hint: 'The hands that build and fix the physical realm.',
    secretIndex: 0, // M
    secretPosition: 11,
    direction: 'DOWN',
    number: 12
  },
  {
    id: 'ticketing',
    displayName: 'TICKETING',
    answer: 'TICKETING',
    clue: 'Scans QR codes and validates entry passes.',
    hint: 'Scanners of the sacred QR codes.',
    secretIndex: 1, // I
    secretPosition: 12,
    direction: 'DOWN',
    number: 13
  },
  {
    id: 'client',
    displayName: 'CLIENT',
    answer: 'CLIENT',
    clue: 'Liaison for exhibitors and sponsor booths.',
    hint: 'The bridge between the show and the brands.',
    secretIndex: 0, // C
    secretPosition: 13,
    direction: 'DOWN',
    number: 14
  },
  {
    id: 'celebrity',
    displayName: 'CELEBRITY',
    answer: 'CELEBRITY',
    clue: 'Shadows special guests and manages autograph sessions.',
    hint: 'Guardians of the visiting stars.',
    secretIndex: 0, // C
    secretPosition: 14,
    direction: 'DOWN',
    number: 15
  },
  {
    id: 'crowdcontrol',
    displayName: 'CROWD CONTROL',
    answer: 'CROWDCONTROL',
    clue: 'Ensures safety and manages queues in high-traffic areas.',
    hint: 'Masters of the queue and safe passage.',
    secretIndex: 2, // O
    secretPosition: 15,
    direction: 'DOWN',
    number: 16
  },
  {
    id: 'operations',
    displayName: 'OPERATIONS',
    answer: 'OPERATIONS',
    clue: 'The backbone of the show, coordinating between all departments.',
    hint: 'The central nervous system of the entire event.',
    secretIndex: 8, // N
    secretPosition: 16,
    direction: 'DOWN',
    number: 17
  }
];

export const SECRET_PHRASE_LENGTH = 17;
export const FINAL_PHRASE = "BANGALORE COMIC CON";