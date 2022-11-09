import Link from "next/link";
import SignIn from "./signin-button";

export default function GlobalHeader() {
    return (
        <div className="w-100 flex pa5 justify-between">
            <Link href="/">
                <a>Home</a>
            </Link>

            <Link href="/create-nft">
                <a>Create Your NFT Collection</a>
            </Link>

            <Link href="/gift-card">
                <a>Create Gift Card</a>
            </Link>

            <SignIn />
        </div>
    );
}