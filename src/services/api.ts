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

export const updateQuizDeletion = async (id: string, payload: UpdateQuizDeletionPayload): Promise<QuizDto> => {
  const response = await fetch(`${API_BASE_URL}/quizzes/${encodeURIComponent(id)}/deletion`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to update deletion status");
  }

  return response.json() as Promise<QuizDto>;
};

export const createQuizResponse = async (quizId: string): Promise<QuizResponseDto> => {
  const response = await fetch(`${API_BASE_URL}/quiz-responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quizId }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to create quiz response");
  }

  return response.json() as Promise<QuizResponseDto>;
};

export const appendQuizScreenResponse = async (id: string, screen: ScreenResponseItem): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/quiz-responses/${encodeURIComponent(id)}/screens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ screen }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to append screen response");
  }
};



