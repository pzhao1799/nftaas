const Moralis = require('moralis').default

const config = {
    domain: process.env.APP_DOMAIN,
    statement: 'Please sign this message to confirm your identity.',
    uri: process.env.NEXTAUTH_URL,
    timeout: 60,
};

async function requestMessage(address, chain, network) {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

    try {
        return await Moralis.Auth.requestMessage({
            address,
            chain,
            network,
            ...config,
        });
    } catch (error) {
        throw error;
    }
}

module.exports = { requestMessage }
