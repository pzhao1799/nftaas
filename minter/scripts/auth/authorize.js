const Moralis = require('moralis').default

async function authorize(credentials) {
    try {
        // "message" and "signature" are needed for authorization
        // we described them in "credentials" above
        const { message, signature } = credentials;

        await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

        const { address, profileId } = (
            await Moralis.Auth.verify({ message, signature, network: 'evm' })
        ).raw;

        return { address, profileId, signature };
    } catch (e) {
        throw e;
    }
}

module.exports = { authorize }
