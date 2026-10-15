export type ActiveTab =
  | 'video-analyzer'
  | 'zero-cost-video-creator'
  | 'live-studio'
  | '30s-audio-engine'
  | 'ai-lab'
  | 'citizendesk'
  | 'gmail'
  | 'project-hub'
  | 'vpn-studio';

export interface LiveStreamOverlay {
  showLiveBadge: boolean;
  showLogo: boolean;
  logoText: string;
  showTicker: boolean;
  tickerText: string;
  tickerSpeed: number; // 1-5
  showLowerThird: boolean;
  lowerThirdTitle: string;
  lowerThirdSubtitle: string;
  lowerThirdTheme: 'broadcast-red' | 'cyber-neon' | 'royal-gold' | 'minimal-dark';
  activeCommentOnScreen: {
    userName: string;
    comment: string;
    avatarUrl?: string;
    timestamp: string;
  } | null;
  layout: 'split-screen' | 'solo-anchor' | 'pip' | 'grid';
}

export interface LiveChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  isHost?: boolean;
  onScreen?: boolean;
}

export interface SampleVideo {
  id: string;
  title: string;
  titleBn: string;
  duration: string;
  category: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  simulatedKeyframes?: string[];
  presetKeyInfo: string;
}

export interface VideoAnalysisResult {
  analysis: string;
  modelUsed: string;
  fallbackUsed: boolean;
  timestamp: string;
  analysisType: string;
}

export interface HotlineItem {
  number: string;
  title: string;
  titleBn: string;
  category: string;
  description: string;
  isEmergency: boolean;
  available: string;
}

export interface DistrictThana {
  district: string;
  districtBn: string;
  thanas: string[];
}

export interface GDFormData {
  thana: string;
  district: string;
  applicantName: string;
  fatherName: string;
  motherName: string;
  nidOrBirthNo: string;
  mobile: string;
  presentAddress: string;
  permanentAddress: string;
  incidentDate: string;
  incidentTime: string;
  incidentPlace: string;
  itemType: 'nid' | 'mobile' | 'license' | 'passport' | 'certificate' | 'cheque' | 'other';
  itemDetails: string;
  generalDescription: string;
}

export interface LeaveFormData {
  officeName: string;
  designation: string;
  applicantName: string;
  leaveType: 'casual' | 'earned' | 'medical' | 'maternity' | 'special';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  addressDuringLeave: string;
  emergencyContact: string;
}

export interface GmailLabel {
  id: string;
  name: string;
  type: 'system' | 'user';
  messagesTotal?: number;
  messagesUnread?: number;
  color?: {
    backgroundColor: string;
    textColor: string;
  };
}

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  sender: string;
  senderEmail: string;
  subject: string;
  date: string;
  body: string;
  isStarred?: boolean;
  isRead?: boolean;
}

export interface SheikhProject {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  status: 'Active' | 'Beta' | 'Production';
  techStack: string[];
  description: string;
  highlights: string[];
  githubUrl: string;
  liveDemoUrl?: string;
  iconName: string;
}
