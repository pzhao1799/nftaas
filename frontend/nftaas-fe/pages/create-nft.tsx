import type { NextPage } from 'next'
import {useState} from 'react';
import Image from 'next/image'
import ImageUploading from 'react-images-uploading';
import { Button, TextInput } from '@thumbtack/thumbprint-react';
import {ImageType} from "react-images-uploading/dist/typings";
import {NFTStorage, CIDString} from 'nft.storage'
import axiosClient from '../utils/axios-client';

const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBmMzk1ZDRBN0NkQjU3ZTE2MjI4QzU0RUY0MkIwMjA4Mjc4MzA5N2UiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NjIyOTU3NDM5MCwibmFtZSI6Ik5GVGFhcyJ9.YQbmpvwiZr0UOWwGoBP6vkMRVjVllr0PUwXihyJneAs"
const MAX_UPLOAD_ALLOWED = 99

const ImageUploadPage: NextPage = () => {
    const [images, setImages] = useState<ImageType[]>([]);
    const [isMakingNetworkCall, setIsMakingNetworkCall] = useState<boolean>(false);
    const [contractName, setContractName] = useState<string | undefined>(undefined);
    const [symbol, setSymbol] = useState<string | undefined>(undefined);

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
                    (img: ImageType): void => {
                        if (!!img.file) {
                            nftStorageClient.storeBlob(img.file)
                                .then((cid: CIDString) => {
                                    console.log("Minting NFT ", cid);
                                    mintNFT(cid, address);
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
                console.log("NFT collection minted");
                reset();
            });
    };

    const mintNFT = async (cid: string, address: string) => {
        const mintData = {
            contractName: contractName,
            contractAddress: address,
            metadataURL: `ipfs://${cid}`,
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
    }

    return (
        <div className="w-100 h6 pa3 black">
            <div className="w-100 flex justify-center">
                <div className="pa5 white">
                    Create your NFT collection
                </div>
            </div>

            <TextInput
                hasError={!contractName}
                value={contractName}
                placeholder="contract-name"
                onChange={setContractName}
            />
            <TextInput
                hasError={!symbol}
                value={symbol}
                placeholder="contract-symbol"
                onChange={setSymbol}
            />

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
                            <button
                                className="mr1"
                                style={isDragging ? { color: 'red' } : undefined}
                                onClick={onImageUpload}
                                {...dragProps}
                            >
                                Click or Drop here
                            </button>
                            {
                                imageList.length > 1 && (
                                    <button onClick={onImageRemoveAll}>
                                        Remove all images
                                    </button>
                                )
                            }
                            {imageList.map((image, index) => (
                                <div key={index} className="image-item mt2">
                                    <Image src={image['data_url']} alt='' height={120} width={120}/>
                                    <div className="image-item__btn-wrapper">
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
                            ))}
                        </div>
                    )}
                </ImageUploading>
            </div>

            {
                images.length > 0 && (<div className="w-100 flex justify-center mt5">
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

export default ImageUploadPage
