export const API_BASE_URL = 'http://localhost:5000/api';

export const USER_TYPES = {
  SIMPLE_USER: 'simple_user',
  HOSTEL_OWNER: 'hostel_owner'
};

export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 6
  }
};