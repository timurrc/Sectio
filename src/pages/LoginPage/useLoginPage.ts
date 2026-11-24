import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { ApiError } from "@/api/axios.api";
import { ROUTES } from "@/constants/routes";
import { loginSchema } from "@/schemas/auth.schema";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import type { IAuthResponse, ILoginDto } from "@/types/auth.types";

export const useLoginPage = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? ROUTES.HOME;

  const form = useForm<ILoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending } = useMutation<IAuthResponse, ApiError, ILoginDto>({
    mutationFn: AuthService.login,
    onSuccess: ({ accessToken, user }) => {
      setAuth(accessToken, user);
      toast.success(`Добро пожаловать, ${user.name}`);
      navigate(from, { replace: true });
    },
    onError: (error) => {
      // Ошибки валидации с бэкенда → под соответствующие поля формы
      Object.entries(error.fieldErrors ?? {}).forEach(([field, messages]) => {
        form.setError(field as keyof ILoginDto, { message: messages[0] });
      });
      toast.error(error.message);
    },
  });

  return {
    register: form.register,
    errors: form.formState.errors,
    onSubmit: form.handleSubmit((values) => mutate(values)),
    isPending,
  };
};
