import {NextPage} from "next";
import { useSession, signOut } from 'next-auth/react';

const UserPage: NextPage = () => {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.assign('/');
        }
    })

    return (
        <div>
            <h4>User session:</h4>
            <pre>{JSON.stringify(session?.user, null, 2)}</pre>
            <button onClick={() => {
                signOut({redirect: false})
            }}>Sign out</button>
        </div>
    )
}

export default UserPage;