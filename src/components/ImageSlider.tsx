"use client"
import Image from "next/image"
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { useEffect, useState } from "react"
import type SwiperType from "swiper"
import { Pagination } from "swiper/modules"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageSliderProps {
    urls: {
        url: string
    }[]
}

const ImageSlider = ({ urls }: ImageSliderProps) => {
    const [swiper, setSwiper] = useState<null | SwiperType>(null)
    const [activeIndex, setActiveIndex] = useState<number >(0) 
    const [slideConfig, setSlideConfig] = useState({
        isBeggining: true,
        isEnd: urls.length
    })

    useEffect(() => {
        swiper?.on("slideChange", () => {
            setActiveIndex(activeIndex)
        })
    }, [swiper, urls])

    const activeStyles = "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -y-translate-1/2 aspect-square h-8 w-8 place-items-center rounded-full border-2 bg-white border-zinc-200"
    const inactiveStyles = "hidden text-gray-400"
    return (<div className="group relative bg-zinc-100 aspect-square overflow-hidden rounded-xl">
        <div className="absolute z-10 inset-0 opacity-0 group-hover:placeholder-opacity-100 transition">
            <button aria-label="Next image" className={`${activeStyles} right-3`}
            onClick={(e) => {
                e.preventDefault()
                swiper?.slideNext()
            }}><ChevronRight className="h-4 w-4 text-zinc-700"/></button>
            <button aria-label="Previous image" className={`${activeStyles} left-3`}
                        onClick={(e) => {
                            e.preventDefault()
                            swiper?.slidePrev()
                        }}><ChevronLeft /></button>
        </div>

        <Swiper 
            onSwiper={(swiper) => setSwiper(swiper)}
            spaceBetween={50}
            slidesPerView={1}
            modules={[Pagination]}
            className="h-full w-full">
            {urls.map((url, index) => {
                return <SwiperSlide key={index} className="-z-10 relative h-full w-full">
                    <Image src={url?.url} 
                    fill 
                    loading="eager" 
                    className="-z-10 h-full w-full object-cover object-center" 
                    alt="Product image"/>
                </SwiperSlide>
            })}
        </Swiper>
    </div>)
}

export default ImageSlider