import Image from 'next/image'
import React from 'react'

const Loader = () => {
    return (
        <div className='w-full h-vh flex flex-col justify-center items-center'>


            <div className="relative flex w-[100%] animate-pulse">
                <div className="flex-1 justify-items-center items-center">
                    <Image alt="logo" src="/sky_lock_logo.png" width={200} height={200} />

                    <p>
                        One moment while we process your request...
                    </p>
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                        Loading
                        ...</div>
                    <div className="text-center text-sm text-slate-500 dark:text-slate-400">Please wait</div>
                    <div className=" mb-1 h-5 w-[90%] rounded-[3px] bg-slate-300 text-sm"></div>
                    <div className=" items-center mb-1 h-5 w-[90%] rounded-[3px] bg-slate-300 text-sm"></div>

                </div>
            </div>
        </div>
    )
}

export default Loader