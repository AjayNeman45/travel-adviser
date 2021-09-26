import React, { useState, useEffect, createRef } from 'react'
import { CssBaseline, Grid } from '@material-ui/core'
import Header from './components/Header/Header'
import List from './components/List/List'
import Map from './components/Map/Map'
import { getPlacesData } from './api/travelAdvisorAPI'
const App = () =>
{
    const [places, setPlaces] = useState([])
    const [filteredPlaces, setFilteredPlaces] = useState([])

    const [coordinates, setCoordinates] = useState({})
    const [bounds, setBounds] = useState({});

    const [childClicked, setChildClicked] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [type, setType] = useState('restaurants')
    const [rating, setRating] = useState('')

    useEffect(() =>
    {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) =>
        {
            setCoordinates({ lat: latitude, lng: longitude })
        })
    }, [])

    useEffect(() =>
    {
        const filtered = places.filter((place) => Number(place.rating) > rating);
        setFilteredPlaces(filtered);
    }, [rating]);

    useEffect(() =>
    {
        if(bounds){
            setIsLoading(true)
            getPlacesData(type, bounds.sw, bounds.ne)
                .then((data) =>
                {
                    setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
                    setFilteredPlaces([])
                    setIsLoading(false)
                })
        }
        
    }, [type, coordinates, bounds])

    return (
        <>
            <CssBaseline />
            <Grid container style={{ width: "100%" }}>
                <Header setCoordinates={setCoordinates}/>
                <Grid item xs={12} md={4}>
                    <List
                        places={filteredPlaces.length ? filteredPlaces : places}
                        childClicked={childClicked}
                        isLoading={isLoading}
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        places={filteredPlaces.length ? filteredPlaces : places}
                        setChildClicked={setChildClicked}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default App
