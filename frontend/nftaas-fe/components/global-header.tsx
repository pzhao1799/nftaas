import Link from "next/link";
import SignIn from "./signin-button";

export default function GlobalHeader() {
    return (
        <div className="w-100 flex pa5 justify-between">
            <div>
                Home
            </div>

            <Link href="/image-upload">
                <a>Upload images</a>
            </Link>

            <Link href="/gift-card">
                <a>Create Gift Card</a>
            </Link>

            <SignIn />
        </div>
    );
}