import type { NextPage } from 'next'
import {useState} from 'react';
import Image from 'next/image'
import ImageUploading from 'react-images-uploading';
import { Button, Text, TextInput, Checkbox } from '@thumbtack/thumbprint-react';
import {ImageType} from "react-images-uploading/dist/typings";
import {NFTStorage} from 'nft.storage'
import axiosClient from '../utils/axios-client';
import autoGenerateClient from '../utils/generate-art-client';
import loading from "../public/loading.gif";

const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBmMzk1ZDRBN0NkQjU3ZTE2MjI4QzU0RUY0MkIwMjA4Mjc4MzA5N2UiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NjIyOTU3NDM5MCwibmFtZSI6Ik5GVGFhcyJ9.YQbmpvwiZr0UOWwGoBP6vkMRVjVllr0PUwXihyJneAs"
const MAX_UPLOAD_ALLOWED = 99

const CreateNFTPage: NextPage = () => {
    const [isUploadMode, setIsUploadMode] = useState<boolean>(true);
    const [images, setImages] = useState<ImageType[]>([]);
    const [addresses, setAddresses] = useState<Map<number, string>>(new Map<number, string>());
    const [names, setNames] = useState<Map<number, string>>(new Map<number, string>());
    const [descriptions, setDescriptions] = useState<Map<number, string>>(new Map<number, string>());
    const [isMakingNetworkCall, setIsMakingNetworkCall] = useState<boolean>(false);

    const [contractName, setContractName] = useState<string | undefined>(undefined);
    const [symbol, setSymbol] = useState<string | undefined>(undefined);
    const [numNFT, setNumNFT] = useState<number>(1);

    const nftStorageClient = new NFTStorage({ token: NFT_STORAGE_KEY });

    const onChange = (imageList: ImageType[]) => {
        setImages(imageList);
    };

    const generateArt = async () => {
        return await autoGenerateClient.post(`/nfts/`, {}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };

    const autoGenNFTs = async (num: number) => {
        setIsMakingNetworkCall(true);

        await deployContract()
            .then((resp) => {
                const address = resp.data;
                console.log("Contract deployed to: ", address);
                for (let i = 0; i < numNFT; i++) {
                    generateArt()
                        .then(
                            (resp) => {
                                const cid = resp.data;
                                console.log("minting NFT for generated art: ", cid);
                                mintNFT(cid, address);
                            }
                        )
                        .catch((e) => {
                            alert(e.message)
                        });
                }
            }).catch((e) => {
                alert(e);
            }).finally((): void => {
                reset();
            });
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
                            nftStorageClient.store({
                                name: names.get(index) ?? "NFT",
                                description:  descriptions.get(index) ?? "This is a great NFT.",
                                image: img.file,
                            }).then((resp) => {
                                const receiverAddress = addresses.get(index)
                                const url = resp.url
                                if (!!receiverAddress) {
                                    console.log("Airdropping NFT ", url);
                                    airdropNFT(url, address, receiverAddress);
                                } else {
                                    console.log("Minting NFT ", url);
                                    mintNFT(url, address);
                                }
                            }).catch((err) => {
                                console.log(err);
                            });
                            // nftStorageClient.storeBlob(img.file)
                            //     .then((cid: CIDString) => {
                            //         const receiverAddress = addresses.get(index)
                            //         if (!!receiverAddress) {
                            //             console.log("Airdropping NFT ", cid);
                            //             airdropNFT(cid, address, receiverAddress);
                            //         } else {
                            //             console.log("Minting NFT ", cid);
                            //             mintNFT(cid, address);
                            //         }
                            //     })
                            //     .catch((err) => {
                            //         console.log(err);
                            //     });
                        }
                    }
                );
            }).catch((e) => {
                alert(e);
            }).finally((): void => {
                reset();
            });
    };

    const mintNFT = async (url: string, address: string) => {
        const mintData = {
            contractName: contractName,
            contractAddress: address,
            metadataURL: url,
        };
        await axiosClient.post('/mint', mintData, {
            headers: {
                'Content-Type': 'application/json',
            },
        }).catch(
            (e) => {
                alert(e.message);
            }
        );
    };

    const airdropNFT = async (url: string, address: string, receiverAddress: string) => {
        const airdropData = {
            contractName: contractName,
            contractAddress: address,
            metadataURL: url,
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
        return await axiosClient.post('/deploy', deployData, {
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
            <div className="w-100 flex justify-center white">
                <div className="w6">
                    <div className="mb3">
                        <Checkbox isChecked={!isUploadMode} onChange={() => setIsUploadMode(!isUploadMode)}>
                            Use auto-generated images
                        </Checkbox>
                    </div>
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

            {
                isUploadMode && (
                    <div>
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
                                                <div className="ml2 w6">
                                                    <TextInput
                                                        value={addresses.get(index) ?? undefined}
                                                        placeholder="Address to send to"
                                                        onChange={(value) => {
                                                            let newAddresses = new Map(addresses)
                                                            newAddresses.set(index, value)
                                                            setAddresses(newAddresses)
                                                        }}
                                                    />
                                                    <TextInput
                                                        value={names.get(index) ?? undefined}
                                                        placeholder="Name"
                                                        onChange={(value) => {
                                                            let newNames = new Map(names)
                                                            newNames.set(index, value)
                                                            setNames(newNames)
                                                        }}
                                                    />
                                                    <TextInput
                                                        value={descriptions.get(index) ?? undefined}
                                                        placeholder="Description"
                                                        onChange={(value) => {
                                                            let newDescriptions = new Map(descriptions)
                                                            newDescriptions.set(index, value)
                                                            setDescriptions(newDescriptions)
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

            {
                !isUploadMode && (
                    <div className="mt3">
                        <div className="flex justify-center">
                            <div className="w6 white">
                                <Text>How many NFTs?</Text>
                                <TextInput
                                    value={numNFT}
                                    type='number'
                                    min={1}
                                    onChange={(value) => {
                                        setNumNFT(Number(value))
                                    }}
                                />
                            </div>
                        </div>
                        {
                            !!contractName && symbol &&
                            (<div className="w-100 flex justify-center mt5">
                                <Button
                                    theme="tertiary"
                                    onClick={() => autoGenNFTs(numNFT)}
                                    isDisabled={isMakingNetworkCall}
                                >
                                    Auto-generate your NFT collection!
                                </Button>
                            </div>)
                        }
                    </div>
                )
            }

            {
                isMakingNetworkCall && (
                    <div className="absolute top-0 w-100 vh-100 flex justify-center items-center">
                        <Image src={loading} alt={"loading gif"}/>
                    </div>
                )
            }
        </div>
    )
}

export default CreateNFTPage
