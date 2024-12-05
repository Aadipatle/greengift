import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { account, databases, storage } from "../components/appwriteConfig"; 
import { v4 as uuidv4 } from 'uuid'; // Generates unique cart item IDs

const ProductDetail = () => {
    const { productId } = useParams();  // Get productId from URL parameters
    const [product, setProduct] = useState(null);
    const [userId, setUserId] = useState("userId123"); // Placeholder for user ID
    const [imageFile, setImageFile] = useState(null); // State to hold the uploaded image file

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await databases.getDocument(
                    "67160da60006c266e49a",  // Replace with your actual Database ID
                    "67160e07000777940cc0",  // Replace with your actual Collection ID
                    productId
                );

                let imageUrl = "";
                if (response.imageId) {
                    imageUrl = storage.getFileView("67160ed9003b708e9c94", response.imageId); // Fetch existing image URL using file ID
                }

                setProduct({ ...response, imageUrl });  // Add imageUrl to product data
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        fetchProduct();
    }, [productId]);

    // Function to handle image file change
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file); // Set new image file
        }
    };

    // Function to upload the image to the bucket
    const uploadImage = async (file) => {
        try {
            const response = await storage.createFile(
                "67163de70012e7e91a33",  // Replace with your actual bucket ID
                uuidv4(),          // Generate a unique ID for the file
                file               // The file object
            );
            return response.$id;  // Return the uploaded file ID
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error; // Re-throw error for handling
        }
    };

    // Function to handle adding product to cart
    const addToCart = async () => {
        if (!product) {
            console.error("No product found to add to cart");
            return;
        }
        // const user = await account.get(); // Check if the user is logged in
    
        // if (!user) {
        //     alert('You need to log in to add items to the cart.');
        //     return;
        // }
        try {
            
    
            let imageId;
    
            // Check if an image file is uploaded
            if (imageFile) {
                console.log("Uploading new image...");
                imageId = await uploadImage(imageFile);
                console.log("Image uploaded with ID:", imageId);
            } else {
                imageId = product.imageId; // Use existing imageId if no new image is uploaded
                console.log("Using existing image ID:", imageId);
            }
    
            // Get the image URL to store in the cart
            const imageUrl = imageFile 
                ? storage.getFileView("67163de70012e7e91a33", imageId) // URL of the newly uploaded image
                : product.imageUrl;  // Use existing imageUrl if no new image is uploaded
    
            // Create the cart item with image details
            const cartItem = {
                productId: Number(productId),
                userId: userId,
                name: product.name,
                price: product.price,
                imageId: imageId, // Store the image ID for the product
                imageUrl: imageUrl,  // Store the image URL in the cart item
                description: product.description,
                discount: product.discount,
                category: product.category,
                quantity: 1  // Default quantity is set to 1
            };
    
            console.log("Cart item to be added:", cartItem);
    
            // Add the cart item to the database
            await databases.createDocument(
                "67160da60006c266e49a", // Your Database ID
                "67163bf3002a5d167925", // Your Cart Collection ID
                uuidv4(),  // Unique cart item ID
                cartItem
            );
    
            console.log(`${product.name} added to cart successfully!`);
            alert(`${product.name} added to cart successfully!`);
        } catch (error) {
            console.error("Error adding product to cart:", error);
            alert("Failed to add product to cart. Please try again.");
        }
    };

    if (!product) {
        return <p>Loading product details...</p>;
    }

    return (
        <div className="product-detail-page">
           <div className="singleImg">
           <img src={product.imageUrl} alt={product.name} className="product-detail-image" />
           
           </div>
           <div className="singleContent">
           <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Price:  &#8377;{product.price.toFixed(2)}</p>
            <p>Discount: {product.discount}%</p>

            {/* Input for uploading a new image */}

            <button className="button--flex add-to-cart" onClick={addToCart}>
                Add to Cart
            </button>
           </div>
            
        </div>
    );
};

export default ProductDetail;
