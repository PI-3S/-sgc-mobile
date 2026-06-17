export type UserRole = 'aluno' | 'coordenador' | 'super_admin';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  curso_id?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Submissao {
  id: string;
  aluno_id: string;
  titulo: string;
  descricao: string;
  horas: number;
  status: 'pendente' | 'aprovado' | 'reprovado';
  arquivo_url?: string;
  created_at: string;
}
