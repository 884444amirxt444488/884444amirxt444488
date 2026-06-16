import { useEffect, useState } from "react"


function useFetch(url: string) {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setData(data)
                setLoading(false)
            })
    }, [url])
    return {data, loading}
}

export default useFetch









