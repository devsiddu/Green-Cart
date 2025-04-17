import React from 'react'
import Mainbanner from '../components/Mainbanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BootomBanner from '../components/BootomBanner'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
  return (
    <div className='mt-10'>
      <Mainbanner />
      <Categories />
      <BestSeller />
      <BootomBanner />
      <NewsLetter/>
    </div>
  )
}

export default Home
