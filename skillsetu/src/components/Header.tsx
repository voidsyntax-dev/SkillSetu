import { getCurrentUser } from "@/lib/session";
import { signOut } from "@/lib/actions";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const user = await getCurrentUser();
  return (
    <HeaderClient
      account={
        user && !user.isGuest
          ? { kind: "user", name: user.name, email: user.email ?? "", streak: user.currentStreak }
          : { kind: "guest", streak: user?.currentStreak ?? 0 }
      }
      signOutAction={signOut}
    />
  );
}
