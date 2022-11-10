import type { NextPage } from 'next'
import {useState} from 'react';
import Image from 'next/image'
import ImageUploading from 'react-images-uploading';
import { Button, Text, TextInput, Label } from '@thumbtack/thumbprint-react';
import {ImageType} from "react-images-uploading/dist/typings";
import {NFTStorage, CIDString} from 'nft.storage'
import axiosClient from '../utils/axios-client';

const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBmMzk1ZDRBN0NkQjU3ZTE2MjI4QzU0RUY0MkIwMjA4Mjc4MzA5N2UiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NjIyOTU3NDM5MCwibmFtZSI6Ik5GVGFhcyJ9.YQbmpvwiZr0UOWwGoBP6vkMRVjVllr0PUwXihyJneAs"
const MAX_UPLOAD_ALLOWED = 99

const GiftCardPage: NextPage = () => {
    const [images, setImages] = useState<ImageType[]>([]);
    const [addresses, setAddresses] = useState<Map<number, string>>(new Map<number, string>());
    const [isMakingNetworkCall, setIsMakingNetworkCall] = useState<boolean>(false);
    const [contractName, setContractName] = useState<string | undefined>(undefined);
    const [symbol, setSymbol] = useState<string | undefined>(undefined);
    const [amount, setAmount] = useState<string | undefined>(undefined);
    const [recipientAddress, setRecipientAddress] = useState<string | undefined>(undefined);

    const nftStorageClient = new NFTStorage({ token: NFT_STORAGE_KEY });

    const onChange = (imageList: ImageType[]) => {
        setImages(imageList);
    };

    const mintNFTs = async () => {
        if (images.length === 0) {
            alert("No images uploaded");
            return;
        }

        setIsMakingNetworkCall(true);

        await deployContract()
            .then((resp) => {
                const address = resp.data;
                console.log("Contract deployed to: ", address);
                images.forEach(
                    (img: ImageType, index): void => {
                        if (!!img.file) {
                            nftStorageClient.storeBlob(img.file)
                                .then((cid: CIDString) => {
                                    const receiverAddress = addresses.get(index)
                                    if (!!receiverAddress) {
                                        console.log("Airdropping NFT ", cid);
                                        airdropNFT(cid, address, receiverAddress);
                                    } else {
                                        console.log("Minting NFT ", cid);
                                        mintNFT(cid, address);
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                    }
                );
            }).catch((e) => {
                alert(e);
            }).finally((): void => {
                reset();
            });
    };

    const mintNFT = async (cid: string, address: string) => {
        const mintData = {
            contractName: contractName,
            contractAddress: address,
            metadataURL: `ipfs://${cid}`,
            valueAmount: amount,
            receiverAddresses: recipientAddress
        };
        await axiosClient.post('/safemint', mintData, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).catch(
            (e) => {
                alert(e.message);
            }
        );
    };

    const airdropNFT = async (cid: string, address: string, receiverAddress: string) => {
        const airdropData = {
            contractName: contractName,
            contractAddress: address,
            metadataURL: `ipfs://${cid}`,
            receiverAddresses: [receiverAddress],
        };
        await axiosClient.post('/airdrop', airdropData, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).catch(
            (e) => {
                alert(e.message);
            }
        );
    };

    const deployContract = async (): Promise<any> => {
        if (!contractName) {
            alert("Contract name is required");
            throw new Error("Contract name is required");
        }
        if (!symbol) {
            alert("Symbol is required");
            throw new Error("Symbol is required");
        }
        const deployData = { name: contractName, symbol: symbol };
        return await axiosClient.post('/deploygiftcard', deployData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const reset = () => {
        setIsMakingNetworkCall(false);
        setImages([]);
        setContractName(undefined);
        setSymbol(undefined);
        setAddresses(new Map<number, string>);
    }

    return (
        <div className="w-100 h6 pa3 black pb5">
            <div className="w-100 flex justify-center">
                <div className="w6">
                    <Text className="white">Contract Name</Text>
                    <TextInput
                        hasError={!contractName}
                        value={contractName}
                        placeholder="contract-name"
                        onChange={setContractName}
                    />
                    {
                        !contractName && (
                            <Text className="red">Contract name is required.</Text>
                        )
                    }
                </div>
            </div>

            <div className="w-100 flex justify-center">
                <div className="w6 mt3">
                    <Text className="white">Contract Symbol</Text>
                    <TextInput
                        hasError={!symbol}
                        value={symbol}
                        placeholder="contract-symbol"
                        onChange={setSymbol}
                    />
                    {
                        !symbol && (
                            <Text className="red">Contract symbol is required.</Text>
                        )
                    }
                </div>
            </div>

            <div className="w-100 flex justify-center">
                <div className="w6 mt3">
                    <Text className="white">Amount</Text>
                    <TextInput
                        hasError={!amount}
                        value={amount}
                        placeholder="gift size"
                        onChange={setAmount}
                    />
                    {
                        !symbol && (
                            <Text className="red">How much to gift is required and has to be greater than 0.1 Matic.</Text>
                        )
                    }
                </div>
            </div>

            <div className="w-100 flex justify-center">
                <div className="w6 mt3">
                    <Text className="white">Recipient Address</Text>
                    <TextInput
                        hasError={!recipientAddress}
                        value={recipientAddress}
                        placeholder="recipient address"
                        onChange={setRecipientAddress}
                    />
                    {
                        !symbol && (
                            <Text className="red">The address that will recieve the gift card.</Text>
                        )
                    }
                </div>
            </div>

            <div className="w-100 flex justify-center mt5">
                <ImageUploading
                    multiple
                    value={images}
                    onChange={onChange}
                    maxNumber={MAX_UPLOAD_ALLOWED}
                    dataURLKey="data_url"
                >
                    {({
                          imageList,
                          onImageUpload,
                          onImageRemoveAll,
                          onImageUpdate,
                          onImageRemove,
                          isDragging,
                          dragProps,
                      }) => (
                        // write your building UI
                        <div className="upload__image-wrapper">
                            <div className="flex">
                                <button
                                    className="mr1"
                                    style={isDragging ? { color: 'red' } : undefined}
                                    onClick={onImageUpload}
                                    {...dragProps}
                                >
                                    Click or Drop images here
                                </button>
                                {
                                    imageList.length > 1 && (
                                        <div>
                                            <button onClick={onImageRemoveAll}>
                                                Remove all images
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                            {
                                imageList.length > 1 && (
                                    <div>
                                        <Text className="white">
                                            Send each NFT to a separate address or create them in our wallet if unspecified
                                        </Text>
                                    </div>
                                )
                            }
                            {imageList.map((image, index) => (
                                <div key={index} className="image-item mt2 flex">
                                    <div>
                                        <Image src={image['data_url']} alt='' height={120} width={120}/>
                                        <div className="image-item__btn-wrapper flex">
                                            <button
                                                className="mr1"
                                                onClick={() => onImageUpdate(index)}
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => onImageRemove(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="ml2">
                                        <TextInput
                                            value={addresses.get(index) ?? undefined}
                                            placeholder="0xABCD1234"
                                            onChange={(value) => {
                                                let newAddresses = new Map(addresses)
                                                newAddresses.set(index, value)
                                                setAddresses(newAddresses)
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ImageUploading>
            </div>

            {
                images.length > 0 && !!contractName && symbol &&
                    (<div className="w-100 flex justify-center mt5">
                        <Button
                            theme="tertiary"
                            onClick={mintNFTs}
                            isDisabled={isMakingNetworkCall}
                        >
                            Create your NFT collection!
                        </Button>
                    </div>)
            }
        </div>
    )
}

export default GiftCardPage;