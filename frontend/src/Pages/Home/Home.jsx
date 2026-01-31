import React from 'react'
import Sidebar from '../../Components/Sidebar/Sidebar'  

import { useSelector } from 'react-redux'
import ChatContainer from '../../Components/ChatContainer/ChatContainer'
import NoChatSelected from '../../Components/NoChatSelected/NoChatSelected'
const Home = () => {
  const {selecedUser} = useSelector(state=>state.chat)

  return (
    <div className='min-h-screen bg-gary-100'>
      <div className='flex items-center justify-center pt-20 px-4'>
        <div className='bg-white rounded-lg shadow-md w-full max-w-6xl h-[clac(100vh-8rem)]'>
          <div className='flex h-full rounded-lg overflow-hidden'>
            <Sidebar/> 
            {
              selecedUser ? <NoChatSelected/> : <ChatContainer />
            }

          </div>

        </div>

      </div>

    </div>
  )
}

export default Home