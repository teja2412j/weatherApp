import React from "react";

export default function ForcastDetails({ forcast, forcastLoad,forcastError}) {
    return (
        <>
           
                {forcastLoad && <div>loading ........</div>}

                {forcastError && <div>error loading datas</div>}
            {!forcastLoad &&  !forcastError &&(
                <div className="weeklyforcast">
                    {forcast?.list?.map((item, index) => (
                        <div className="weekfor" key={index}>
                            <p>Date:</p>
                            <p>{item.dt_txt}</p>
                            <p>Temperature:</p>
                            <p>{item?.main?.temp ?? "N/A"} °C</p>
                            <p>Feels Like:</p>
                            <p>{item?.main?.feels_like ?? "N/A"}</p>
                            <p>Temp Max:</p>
                            <p>{item?.main?.temp_max ?? "N/A"}</p>
                            <p>Humidity:</p>
                            <p>{item?.main?.humidity ?? "N/A"}</p>
                        </div>
                    ))}
                </div>
            ) }
        </>
    );
}
