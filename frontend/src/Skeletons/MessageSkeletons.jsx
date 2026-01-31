import React from 'react'

const MessageSkeletons = () => {
    const SkeletonMessages = Array(6).fill(null)
    
    return (
        <div className='flex-1 overflow-y-auto p-4 space-y-6'>
            {/* Date separator skeleton */}
            <div className='flex items-center justify-center my-4'>
                <div className='h-4 w-32 bg-gray-200 rounded-full animate-pulse'></div>
            </div>
            
            {
                SkeletonMessages.map((_, index) => {
                    const isSender = index % 2 === 0;
                    
                    return(
                        <div 
                            key={index} // ✅ Key add karein
                            className={`flex items-end gap-3 mb-4 ${isSender ? 'justify-start' : 'justify-end'}`}
                        >
                            {/* Avatar - Only show for receiver side */}
                            {isSender ? (
                                <div className='w-10 h-10 rounded-full bg-gray-300 animate-pulse shrink-0'/>
                            ) : null}
                            
                            {/* Message Bubble */}
                            <div className={`flex flex-col ${isSender ? 'items-start' : 'items-end'}`}>
                                {/* Sender name skeleton - Only for receiver messages */}
                                {!isSender && (
                                    <div className='h-3 w-20 bg-gray-200 rounded mb-1 animate-pulse'></div>
                                )}
                                
                                {/* Message content skeleton */}
                                <div 
                                    className={`
                                        ${isSender ? 'rounded-bl-none' : 'rounded-br-none'}
                                        rounded-2xl animate-pulse
                                        ${index % 3 === 0 ? 'h-24 w-64' : 
                                          index % 3 === 1 ? 'h-16 w-48' : 
                                          'h-12 w-36'}
                                    `}
                                    style={{
                                        backgroundColor: isSender ? '#e5e7eb' : '#dbeafe'
                                    }}
                                ></div>
                                
                                {/* Time skeleton */}
                                <div className='h-2 w-12 bg-gray-200 rounded mt-1 animate-pulse self-end'></div>
                            </div>
                            
                            {/* Avatar for sender side */}
                            {!isSender ? (
                                <div className='w-10 h-10 rounded-full bg-gray-300 animate-pulse shrink-0'/>
                            ) : null}
                        </div>
                    )
                })
            }
            
            {/* Additional date separator in middle */}
            <div className='flex items-center justify-center my-4'>
                <div className='h-4 w-24 bg-gray-200 rounded-full animate-pulse'></div>
            </div>
            
            {/* Few more skeleton messages */}
            {Array(3).fill(null).map((_, index) => (
                <div 
                    key={`bottom-${index}`}
                    className={`flex items-end gap-3 mb-4 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                    {index % 2 === 0 ? (
                        <div className='w-10 h-10 rounded-full bg-gray-300 animate-pulse shrink-0'/>
                    ) : null}
                    
                    <div className={`flex flex-col ${index % 2 === 0 ? 'items-start' : 'items-end'}`}>
                        <div 
                            className={`
                                ${index % 2 === 0 ? 'rounded-bl-none' : 'rounded-br-none'}
                                rounded-2xl animate-pulse
                                h-20 w-52
                            `}
                            style={{
                                backgroundColor: index % 2 === 0 ? '#e5e7eb' : '#dbeafe'
                            }}
                        ></div>
                        
                        <div className='h-2 w-10 bg-gray-200 rounded mt-1 animate-pulse self-end'></div>
                    </div>
                    
                    {index % 2 !== 0 ? (
                        <div className='w-10 h-10 rounded-full bg-gray-300 animate-pulse shrink-0'/>
                    ) : null}
                </div>
            ))}
        </div>
    )
}

export default MessageSkeletons