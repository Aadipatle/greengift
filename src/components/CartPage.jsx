import React, { useEffect, useState } from 'react';
import { account, databases } from "./appwriteConfig";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const userId = 'userId123'; // Replace this with the actual user ID

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                // const user = await account.get();
                const response = await databases.listDocuments(
                    "67160da60006c266e49a", // Your Database ID
                    "67163bf3002a5d167925"  // Your Cart Collection ID
                    // [`userId=${user.$id}`] 
                );

                setCartItems(response.documents); // Set cart items to state
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchCartItems();
    }, [userId]);

    const handleRemoveFromCart = async (itemId) => {
        try {
            await databases.deleteDocument(
                "67160da60006c266e49a",
                "67163bf3002a5d167925", 
                itemId 
            );

           
            setCartItems(cartItems.filter(item => item.$id !== itemId));
            alert("Item removed from cart.");
        } catch (error) {
            console.error("Error removing item from cart:", error);
            alert("Failed to remove item from cart. Please try again.");
        }
    };

    
    const handleQuantityChange = (itemId, delta) => {
        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.$id === itemId) {
                    const newQuantity = item.quantity + delta;
                    return { ...item, quantity: newQuantity < 1 ? 1 : newQuantity }; // Prevent quantity from going below 1
                }
                return item;
            })
        );
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const handlePlaceOrder = () => {
        alert("Order placed successfully!");
    };

    return (
        <div className="cart-page">
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <table className="cart-table">
                    <thead>
                        <tr>
                            <th>Sr No.</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item, index) => (
                            <tr key={item.$id}>
                                <td>{index + 1}</td>
                                <td>
                                    {item.imageId && (
                                        <img src={item.imageUrl} alt={item.name} className="cart-item-image" width={'100px'} />
                                    )}
                                </td>
                                <td>{item.name}</td>
                                <td> &#8377;{item.price.toFixed(2)}</td>
                                <td>
                                    <button className='btn' onClick={() => handleQuantityChange(item.$id, -1)}>-</button>
                                    <span> {item.quantity} </span>
                                    <button className='btn' onClick={() => handleQuantityChange(item.$id, 1)}>+</button>
                                </td>
                                <td>
                                    <button className='btn' onClick={() => handleRemoveFromCart(item.$id)}>Remove</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {cartItems.length > 0 && (
                <div className="cart-total">
                    <h3>Total Price: &#8377;{calculateTotalPrice()}</h3>
                    <button className='pbtn' onClick={handlePlaceOrder}>Place Order</button>
                </div>
            )}
        </div>
    );
};

export default CartPage;
