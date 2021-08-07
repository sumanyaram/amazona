/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { detailsProduct, updateProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Axios from 'axios';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

function ProductEditScreen(props) {
    const productId = props.match.params.id;

    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('');

    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails;


    // product update
    const productUpdate = useSelector(state => state.productUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

    const dispatch = useDispatch();

    const userSignin = useSelector(state => state.userSignin);
    const {userInfo} = userSignin;

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image, 
            category, 
            countInStock,
            brand,
            description,
        }))
    };

    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');

    const uploadFileHandler = async (e) => {
        // TODO: upload the file

        const filename = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image', filename);
        setLoadingUpload(true);

        try{
            const {data} = await Axios.post('/api/uploads', bodyFormData, {
                headers: {
                    'Content-Type' : 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`
                }
            });

            setImage(data);
            setLoadingUpload(false);
        }
        catch(error)
        {
            setLoadingUpload(false);

            var errorMsg =  error.response && error.response.data.message ?
                        error.response.data.message :
                        error.message;

            setErrorUpload(errorMsg);
        }
    }

    useEffect(() => {
        // if the producut is successfully updated. then reset the update
        if (successUpdate)
        {
            props.history.push('/productlist');
        }

        if (!product || (product._id !== productId) || successUpdate) {
            dispatch({type:PRODUCT_UPDATE_RESET});
            dispatch(detailsProduct(productId));
        }
        else {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category);
            setBrand(product.brand);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [dispatch, 
        productId,
        product,
        successUpdate,
        props.history,
    ]);

    return (
        <div>
            
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Edit Product</h1>
                </div>

                {loadingUpdate && <LoadingBox></LoadingBox>}
                {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}

                {loading ? <LoadingBox></LoadingBox>:
                error ? <MessageBox variant="danger">{error}</MessageBox>
                :
                <>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" placeholder="Enter name" value={name} 
                            onChange={e => setName(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="price">Price</label>
                        <input type="number" id="price" placeholder="Enter price" value={price} 
                            onChange={e => setPrice(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="image">Image</label>
                        <input type="text" id="image" placeholder="Enter image" value={image} 
                            onChange={e => setImage(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="imageFile">Image File</label>
                        <input type="file" id="imageFile" label="Browse image"
                            onChange={uploadFileHandler}>
                        </input>
                        {loadingUpload && <LoadingBox></LoadingBox>}
                        {errorUpload && <MessageBox variant="danger">{errorUpload}</MessageBox>}
                    </div>
                    <div>
                        <label htmlFor="category">Category</label>
                        <input type="text" id="category" placeholder="Enter category" value={category} 
                            onChange={e => setCategory(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="brand">Brand</label>
                        <input type="text" id="brand" placeholder="Enter brand" value={brand} 
                            onChange={e => setBrand(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="countInStock">Brand</label>
                        <input type="number" id="countInStock" placeholder="Enter count in stock" value={countInStock} 
                            onChange={e => setCountInStock(e.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea type="text" id="description" placeholder="Enter desciption" value={description} 
                            onChange={e => setDescription(e.target.value)}></textarea>
                    </div>
                    <div>
                        <label />
                        <button className="primary" type="submit">
                            Update
                        </button>
                    </div>
                </>
                }
            </form>
        </div>
    )
}

export default ProductEditScreen
