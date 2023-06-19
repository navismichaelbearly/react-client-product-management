import { useEffect, useState  } from "react";
import UserService from '../../services/user.service';
import { User } from '../../models/user';
import { Transaction } from '../../models/transaction';
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const navigate = useNavigate();
    const [products, setProducts ] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage ] = useState('');
    const [ currentUser, setCurrentUser ] = useState(new User());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        UserService.currentUser.subscribe(data => {
            setCurrentUser(data);
        });
       
        UserService.findAllProducts()
            .then(products => {
                setLoading(false);
                setProducts(products.data);
            }
        );
    },[loading]);
 

    const purchaseProduct = (product) => {
        if(!currentUser) {
            setErrorMessage("You should sign in to purchase a product");
            return;
        }

        let transaction = new Transaction(currentUser, product);

        UserService.purchaseProducts(transaction)
            .then( 
                data => {
                    setInfoMessage("Mission is completed");
                }, 
                error => {
                    setErrorMessage("Unexpected error occured.");
                }
            );
    }

    const detail = (product) => {
        console.log(product);
        localStorage.setItem('currentProduct', JSON.stringify(product));
        navigate('/detail/'+ product.id);
    }

    return (
        <div className="col-md-12">
            {infoMessage &&
                <div className="alert alert-success alert-dismissible">
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    <strong>Successfull! </strong> {infoMessage}
                </div>
            }
            {errorMessage &&
                <div className="alert alert-danger alert-dismissible">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"></button>
                    <strong>Error! </strong> {errorMessage}
                </div>
            }
            {loading && <em>Loading products...</em>}
            {products.length &&
                <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Detail</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            products.map((product, index) => {
                                
                                return(
                                <tr key={product.id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{product.name}</td>
                                    <td>{'$ ' + product.price}</td>
                                    <td>
                                        <button className="btn btn-info" onClick={() => detail(product)}>
                                            Detail
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn btn-success" onClick={() => purchaseProduct(product)}>
                                            Purchase
                                        </button>
                                    </td>
                                </tr>)}
                            )
                        }
                        </tbody>

                </table>
            }
        </div>
    );
}

export default HomePage;