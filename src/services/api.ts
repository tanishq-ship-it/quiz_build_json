const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

const TOKEN_KEY = 'quiz_builder_token';

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('quiz_builder_user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  return response.json() as Promise<T>;
};

// Auth types
export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

// User types
export type UserDto = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserPayload = {
  email: string;
  password: string;
  name: string;
};

export type UpdateUserPayload = {
  email?: string;
  password?: string;
  name?: string;
  isActive?: boolean;
};

// Quiz types
export interface CreateQuizPayload {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any;
}

export interface QuizDto {
  id: string;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  live: boolean;
  deletion: boolean;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AppendScreensPayload { screens: any[] }
export interface ReplaceScreensPayload { screens: any[] }
export interface UpdateQuizLivePayload { live: boolean }
export interface UpdateQuizDeletionPayload { deletion: boolean }

export interface ScreenResponseItem {
  screenId: string;
  index: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any;
  timeTakenMs: number;
  enteredAt: string;
  exitedAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface QuizResponseDto { id: string; quizId: string; content: any; createdAt: string }

// Auth API
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Login failed' }));
    throw new Error(data.error || 'Login failed');
  }

  return response.json() as Promise<LoginResponse>;
};

// User API
export const getUsers = async (): Promise<UserDto[]> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<UserDto[]>(response);
};

export const getUser = async (id: string): Promise<UserDto> => {
  const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(id)}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<UserDto>(response);
};

export const createUser = async (payload: CreateUserPayload): Promise<UserDto> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<UserDto>(response);
};

export const updateUser = async (id: string, payload: UpdateUserPayload): Promise<UserDto> => {
  const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<UserDto>(response);
};

export const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('quiz_builder_user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to delete user');
  }
};

// Quiz API
export const createQuiz = async (payload: CreateQuizPayload): Promise<QuizDto> => {
  const response = await fetch(`${API_BASE_URL}/quizzes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<QuizDto>(response);
};

export const getQuiz = async (id: string): Promise<QuizDto> => {
  const response = await fetch(`${API_BASE_URL}/quizzes/${encodeURIComponent(id)}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<QuizDto>(response);
};

// Public endpoint - no auth required (for customers)
export const getPublicQuiz = async (id: string): Promise<QuizDto> => {
  const response = await fetch(`${API_BASE_URL}/public/quizzes/${encodeURIComponent(id)}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to load quiz');
  }

  return response.json() as Promise<QuizDto>;
};

export const getQuizzes = async (): Promise<QuizDto[]> => {
  const response = await fetch(`${API_BASE_URL}/quizzes`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<QuizDto[]>(response);
};

export const appendQuizScreens = async (id: string, payload: AppendScreensPayload): Promise<QuizDto> => {
  const response = await fetch(`${API_BASE_URL}/quizzes/${encodeURIComponent(id)}/screens`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<QuizDto>(response);
};

export const replaceQuizScreens = async (id: string, payload: ReplaceScreensPayload): Promise<QuizDto> => {
  const response = await fetch(`${API_BASE_URL}/quizzes/${encodeURIComponent(id)}/screens`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<QuizDto>(response);
};

export const updateQuizLive = async (id: string, payload: UpdateQuizLivePayload): Promise<QuizDto> => {
  const response = await fetch(`${API_BASE_URL}/quizzes/${encodeURIComponent(id)}/live`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<QuizDto>(response);
};

export const updateQuizDeletion = async (id: string, payload: UpdateQuizDeletionPayload): Promise<QuizDto> => {
  const response = await fetch(`${API_BASE_URL}/quizzes/${encodeURIComponent(id)}/deletion`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<QuizDto>(response);
};

export const deleteQuizScreen = async (id: string, screenId: string, index?: number): Promise<QuizDto> => {
  let url = `${API_BASE_URL}/quizzes/${encodeURIComponent(id)}/screens/${encodeURIComponent(screenId)}`;
  if (index !== undefined) {
    url += `?index=${index}`;
  }

  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<QuizDto>(response);
};

// Quiz Response API (protected - for admin)
export const createQuizResponse = async (quizId: string): Promise<QuizResponseDto> => {
  const response = await fetch(`${API_BASE_URL}/quiz-responses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ quizId }),
  });
  return handleResponse<QuizResponseDto>(response);
};

export const appendQuizScreenResponse = async (id: string, screen: ScreenResponseItem): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/quiz-responses/${encodeURIComponent(id)}/screens`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ screen }),
  });

  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('quiz_builder_user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to append screen response');
  }
};

// Device detection utility
export const detectDeviceType = (): 'iphone' | 'android' | 'desktop' => {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'iphone';
  if (/android/.test(ua)) return 'android';
  return 'desktop';
};

// Geo location from user's real IP (browser fetches from real public IP)
let geoCache: { country?: string; city?: string } | null = null;

const fetchGeo = async (): Promise<{ country?: string; city?: string }> => {
  if (geoCache) return geoCache;
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    geoCache = { country: data.country_code, city: data.city };
    return geoCache;
  } catch {
    return {};
  }
};

// Public Quiz Response API (for customers - no auth)
export const createPublicQuizResponse = async (
  quizId: string,
  deviceType?: 'iphone' | 'android' | 'desktop'
): Promise<QuizResponseDto> => {
  const geo = await fetchGeo();
  const response = await fetch(`${API_BASE_URL}/public/quiz-responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quizId, deviceType: deviceType ?? detectDeviceType(), country: geo.country, city: geo.city }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to create quiz response');
  }

  return response.json() as Promise<QuizResponseDto>;
};

export const appendPublicQuizScreenResponse = async (id: string, screen: ScreenResponseItem): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/public/quiz-responses/${encodeURIComponent(id)}/screens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ screen }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to append screen response');
  }
};

// ========== PREVIEW RESPONSE API (Protected - admin preview, isLive=false) ==========

export const createPreviewResponse = async (quizId: string): Promise<QuizResponseDto> => {
  const response = await fetch(`${API_BASE_URL}/quiz-responses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ quizId, deviceType: detectDeviceType() }),
  });
  return handleResponse<QuizResponseDto>(response);
};

export const appendPreviewScreenResponse = async (id: string, screen: ScreenResponseItem): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/quiz-responses/${encodeURIComponent(id)}/screens`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ screen }),
  });

  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('quiz_builder_user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to append preview screen response');
  }
};

// ========== PAYMENT LEAD API (Public) ==========

export type PlanType = '1_month' | '1_year';

export interface PaymentLeadDto {
  id: string;
  email1: string;
  email2: string | null;
  quizId: string | null;
  quizResponseId: string | null;
  planType: PlanType | null;
  paid: boolean;
  clerkUserId: string | null;
  subscriptionStatus: string | null;
  subscriptionExpiresAt: string | null;
  deviceType: string | null;
  country: string | null;
  city: string | null;
  createdAt: string;
}

export interface CreateLeadPayload {
  email1: string;
  quizId?: string;
  quizResponseId?: string;
}

export interface CreateLeadResponse {
  id: string;
  email1: string;
  quizId: string | null;
  clerkUserId: string | null; // This is used as RevenueCat app_user_id
  signInToken: string | null; // Token for web-to-app auto-login
}

export type DeviceType = 'ios' | 'android' | 'desktop';

export interface UpdateLeadPayload {
  email2: string;
  planType?: PlanType | null;
  paid: boolean;
  revenuecatUserId?: string | null;
  deviceType?: DeviceType | null;
}

export interface UpdateLeadResponse {
  id: string;
  email1: string;
  email2: string;
  planType: PlanType | null;
  paid: boolean;
}

export interface SubscriptionStatus {
  isPremium: boolean;
  status: string | null;
  expiresAt: string | null;
}

// Create lead (Email Page 1 - before payment)
export const createPaymentLead = async (payload: CreateLeadPayload): Promise<CreateLeadResponse> => {
  const geo = await fetchGeo();
  const response = await fetch(`${API_BASE_URL}/public/payments/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...payload, country: geo.country, city: geo.city }),
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create lead');
    } catch (parseError) {
      if (parseError instanceof Error && parseError.message !== 'Failed to create lead') {
        throw parseError;
      }
      throw new Error('Failed to create lead');
    }
  }

  return response.json() as Promise<CreateLeadResponse>;
};

// Update lead (Email Page 2 - after payment/skip)
export const updatePaymentLead = async (leadId: string, payload: UpdateLeadPayload): Promise<UpdateLeadResponse> => {
  const response = await fetch(`${API_BASE_URL}/public/payments/leads/${encodeURIComponent(leadId)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to update lead');
  }

  return response.json() as Promise<UpdateLeadResponse>;
};

// Get lead by ID
export const getPaymentLead = async (leadId: string): Promise<PaymentLeadDto> => {
  const response = await fetch(`${API_BASE_URL}/public/payments/leads/${encodeURIComponent(leadId)}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to get lead');
  }

  return response.json() as Promise<PaymentLeadDto>;
};

// Check subscription status
export const checkSubscriptionStatus = async (leadId: string): Promise<SubscriptionStatus> => {
  const response = await fetch(`${API_BASE_URL}/public/payments/leads/${encodeURIComponent(leadId)}/subscription`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to check subscription');
  }

  return response.json() as Promise<SubscriptionStatus>;
};

// ========== PAYMENT LEAD API (Admin - Protected) ==========

// Get all leads (admin)
export const getAllPaymentLeads = async (): Promise<PaymentLeadDto[]> => {
  const response = await fetch(`${API_BASE_URL}/payments/leads`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<PaymentLeadDto[]>(response);
};

// Get leads by quiz (admin)
export const getPaymentLeadsByQuiz = async (quizId: string): Promise<PaymentLeadDto[]> => {
  const response = await fetch(`${API_BASE_URL}/payments/leads/quiz/${encodeURIComponent(quizId)}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<PaymentLeadDto[]>(response);
};

// ========== WEB QUIZ API ==========

export interface WebQuizDto {
  id: string;
  quizId: string;
  isActive: boolean;
  setBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebQuizWithQuizDto extends WebQuizDto {
  quiz: {
    id: string;
    title: string;
    content: any;
    live: boolean;
  } | null;
}

// Get current active web quiz (admin - protected)
export const getWebQuiz = async (): Promise<WebQuizDto | null> => {
  const response = await fetch(`${API_BASE_URL}/web-quiz`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<WebQuizDto | null>(response);
};

// Set a quiz as the website quiz (admin - protected)
export const setWebQuiz = async (quizId: string): Promise<WebQuizDto> => {
  const response = await fetch(`${API_BASE_URL}/web-quiz`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ quizId }),
  });
  return handleResponse<WebQuizDto>(response);
};

// Unset a quiz as website quiz (admin - protected)
export const unsetWebQuiz = async (quizId: string): Promise<WebQuizDto> => {
  const response = await fetch(`${API_BASE_URL}/web-quiz/${encodeURIComponent(quizId)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<WebQuizDto>(response);
};

// Get current active web quiz with quiz details (public - no auth)
export const getPublicWebQuiz = async (): Promise<WebQuizWithQuizDto | null> => {
  const response = await fetch(`${API_BASE_URL}/public/web-quiz`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to get web quiz');
  }

  return response.json() as Promise<WebQuizWithQuizDto | null>;
};

// ========== ANALYTICS API (Admin - Protected) ==========

import type {
  QuizListItemDto as AnalyticsQuizListItemDto,
  QuizAnalyticsDto,
  DeviceType as AnalyticsDeviceType,
  DateRangePreset,
} from '../types/analytics';

// Re-export types for convenience
export type { AnalyticsQuizListItemDto, QuizAnalyticsDto, AnalyticsDeviceType };

// Get quizzes with response counts for analytics
export const getAnalyticsQuizzes = async (): Promise<AnalyticsQuizListItemDto[]> => {
  const response = await fetch(`${API_BASE_URL}/analytics/quizzes`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<AnalyticsQuizListItemDto[]>(response);
};

// Get full analytics for a specific quiz
export const getQuizAnalytics = async (
  quizId: string,
  options?: {
    deviceFilter?: AnalyticsDeviceType[];
    dateRange?: DateRangePreset;
    startDate?: string;
    endDate?: string;
  }
): Promise<QuizAnalyticsDto> => {
  const params = new URLSearchParams();

  if (options?.deviceFilter && options.deviceFilter.length > 0) {
    params.set('devices', options.deviceFilter.join(','));
  }

  if (options?.dateRange && options.dateRange !== 'custom') {
    params.set('range', options.dateRange);
  } else if (options?.startDate || options?.endDate) {
    if (options.startDate) params.set('startDate', options.startDate);
    if (options.endDate) params.set('endDate', options.endDate);
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/analytics/quizzes/${encodeURIComponent(quizId)}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });
  return handleResponse<QuizAnalyticsDto>(response);
};

// ========== BLOG API ==========

export interface BlogDto {
  id: string;
  title: string;
  slug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  published: boolean;
  deletion: boolean;
  readTime: string | null;
  excerpt: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buttonClicks: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  countryViews: any;
  createdAt: string;
  updatedAt: string;
}

export interface BlogListItemDto {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  readTime: string | null;
  excerpt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPayload {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any;
  readTime?: string;
  excerpt?: string;
}

export interface UpdateBlogPayload {
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any;
  readTime?: string;
  excerpt?: string;
}

// ── Admin (protected) ──

export const createBlog = async (payload: CreateBlogPayload): Promise<BlogDto> => {
  const response = await fetch(`${API_BASE_URL}/blogs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<BlogDto>(response);
};

export const getBlogs = async (): Promise<BlogDto[]> => {
  const response = await fetch(`${API_BASE_URL}/blogs`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<BlogDto[]>(response);
};

export const getBlog = async (id: string): Promise<BlogDto> => {
  const response = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(id)}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<BlogDto>(response);
};

export const updateBlog = async (id: string, payload: UpdateBlogPayload): Promise<BlogDto> => {
  const response = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<BlogDto>(response);
};

export const updateBlogPublished = async (id: string, published: boolean): Promise<BlogDto> => {
  const response = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(id)}/published`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ published }),
  });
  return handleResponse<BlogDto>(response);
};

export const deleteBlogApi = async (id: string): Promise<BlogDto> => {
  const response = await fetch(`${API_BASE_URL}/blogs/${encodeURIComponent(id)}/deletion`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ deletion: true }),
  });
  return handleResponse<BlogDto>(response);
};

// ── Public (no auth) ──

export const getPublishedBlogs = async (): Promise<BlogListItemDto[]> => {
  const response = await fetch(`${API_BASE_URL}/public/blogs`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to load blogs');
  }
  return response.json() as Promise<BlogListItemDto[]>;
};

export const getPublishedBlogBySlug = async (slug: string): Promise<BlogDto> => {
  const response = await fetch(`${API_BASE_URL}/public/blogs/${encodeURIComponent(slug)}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to load blog');
  }
  return response.json() as Promise<BlogDto>;
};

// Track a button click on a blog post (public, fire-and-forget)
export const trackBlogButtonClick = async (slug: string, url: string): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/public/blogs/${encodeURIComponent(slug)}/track-click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
  } catch {
    // Fire-and-forget: ignore errors
  }
};

// Track a country view on a blog post (public, fire-and-forget)
export const trackBlogCountryView = async (slug: string): Promise<void> => {
  try {
    const geo = await fetchGeo();
    await fetch(`${API_BASE_URL}/public/blogs/${encodeURIComponent(slug)}/track-view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: geo.country }),
    });
  } catch {
    // Fire-and-forget: ignore errors
  }
};
