import { useEffect } from "react"
import "./Event.scss"
import { CardEvent } from "../../components/Cards/Cards"

export const  Events =() => {
    useEffect(() => {
        window.scrollTo(0,0)
    },[])
    return (
        <>
        <div className="content"><CardEvent/></div>
        </>
    )
}