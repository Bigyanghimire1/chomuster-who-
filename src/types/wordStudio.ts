export type ReviewStatus =
  | 'awaiting_review'
  | 'approved'
  | 'needs_improvement'
  | 'flagged'
  | 'proposed';

export type RecommendationStatus =
  | 'approved'
  | 'good_needs_improvement'
  | 'poor_association'
  | 'too_obscure'
  | 'too_obvious'
  | 'duplicate'
  | 'replace_word'
  | 'missing_hints';

export interface EditorialAssessment {
  wordFamiliarity: 'high' | 'medium' | 'low';
  hintFamiliarity: 'high' | 'medium' | 'low';
  semanticStrength: 'strong' | 'moderate' | 'weak';
  culturalAccessibility: 'global' | 'regional' | 'niche';
  multiImposterFairness: 'balanced' | 'asymmetric';
  recommendation: RecommendationStatus;
  notes: string;
}

export interface HintWithRationale {
  hint: string;
  rationale: string;
}

export interface ProposedHints {
  subtle: [HintWithRationale, HintWithRationale, HintWithRationale];
  balanced: [HintWithRationale, HintWithRationale, HintWithRationale];
  easy: [HintWithRationale, HintWithRationale, HintWithRationale];
}

export interface ChangeRecord {
  timestamp: string;
  action: string;
  details: string;
}

export interface ReviewableWordEntry {
  id: string;
  word: string;
  categoryId: string;
  categoryName: string;
  source: 'wordDatabase.ts' | 'categories.ts' | 'custom' | 'new_proposed';
  currentHints: {
    subtle: string[];
    balanced: string[];
    easy: string[];
  };
  proposedHints?: ProposedHints;
  status: ReviewStatus;
  editorial: EditorialAssessment;
  approvedWord?: string;
  approvedCategory?: string;
  approvedHints?: {
    subtle: string[];
    balanced: string[];
    easy: string[];
  };
  approvedAt?: string;
  isDeleted?: boolean;
  notes?: string;
  changeHistory: ChangeRecord[];
}

export interface WordStudioStats {
  totalWords: number;
  totalCategories: number;
  fullyHintSupported: number;
  awaitingReview: number;
  approved: number;
  needsImprovement: number;
  flagged: number;
  newlyProposed: number;
  missingHints: number;
  duplicates: number;
}

export interface WordStudioFilters {
  searchQuery: string;
  categoryId: string; // 'all' or specific category
  difficulty: 'all' | 'subtle' | 'balanced' | 'easy' | 'missing';
  reviewStatus: 'all' | ReviewStatus;
  recommendation: 'all' | RecommendationStatus;
  source: 'all' | 'wordDatabase.ts' | 'categories.ts' | 'custom' | 'new_proposed';
  sortBy: 'word_asc' | 'word_desc' | 'category' | 'status' | 'updated';
}
