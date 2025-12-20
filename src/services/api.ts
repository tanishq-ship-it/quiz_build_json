const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

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
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AppendScreensPayload { screens: any[] }
export interface ReplaceScreensPayload { screens: any[] }
export interface UpdateQuizLivePayload { live: boolean }

export const createQuiz = async (payload: CreateQuizPayload): Promise<QuizDto> => {
  const response = await fetch(`${API_BASE_URL}/quizzes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to create quiz");
  }

  return response.json() as Promise<QuizDto>;
};

export const getQuiz = async (id: string): Promise<QuizDto> => {
  const response = await fetch(`${API_BASE_URL}/quizzes/${encodeURIComponent(id)}`);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to load quiz");
  }

  return response.json() as Promise<QuizDto>;
};

export const getQuizzes = async (): Promise<QuizDto[]> => {
  const response = await fetch(`${API_BASE_URL}/quizzes`);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to load quizzes");
  }

  return response.json() as Promise<QuizDto[]>;
};

export const appendQuizScreens = async (id: string, payload: AppendScreensPayload): Promise<QuizDto> => {
  const response = await fetch(`${API_BASE_URL}/quizzes/${encodeURIComponent(id)}/screens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to add screens");
  }

  return response.json() as Promise<QuizDto>;
};

export const replaceQuizScreens = async (id: string, payload: ReplaceScreensPayload): Promise<QuizDto> => {
  const response = await fetch(`${API_BASE_URL}/quizzes/${encodeURIComponent(id)}/screens`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to update screens");
  }

  return response.json() as Promise<QuizDto>;
};

export const updateQuizLive = async (id: string, payload: UpdateQuizLivePayload): Promise<QuizDto> => {
  const response = await fetch(`${API_BASE_URL}/quizzes/${encodeURIComponent(id)}/live`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to update live status");
  }

  return response.json() as Promise<QuizDto>;
};



