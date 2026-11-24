import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { useLoginPage } from "./useLoginPage";

const LoginPage = () => {
  const { register, errors, onSubmit, isPending } = useLoginPage();

  return (
    <section className="mx-auto flex max-w-sm flex-col gap-6">
      <h1 className="text-3xl font-medium">Вход</h1>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
        <Input
          label="Пароль"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />
        <Button type="submit" isLoading={isPending}>
          Войти
        </Button>
      </form>
    </section>
  );
};

export default LoginPage;
