import Image from 'next/image'
import React from 'react'
import LoaderB from './loaders/LoaderB'

const Loader = () => {
    return (
        <div className='w-full h-vh flex flex-col justify-center items-center'>
            {/* <LoaderB /> */}

            <div className="relative flex w-[100%] animate-pulse">
                <div className="flex-1 justify-items-center items-center">
                    <Image alt="logo" src="/sky_lock_logo.png" width={150} height={150} />

                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p>
                        One moment while we process your request...
                    </p>
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400">Loading...</div>
                </div>
            </div>
        </div>
    )
}

export default Loader