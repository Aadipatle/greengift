import React, { useEffect, useState } from 'react';
import { databases } from "./appwriteConfig";
import { NavLink } from 'react-router-dom';

function Header() {
    const [cartItems, setCartItems] = useState([]);
    const [toggle, setToggle] = useState(false);
    const userId = "userId123"; // Replace this with the actual user ID

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await databases.listDocuments(
                    "67160da60006c266e49a", // Your Database ID
                    "67163bf3002a5d167925"  // Your Cart Collection ID
                );

                setCartItems(response.documents); // Set cart items to state
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchCartItems();

        // Set up polling every 5 seconds
        const interval = setInterval(() => {
            fetchCartItems();
        }, 5000);

        // Cleanup the interval on unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <header className="header" id="header">
                <nav className="nav containe">
                    <NavLink to={'/'} className="nav__logo">
                        <img src="assets/img/greengift.png" width={'100px'} alt="" />
                    </NavLink>

                    <div className={toggle ? 'nav__menu show-menu' : "nav__menu"} id="nav-menu" >
                        <ul className="nav__list">
                            <li className="nav__item">
                                <NavLink to={'/'} className="nav__link active-link">Home</NavLink>
                            </li>
                            <li className="nav__item">
                                <a href="#category" className="nav__link">Category</a>
                            </li>
                            <li className="nav__item">
                                <NavLink to={'/pots'} className="nav__link">Pots</NavLink>
                            </li>
                            <li className="nav__item">
                                <a href="#about" className="nav__link">About</a>
                            </li>
                            <li className="nav__item">
                                <a href="#products" className="nav__link">Products</a>
                            </li>
                            <li className="nav__item">
                                <a href="#contact" className="nav__link">Contact Us</a>
                            </li>
                        </ul>

                        <div className="nav__close" onClick={() => setToggle(false)} id="nav-close">
                            <i className="ri-close-line"></i>
                        </div>
                    </div>
                    <div className="cart">
                        {/* Shopping Cart Icon with Cart Count */}
                        <NavLink to={'/add'}>
                            <div className="cart__icon">
                                <i className="ri-shopping-bag-line"></i>
                                {cartItems.length > 0 && <span className="cart__count">{cartItems.length}</span>}
                            </div>
                        </NavLink>
                        <div className="cart__icon">
                            <i className="ri-user-line"></i>
                        </div>
                        <div className="nav__btns">
                        <div className="nav__toggle" onClick={() => setToggle(!toggle)} id="nav-toggle">
                            <i className="ri-menu-line"></i>
                     
                    </div>
                </div>
                </div>
                {/**  <div className="nav__btns">
                        <div className="nav__toggle" onClick={()=>setToggle(!toggle)} id="nav-toggle">
                            <i className="ri-menu-line"></i>
                        </div>
                    </div>*/}

            </nav>
        </header >
        </>
    );
}

export default Header;
