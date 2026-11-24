import { useAuthStore } from "@/store/auth.store";

const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <section className="flex flex-col gap-2">
      <h1 className="text-3xl font-medium">Профиль</h1>
      <p className="text-[var(--color-muted)]">{user?.email}</p>
    </section>
  );
};

export default ProfilePage;
