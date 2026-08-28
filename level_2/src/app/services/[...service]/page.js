import React from 'react';

const Page = async ({ params }) => {
    const {service} = await params;
    console.log(service)
    return (
        <div>
            <p>service page parallel route</p>
            {service?.map((item,index)=>{
                return(
                    <div key={index}>
                        <h1>{item}</h1>
                    </div>
                )
            })}
        </div>
    );
};

export default Page;