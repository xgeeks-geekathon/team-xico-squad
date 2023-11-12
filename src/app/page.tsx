import { Main } from "@/components/main";
import { Providers } from "@/components/provider";

export default async function Page() {
  return (
    <Providers>
      <main className="flex flex-col items-center min-h-screen gap-8">
        <Main />
      </main>
    </Providers>
  );
}
