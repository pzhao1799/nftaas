import type { NextPage } from 'next'
import {useState} from 'react';
import ImageUploading from 'react-images-uploading';
import { AlertBanner, Button, Modal, ModalContent, Text, TextButton } from '@thumbtack/thumbprint-react';
import {ImageType} from "react-images-uploading/dist/typings";
import {NFTStorage, CIDString} from 'nft.storage'
import { FaFileImage, FaTrashAlt, FaWindowClose } from "react-icons/fa";

const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBmMzk1ZDRBN0NkQjU3ZTE2MjI4QzU0RUY0MkIwMjA4Mjc4MzA5N2UiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2NjIyOTU3NDM5MCwibmFtZSI6Ik5GVGFhcyJ9.YQbmpvwiZr0UOWwGoBP6vkMRVjVllr0PUwXihyJneAs"
const MAX_UPLOAD_ALLOWED = 99

const ImageUploadPage: NextPage = () => {
    const [images, setImages] = useState<ImageType[]>([]);
    const [cids, setCids] = useState<string[]>([]);
    const [isMakingNetworkCall, setIsMakingNetworkCall] = useState<boolean>(false);
    const [selectedCidIndex, setSelectedCidIndex] = useState<number>(-1);

    const nftStorageClient = new NFTStorage({ token: NFT_STORAGE_KEY });

    const onChange = (imageList: ImageType[]) => {
        setImages(imageList);
    };

    const onUpload = () => {
        if (images.length === 0) {
            return;
        }

        let files: File[] = [];
        images.forEach(
            (img: ImageType): void => {
                if (!!img.file) {
                    files.push(img.file);
                }
            }
        );

        setIsMakingNetworkCall(true);

        nftStorageClient.storeDirectory(files)
            .then((resp:CIDString) => {
                if (cids.includes(resp)) {
                    alert("The same files were already uploaded.");
                } else {
                    let newCids = [...cids, resp];
                    setCids(newCids);
                }
                setImages([]);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally((): void => {
                setIsMakingNetworkCall(false);
            })
    };

    const onDelete = (cid: string) => {
        setIsMakingNetworkCall(true);

        nftStorageClient.delete(cid)
            .catch((err) => {
                console.log(err);
            })
            .finally((): void => {
                let newCids = [...cids];
                newCids.splice(selectedCidIndex, 1);
                setIsMakingNetworkCall(false);
                setCids(newCids);
                setSelectedCidIndex(-1);
            })
    };

    const onOpenIpfsFile = (cid: string) => {
        window.open(`https://${cid}.ipfs.nftstorage.link`);
        setSelectedCidIndex(-1);
    };

    const onCloseModal = () => {
        setSelectedCidIndex(-1);
    }

    return (
        <div className="w-100 h6 pa3 black">
            {
                cids.length > 0 && (
                    <div className="w-100">
                        <div className="tc white">
                            Your Content Identifiers
                        </div>
                        <div className="mv5 ba b-white tc">
                            {
                                cids.map((cid: string, index: number): JSX.Element => (
                                    <div key={cid} className="mv2">
                                        <TextButton
                                            onClick={() => {
                                                setSelectedCidIndex(index);
                                            }}
                                        >
                                            {cid}
                                        </TextButton>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )
            }
            <div className="w-100 flex justify-center">
                <div className="pa5 white">
                    Upload images to IPFS
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
                                    <img src={image['data_url']} alt="" width="100" />
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
                        onClick={onUpload}
                        isDisabled={isMakingNetworkCall}
                    >
                        Upload To IPFS
                    </Button>
                </div>)
            }

            {
                selectedCidIndex >= 0 && (
                    <Modal
                        isOpen={selectedCidIndex >= 0}
                        onCloseClick={onCloseModal}
                        shouldHideCloseButton={false}
                    >
                        <ModalContent>
                            <div className="tc black">
                                <Text>
                                    Selected CID: {cids[selectedCidIndex]}
                                </Text>

                                <TextButton
                                    onClick={(): void => {
                                        onOpenIpfsFile(cids[selectedCidIndex]);
                                    }}
                                    iconLeft={<FaFileImage/>}
                                >
                                    View File
                                </TextButton>

                                <div className="mv2">
                                    <TextButton
                                        onClick={(): void => {
                                            onDelete(cids[selectedCidIndex]);
                                        }}
                                        iconLeft={<FaTrashAlt/>}
                                    >
                                        Delete
                                    </TextButton>
                                </div>

                                <TextButton
                                    onClick={(): void => {
                                        setSelectedCidIndex(-1);
                                    }}
                                    iconLeft={<FaWindowClose/>}
                                >
                                    Close Modal
                                </TextButton>
                            </div>
                        </ModalContent>
                    </Modal>
                )
            }
        </div>
    )
}

export default ImageUploadPage
