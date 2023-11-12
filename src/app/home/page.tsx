
import { Main } from "@/components/main";
import { Providers } from "@/components/provider";
import "../globals.css";

export default async function Page() {
    return (
        <Providers>
            <main className="flex flex-col items-center min-h-screen gap-8">
                <Main />
            </main>
        </Providers>
    );
}
