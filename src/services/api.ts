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



