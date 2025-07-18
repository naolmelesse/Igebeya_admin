// utils/validation.ts
export const ValidationUtils = {
  // Email validation
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  // Username validation
  isValidUsername: (username: string): boolean => {
    const trimmed = username.trim();
    return trimmed.length >= 3 && trimmed.length <= 10 && /^[a-zA-Z0-9_]+$/.test(trimmed);
  },

  // Password validation
  isValidPassword: (password: string): boolean => {
    return password.length >= 6;
  },

  // Strong password validation (optional)
  isStrongPassword: (password: string): boolean => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  },

  // 2FA code validation
  isValid2FA: (code: string): boolean => {
    return /^\d{6}$/.test(code.trim());
  },

  // Chat ID validation
  isValidChatId: (chatId: string | number): boolean => {
    const id = typeof chatId === 'string' ? parseInt(chatId) : chatId;
    return !isNaN(id) && id > 0;
  },

  // Message validation
  isValidMessage: (message: string): boolean => {
    const trimmed = message.trim();
    return trimmed.length > 0 && trimmed.length <= 4096; // Telegram message limit
  },

  // Boost amount validation
  isValidBoostAmount: (amount: string | number): boolean => {
    const num = typeof amount === 'string' ? parseInt(amount) : amount;
    return !isNaN(num) && num >= 1 && num <= 100;
  },

  // Phone number validation (basic)
  isValidPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.trim());
  },

  // URL validation
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Validate login form
  validateLoginForm: (data: { 
    email: string; 
    username: string; 
    password: string; 
    twofa: string; 
  }) => {
    const errors: string[] = [];

    // Email validation
    if (!data.email.trim()) {
      errors.push('Email is required');
    } else if (!ValidationUtils.isValidEmail(data.email)) {
      errors.push('Please enter a valid email address');
    }

    // Username validation
    if (!data.username.trim()) {
      errors.push('Username is required');
    } else if (!ValidationUtils.isValidUsername(data.username)) {
      errors.push('Username must be 3-10 characters and contain only letters, numbers, and underscores');
    }

    // Password validation
    if (!data.password.trim()) {
      errors.push('Password is required');
    } else if (!ValidationUtils.isValidPassword(data.password)) {
      errors.push('Password must be at least 6 characters long');
    }

    // 2FA validation
    if (!data.twofa.trim()) {
      errors.push('2FA code is required');
    } else if (!ValidationUtils.isValid2FA(data.twofa)) {
      errors.push('2FA code must be exactly 6 digits');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Validate message form
  validateMessageForm: (data: {
    message: string;
    recipient?: string;
  }) => {
    const errors: string[] = [];

    if (!data.message.trim()) {
      errors.push('Message is required');
    } else if (!ValidationUtils.isValidMessage(data.message)) {
      errors.push('Message must be between 1 and 4096 characters');
    }

    if (data.recipient && !ValidationUtils.isValidChatId(data.recipient)) {
      errors.push('Invalid recipient ID');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Validate boost form
  validateBoostForm: (data: {
    amount: string | number;
    recipient: string | number;
  }) => {
    const errors: string[] = [];

    if (!ValidationUtils.isValidBoostAmount(data.amount)) {
      errors.push('Boost amount must be between 1 and 100');
    }

    if (!ValidationUtils.isValidChatId(data.recipient)) {
      errors.push('Invalid recipient ID');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Sanitize input
  sanitizeInput: (input: string): string => {
    return input.trim().replace(/[<>\"']/g, '');
  },

  // Clean and validate search query
  validateSearchQuery: (query: string): { isValid: boolean; cleanQuery: string; errors: string[] } => {
    const errors: string[] = [];
    const cleanQuery = query.trim();

    if (cleanQuery.length === 0) {
      errors.push('Search query cannot be empty');
    } else if (cleanQuery.length < 2) {
      errors.push('Search query must be at least 2 characters');
    } else if (cleanQuery.length > 100) {
      errors.push('Search query must be less than 100 characters');
    }

    return {
      isValid: errors.length === 0,
      cleanQuery,
      errors,
    };
  },

  // Validate pagination parameters
  validatePagination: (start: string | number, limit: string | number) => {
    const errors: string[] = [];
    
    const startNum = typeof start === 'string' ? parseInt(start) : start;
    const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;

    if (isNaN(startNum) || startNum < 0) {
      errors.push('Start parameter must be a non-negative number');
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      errors.push('Limit parameter must be between 1 and 100');
    }

    return {
      isValid: errors.length === 0,
      start: startNum,
      limit: limitNum,
      errors,
    };
  },

  // File validation (for future file upload features)
  validateFile: (file: File, maxSize: number = 5 * 1024 * 1024, allowedTypes: string[] = []) => {
    const errors: string[] = [];

    if (file.size > maxSize) {
      errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};