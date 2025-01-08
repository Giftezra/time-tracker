const apiKey = "AIzaSyBP8gYT0nUSZO7XNyIpBVwhhSG77vGN8dE";

const getPlaceDetails = async (placeId: string) => { 
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}${apiKey}`

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },

        })
        if (!response.ok) {
            throw new Error("Error fetching place details")
        }

        const data = await response.json()
        console.log("Place details", data)
    }catch (error) {
        console.error("Error fetching place details", error)
    }
}