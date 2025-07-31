import React from 'react';
import "./LoaderB.css"
import Image from 'next/image'

const LoaderB = () => {
    return (
        <div className="loader">

            <div className="box box0">
                <Image alt="logo" src="/sky_lock_logo.png" width={200} height={200} />
            </div>
        </div>
    );
}

export default LoaderB;
