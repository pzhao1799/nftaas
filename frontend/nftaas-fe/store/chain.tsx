import { useCallback } from 'react';
import config from 'utils/config';
import { getMetamask } from 'utils/metamask';
import { useAccount } from 'store/account';

/**
 * Add a network in metamask.
 */
export function useAddNetwork() {
  return useCallback(async () => {
    const network = useAccount.getState().network;
    const chainId =
      network === 'mainnet' ? config.MAINNET_CHAIN_ID : config.TESTNET_CHAIN_ID;

    const mainnet = {
      chainName: 'Polygon Mainnet',
      rpcUrls: ['https://polygon-rpc.com?owner=137'],
      blockExplorerUrls: ['https://polygonscan.com'],
    };

    const testnet = {
      chainName: 'Polygon Testnet',
      rpcUrls: ['https://rpc-mumbai.maticvigil.com/?owner=80001'],
      blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    };

    const metamask = await getMetamask();
    await metamask.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x' + chainId.toString(16),
          nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18,
          },
          ...(network === 'mainnet' ? mainnet : testnet),
        },
      ],
    });
  }, []);
}

/**
 * Switch the network in metamask.
 */
export function useSwitchNetwork() {
  return useCallback(async () => {
    const network = useAccount.getState().network;

    const chainId =
      network === 'mainnet' ? config.MAINNET_CHAIN_ID : config.TESTNET_CHAIN_ID;

    const metamask = await getMetamask();
    await metamask.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x' + chainId.toString(16) }],
    });
  }, []);
}
