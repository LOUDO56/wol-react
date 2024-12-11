const ENV = 'development';

export const DEFAULT_API_LINK = ENV === 'development'
  ? 'http://localhost:3000' 
  : '';
