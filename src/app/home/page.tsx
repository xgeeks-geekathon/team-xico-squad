
import { Main } from "@/components/main";

async function handleClick() {
    const resp = await fetch("/api/auth/signin");
    console.log(resp);
}


export default async function Page() {
    return (
        <main className="flex flex-col items-center min-h-screen gap-8">
            <Main />
        </main>
    );
}
