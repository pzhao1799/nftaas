import { getSession, signOut } from 'next-auth/react';

// gets a prop from getServerSideProps
function User({ user }: any) {
    return (
        <div>
            <h4>User session:</h4>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <button onClick={() => {
                signOut({redirect: true})
                    .then(() => {
                        window.location.assign('/signin');
                    })
            }}>Sign out</button>
        </div>
    );
}

export async function getServerSideProps(context: any) {
    const session = await getSession(context);

    // redirect if not authenticated
    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        };
    }

    return {
        props: { user: session.user },
    };
}

export default User;