export type FormActionState = {
  success: boolean;
  message?: string;
  errors?: {
    general?: string[];
    email?: string[];
    password?: string[];
  };
};
