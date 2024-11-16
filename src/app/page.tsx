import Image from 'next/image'
// import styles from './page.module.css'
import Login from '@/components/login/Login'


export default function Home() {
  return (
    <div className='flex bg-[#363740] justify-center h-screen items-center'>
      <Login/>
    </div>
  )
}
