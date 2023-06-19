import React from "react";
import { useParams } from "react-router-dom";

const DetailPage = () => {
    let { id } = useParams();
    const product = JSON.parse(localStorage.getItem('currentProduct')) ;
    
    
    return (
        <div className="jumbotron">
            <h1 className="display-4">Product: {product.name}</h1>
            <h1 className="display-4">Product Id: {id}</h1>
        </div>
    );

}

export default DetailPage;