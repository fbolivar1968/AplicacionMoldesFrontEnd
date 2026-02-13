import React, {useState} from 'react';

const ImageModal = ({src, alt}) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            <img
                src={src}
                alt={alt}
                className={`w-20 h-auto cursor-pointer shadow-lg hover:opacity-80 transition duration-300`}
                onClick={openModal}
            />

            {isOpen && (
                <div
                    className={`fixed inset-0 z-50 p-4 flex items-center justify-center bg-black bg-opacity-75`}
                    onClick={closeModal}>
                    <div className="relative"
                         onClick={(e) => e.stopPropagation()}>
                        <img
                            src={src}
                            alt={alt}
                            className="max-w-50 max-h-50 object-contain"/>

                        {/*<button*/}
                        {/*    className="absolute top-0 right-0 mt-0 mr-0 text-white text-2xl font-bold leading-none bg-transparent border-0 outline-none focus:outline-none"*/}
                        {/*    onClick={closeModal}>*/}
                        {/*    &times;*/}
                        {/*</button>*/}
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageModal;