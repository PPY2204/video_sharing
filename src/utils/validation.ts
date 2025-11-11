/**
 * Validation Utilities
 * Helper functions for form and data validation
 */

import {
  ERROR_MESSAGES,
  MAX_BIO_LENGTH,
  MAX_COMMENT_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_HASHTAGS,
  MAX_TITLE_LENGTH,
  MAX_USERNAME_LENGTH,
  MAX_VIDEO_DURATION,
  MAX_VIDEO_SIZE,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  MIN_VIDEO_DURATION,
  REGEX_PATTERNS,
  SUPPORTED_IMAGE_FORMATS,
  SUPPORTED_VIDEO_FORMATS,
} from "./constants";

// ==================== EMAIL VALIDATION ====================

export const isValidEmail = (email: string): boolean => {
  return REGEX_PATTERNS.EMAIL.test(email.trim());
};

export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";
  if (!isValidEmail(email)) return ERROR_MESSAGES.INVALID_EMAIL;
  return null;
};

// ==================== USERNAME VALIDATION ====================

export const isValidUsername = (username: string): boolean => {
  return REGEX_PATTERNS.USERNAME.test(username.trim());
};

export const validateUsername = (username: string): string | null => {
  if (!username) return "Username is required";
  if (username.length < MIN_USERNAME_LENGTH) {
    return `Username must be at least ${MIN_USERNAME_LENGTH} characters`;
  }
  if (username.length > MAX_USERNAME_LENGTH) {
    return `Username must be less than ${MAX_USERNAME_LENGTH} characters`;
  }
  if (!isValidUsername(username)) {
    return ERROR_MESSAGES.INVALID_USERNAME;
  }
  return null;
};

// ==================== PASSWORD VALIDATION ====================

export const isStrongPassword = (password: string): boolean => {
  if (password.length < MIN_PASSWORD_LENGTH) return false;

  // Check for at least one uppercase, one lowercase, and one number
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  return hasUppercase && hasLowercase && hasNumber;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return ERROR_MESSAGES.WEAK_PASSWORD;
  }
  if (!isStrongPassword(password)) {
    return "Password must contain uppercase, lowercase, and number";
  }
  return null;
};

// ==================== VIDEO VALIDATION ====================

interface VideoFile {
  type?: string;
  size: number;
  uri?: string;
}

export const validateVideoFile = (
  file: VideoFile,
  duration?: number
): string | null => {
  // Check file type
  if (file.type && !SUPPORTED_VIDEO_FORMATS.includes(file.type)) {
    return "Unsupported video format. Use MP4, MOV, or AVI";
  }

  // Check file size
  if (file.size > MAX_VIDEO_SIZE) {
    return ERROR_MESSAGES.VIDEO_TOO_LARGE;
  }

  // Check duration if provided
  if (duration !== undefined) {
    if (duration < MIN_VIDEO_DURATION) {
      return ERROR_MESSAGES.VIDEO_TOO_SHORT;
    }
    if (duration > MAX_VIDEO_DURATION) {
      return ERROR_MESSAGES.VIDEO_TOO_LONG;
    }
  }

  return null;
};

interface ImageFile {
  type?: string;
  size: number;
  uri?: string;
}

export const validateImageFile = (file: ImageFile): string | null => {
  if (file.type && !SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
    return "Unsupported image format. Use JPG, PNG, or WebP";
  }

  if (file.size > 10 * 1024 * 1024) {
    // 10MB limit
    return "Image size must be less than 10MB";
  }

  return null;
};

// ==================== TEXT VALIDATION ====================

export const validateTitle = (title: string): string | null => {
  if (!title) return "Title is required";
  if (title.trim().length === 0) return "Title cannot be empty";
  if (title.length > MAX_TITLE_LENGTH) {
    return `Title must be less than ${MAX_TITLE_LENGTH} characters`;
  }
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`;
  }
  return null;
};

export const validateBio = (bio: string): string | null => {
  if (bio.length > MAX_BIO_LENGTH) {
    return `Bio must be less than ${MAX_BIO_LENGTH} characters`;
  }
  return null;
};

export const validateComment = (comment: string): string | null => {
  if (!comment) return "Comment cannot be empty";
  if (comment.trim().length === 0) return "Comment cannot be empty";
  if (comment.length > MAX_COMMENT_LENGTH) {
    return `Comment must be less than ${MAX_COMMENT_LENGTH} characters`;
  }
  return null;
};

// ==================== HASHTAG VALIDATION ====================

export const extractHashtags = (text: string): string[] => {
  const matches = text.match(REGEX_PATTERNS.HASHTAG);
  if (!matches) return [];

  // Remove # and deduplicate
  return [...new Set(matches.map((tag) => tag.substring(1).toLowerCase()))];
};

export const validateHashtags = (hashtags: string[]): string | null => {
  if (hashtags.length > MAX_HASHTAGS) {
    return `Maximum ${MAX_HASHTAGS} hashtags allowed`;
  }

  for (const tag of hashtags) {
    if (tag.length < 2) {
      return "Hashtags must be at least 2 characters";
    }
    if (tag.length > 30) {
      return "Hashtags must be less than 30 characters";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(tag)) {
      return "Hashtags can only contain letters, numbers, and underscores";
    }
  }

  return null;
};

// ==================== MENTION VALIDATION ====================

export const extractMentions = (text: string): string[] => {
  const matches = text.match(REGEX_PATTERNS.MENTION);
  if (!matches) return [];

  // Remove @ and deduplicate
  return [
    ...new Set(matches.map((mention) => mention.substring(1).toLowerCase())),
  ];
};

// ==================== URL VALIDATION ====================

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const extractUrls = (text: string): string[] => {
  const matches = text.match(REGEX_PATTERNS.URL);
  return matches || [];
};

// ==================== GENERIC VALIDATION ====================

export const isNotEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
};

export const isBetween = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// ==================== FORM VALIDATION ====================

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateLoginForm = (
  email: string,
  password: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  if (!password) errors.password = "Password is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterForm = (
  username: string,
  email: string,
  password: string,
  fullName: string
): ValidationResult => {
  const errors: Record<string, string> = {};

  const usernameError = validateUsername(username);
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  if (!fullName || fullName.trim().length === 0) {
    errors.fullName = "Full name is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateVideoUploadForm = (
  title: string,
  description: string,
  hashtags: string[]
): ValidationResult => {
  const errors: Record<string, string> = {};

  const titleError = validateTitle(title);
  if (titleError) errors.title = titleError;

  const descriptionError = validateDescription(description);
  if (descriptionError) errors.description = descriptionError;

  const hashtagError = validateHashtags(hashtags);
  if (hashtagError) errors.hashtags = hashtagError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
