import React from "react";

export default function WeatherMap(props){

    const city_name=props.city;
return(
    <>
       <div className="mapofplace">
                            <iframe
                                src={`https://maps.google.com/maps?q=${city_name}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                id="mapBlock"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
    
    </>
);
}