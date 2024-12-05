import React, { useEffect, useState } from 'react';
import './Home.css'; // Assuming your CSS is in the same directory
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { databases, storage } from "../components/appwriteConfig";

function Home() {

    // All products array
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("indoor plant");
    const [cartCount, setCartCount] = useState(0);
   const navigate =  useNavigate()
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await databases.listDocuments(
                    "67160da60006c266e49a",
                    "67160e07000777940cc0"
                );
                const productData = await Promise.all(
                    response.documents.map(async (product) => {
                        let imageUrl = "";
                        if (product.imageId) {
                            imageUrl = storage.getFileView("67160ed9003b708e9c94", product.imageId); // Your bucket ID
                        }
                        return { ...product, imageUrl };
                    })
                );

                setProducts(productData);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);
    console.log(process.env.REACT_APP_APPWRITE_COLLECTION_ID)
 

    const addToCart = () => {
        setCartCount(prevCount => prevCount + 1);
    };

    let date = new Date().getFullYear()

    function navigateAllProduct(){
        navigate('/products')
    }
    const uniqueCategories = ["All",
        ...Array.from(
            products.reduce((map, product) => {
                if (!map.has(product.category)) {
                    map.set(product.category, product.imageUrl); // Set category and its corresponding image
                }
                return map;
            }, new Map())
        )
    ];

    // Filter products by category
    const filteredProducts = selectedCategory === "All"
        ? products
        : products.filter(product => product.category === selectedCategory);
    console.log(selectedCategory)

    const topSelling = products.filter(category => category.category === "outdoor plant")
    console.log(topSelling)
    return (
        <div>
            <main className="main">
                <section className="home" id="home">
                    <div className="home__container container grid">
                        <img src="assets/img/home2.png" alt="" className="home__img" />

                        <div className="home__data">
                            <h1 className="home__title">
                                Plants will make <br /> your life better
                            </h1>
                            <p className="home__description">
                                Create incredible plant design for your offices or apartments.
                                Add freshness to your new ideas.
                            </p>
                            <NavLink to={'/products'} className="button button--flex">
                                Shop Now <i className="ri-arrow-right-down-line button__icon"></i>
                            </NavLink>
                        </div>

                        <div className="home__social">
                            <span className="home__social-follow">Follow Us</span>

                            <div className="home__social-links">
                                <a
                                    href="https://www.facebook.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="home__social-link"
                                >
                                    <i className="ri-facebook-fill"></i>
                                </a>
                                <a
                                    href="https://www.instagram.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="home__social-link"
                                >
                                    <i className="ri-instagram-line"></i>
                                </a>
                                <a
                                    href="https://twitter.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="home__social-link"
                                >
                                    <i className="ri-twitter-fill"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                {/**category */}
                <h2 className='h1' id='category'>Popular Categories</h2>
                <div className="category">
                    {uniqueCategories.map(([category, imageUrl], index) => (
                        <div
                            className="category-item a"
                            onClick={() => setSelectedCategory(category)}
                            key={index}
                        >
                            <img src={imageUrl} alt={category} className="category-image" />
                            <p>{category}</p>
                        </div>
                    ))}

                    {/*   <div className="category-item" onClick={() => setSelectedCategory("All")}>
                <p>All Products</p>
              </div>*/}

                </div>

                {/* Products Section */}
                <section className="product section container" id="products">
                    <h2 className="section__title-center">
                        {selectedCategory === "All"
                            ? "Check out our products"
                            : `Check out our ${selectedCategory}`}
                    </h2>

                    <div className="product__container grid">
                        {filteredProducts.map((product, index) => {
                            const discountedPrice = (product.price * (1 - product.discount / 100)).toFixed(2);

                            return (
                                <article className="product__card" key={index}>
                                    <Link to={`/product/${product.$id}`}>
                                        <img src={product.imageUrl} alt={product.name} className="product__img" />
                                    </Link>
                                    <h3 className="product__title">{product.name}</h3>

                                    {/* Original Price (Strikethrough) and Discounted Price */}
                                    <span className="product__price">
                                        <del> &#8377;{product.price.toFixed(2)}</del> ${discountedPrice}
                                    </span>
                                    <span className="product__discount">Discount: {product.discount}%</span>

                                    {/** <button className="button--flex product__button">
                                    <i className="ri-shopping-bag-line"></i>
                                </button> */}
                                </article>
                            );
                        })}
                    </div>

                    <div className="btn1">
                        <button className="btn" onClick={()=>navigateAllProduct()}>View More</button>
                    </div>
                </section>                {/**products */}
                <section className="product section container" id="products">
                    <h2 className="section__title-center">
                        Best Selling Products
                    </h2>

                    <div className="product__container grid">
                        {topSelling.map(product => (
                            <article className="product__card" key={product.id}>

                                <Link to={`/product/${product.$id}`}>
                                    <img src={product.imageUrl} alt={product.name} className="product__img" />
                                </Link>
                                <h3 className="product__title">{product.name}</h3>
                                <span className="product__price"> &#8377;{product.price.toFixed(2)}</span>
                                <span className="product__discount">Discount: {product.discount}%</span>

                                {/** <button className="button--flex product__button">
                                    <i className="ri-shopping-bag-line"></i>
                                </button> */}
                            </article>
                        ))}
                    </div>
                    <div className="btn1">
                        <button className='btn' onClick={()=>navigateAllProduct()}>View More</button>
                    </div>

                </section>
                <section className="product section container" id="products">
                    <h2 className="section__title-center">
                        Best Pots For Plants
                    </h2>

                    <div className="product__container grid">
                        {topSelling.map(product => (
                            <article className="product__card" key={product.id}>

                                <Link to={`/product/${product.$id}`}>
                                    <img src='assets/img/pot.jpg' alt={product.name} className="product__img" />
                                </Link>
                                <h3 className="product__title">{product.name}</h3>
                                <span className="product__price"> &#8377;{product.price.toFixed(2)}</span>
                                <span className="product__discount">Discount: {product.discount}%</span>

                                {/** <button className="button--flex product__button">
                                    <i className="ri-shopping-bag-line"></i>
                                </button> */}
                            </article>
                        ))}
                    </div>
                    <div className="btn1">
                        <button className='btn' onClick={()=>navigateAllProduct()}>View More</button>
                    </div>

                </section>

                {/* ==================== STEPS ==================== */}
                <section className="steps section container">
                    <div className="steps__bg">
                        <h2 className="section__title-center steps__title">
                            Steps to start your <br /> plants off right
                        </h2>

                        <div className="steps__container grid">
                            <div className="steps__card">
                                <div className="steps__card-number">01</div>
                                <h3 className="steps__card-title">Choose Plant</h3>
                                <p className="steps__card-description">
                                    We have several varieties of plants you can choose from.
                                </p>
                            </div>

                            <div className="steps__card">
                                <div className="steps__card-number">02</div>
                                <h3 className="steps__card-title">Place an order</h3>
                                <p className="steps__card-description">
                                    Once your order is set, we move to the next step which is shipping.
                                </p>
                            </div>

                            <div className="steps__card">
                                <div className="steps__card-number">03</div>
                                <h3 className="steps__card-title">Get plants delivered</h3>
                                <p className="steps__card-description">
                                    Our delivery process is easy, you receive the plant directly at your door.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ==================== ABOUT ==================== */}
                <section className="about section container" id="about">
                    <div className="about__container grid">
                        <img src="assets/img/about.png" alt="" className="about__img" />

                        <div className="about__data">
                            <h2 className="section__title about__title">
                                Who we really are & <br /> why choose us
                            </h2>

                            <p className="about__description">
                                We have over 4000+ unbiased reviews and our customers
                                trust our plant process and delivery service every time.
                            </p>

                            <div className="about__details">
                                <p className="about__details-description">
                                    <i className="ri-checkbox-fill about__details-icon"></i>
                                    We always deliver on time.
                                </p>
                                <p className="about__details-description">
                                    <i className="ri-checkbox-fill about__details-icon"></i>
                                    We give you guides to protect and care for your plants.
                                </p>
                                <p className="about__details-description">
                                    <i className="ri-checkbox-fill about__details-icon"></i>
                                    We always come over for a check-up after sale.
                                </p>
                                <p className="about__details-description">
                                    <i className="ri-checkbox-fill about__details-icon"></i>
                                    100% money back guaranteed.
                                </p>
                            </div>

                            <NavLink to={'/products'} className="button--link button--flex btn" >
                                Shop Now <i className="ri-arrow-right-down-line button__icon"></i>
                            </NavLink>
                        </div>
                    </div>
                </section>




               
                {/**contact */}

                <section class="contact section container" id="contact">
                    <div class="contact__container grid">
                        <div class="contact__box">
                            <h2 class="section__title">
                                Reach out to us today <br /> via any of the given <br /> information
                            </h2>

                            <div class="contact__data">
                                <div class="contact__information">
                                    <h3 class="contact__subtitle">Call us for instant support</h3>
                                    <span class="contact__description">
                                        <i class="ri-phone-line contact__icon"></i>
                                        +999 888 777
                                    </span>
                                </div>

                                <div class="contact__information">
                                    <h3 class="contact__subtitle">Write us by mail</h3>
                                    <span class="contact__description">
                                        <i class="ri-mail-line contact__icon"></i>
                                        user@email.com
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="google_map">
                            <iframe
                                title="Starmover"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.0073299676537!2d78.996787075035!3d21.152106580528237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4ea8d6e2479f1%3A0xe6fd30940f203de1!2sShri%20Sai%20Hardware!5e0!3m2!1sen!2sin!4v1705997230327!5m2!1sen!2sin"
                                style={{ border: "0px", borderRadius: "20px" }}
                                allowfullscreen=""
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                                height="100%"
                                width="100%"
                            ></iframe>
                        </div>
                    </div>
                </section>
            </main>

            <footer class="footer section">
                <div class="footer__container container grid">
                    <div class="footer__content">
                        <a href="#" class="footer__logo">
                            <i class="ri-leaf-line footer__logo-icon"></i> Green-Gift
                        </a>

                        <h3 class="footer__title">
                            Send Message If  <br /> You Have Any Quary
                        </h3>

                        <div class="footer__subscribe">

                            <button class="button button--flex footer__button">
                                WhatsApp
                                <i class="ri-arrow-right-up-line button__icon"></i>
                            </button>
                        </div>
                    </div>

                    <div class="footer__content">
                        <h3 class="footer__title">Our Address</h3>

                        <ul class="footer__data">
                            <li class="footer__information">1234 - Peru</li>
                            <li class="footer__information">La Libertad - 43210</li>
                            <li class="footer__information">123-456-789</li>
                        </ul>
                    </div>

                    <div class="footer__content">
                        <h3 class="footer__title">Contact Us</h3>

                        <ul class="footer__data">
                            <li class="footer__information">+999 888 777</li>

                            <div class="footer__social">
                                <a href="https://www.facebook.com/" class="footer__social-link">
                                    <i class="ri-facebook-fill"></i>
                                </a>
                                <a href="https://www.instagram.com/" class="footer__social-link">
                                    <i class="ri-instagram-line"></i>
                                </a>
                                <a href="https://twitter.com/" class="footer__social-link">
                                    <i class="ri-twitter-fill"></i>
                                </a>
                            </div>
                        </ul>
                    </div>
{/**
                <div class="footer__content">
                        <h3 class="footer__title">
                            We accept all credit cards
                        </h3>

                        <div class="footer__cards">
                            <img src="assets/img/card1.png" alt="" class="footer__card" />
                            <img src="assets/img/card2.png" alt="" class="footer__card" />
                            <img src="assets/img/card3.png" alt="" class="footer__card" />
                            <img src="assets/img/card4.png" alt="" class="footer__card" />
                        </div>
                </div>
    */}
                    
                </div>

                <p class="footer__copy">&#169; {date} All Rights Reserved To Green Gift</p>
            </footer>
        </div>
    );
}

export default Home;


// Question
 
                // <section class="questions section" id="faqs">
                //     <h2 class="section__title-center questions__title container">
                //         Some common questions <br /> were often asked
                //     </h2>

                //     <div class="questions__container container grid">
                //         <div class="questions__group">
                //             <div class="questions__item">
                //                 <header class="questions__header">
                //                     <i class="ri-add-line questions__icon"></i>
                //                     <h3 class="questions__item-title">
                //                         My flowers are falling off or dying?
                //                     </h3>
                //                 </header>

                //                 <div class="questions__content">
                //                     <p class="questions__description">
                //                         Plants are easy way to add color energy and transform your
                //                         space but which planet is for you. Choosing the right plant.
                //                     </p>
                //                 </div>
                //             </div>

                //             <div class="questions__item">
                //                 <header class="questions__header">
                //                     <i class="ri-add-line questions__icon"></i>
                //                     <h3 class="questions__item-title">
                //                         What causes leaves to become pale?
                //                     </h3>
                //                 </header>

                //                 <div class="questions__content">
                //                     <p class="questions__description">
                //                         Plants are easy way to add color energy and transform your
                //                         space but which planet is for you. Choosing the right plant.
                //                     </p>
                //                 </div>
                //             </div>

                //             <div class="questions__item">
                //                 <header class="questions__header">
                //                     <i class="ri-add-line questions__icon"></i>
                //                     <h3 class="questions__item-title">
                //                         What causes brown crispy leaves?
                //                     </h3>
                //                 </header>

                //                 <div class="questions__content">
                //                     <p class="questions__description">
                //                         Plants are easy way to add color energy and transform your
                //                         space but which planet is for you. Choosing the right plant.
                //                     </p>
                //                 </div>
                //             </div>
                //         </div>

                //         <div class="questions__group">
                //             <div class="questions__item">
                //                 <header class="questions__header">
                //                     <i class="ri-add-line questions__icon"></i>
                //                     <h3 class="questions__item-title">
                //                         How do i choose a plant?
                //                     </h3>
                //                 </header>

                //                 <div class="questions__content">
                //                     <p class="questions__description">
                //                         Plants are easy way to add color energy and transform your
                //                         space but which planet is for you. Choosing the right plant.
                //                     </p>
                //                 </div>
                //             </div>

                //             <div class="questions__item">
                //                 <header class="questions__header">
                //                     <i class="ri-add-line questions__icon"></i>
                //                     <h3 class="questions__item-title">
                //                         How do I change the pots?
                //                     </h3>
                //                 </header>

                //                 <div class="questions__content">
                //                     <p class="questions__description">
                //                         Plants are easy way to add color energy and transform your
                //                         space but which planet is for you. Choosing the right plant.
                //                     </p>
                //                 </div>
                //             </div>

                //             <div class="questions__item">
                //                 <header class="questions__header">
                //                     <i class="ri-add-line questions__icon"></i>
                //                     <h3 class="questions__item-title">
                //                         Why are gnats flying around my plant?
                //                     </h3>
                //                 </header>

                //                 <div class="questions__content">
                //                     <p class="questions__description">
                //                         Plants are easy way to add color energy and transform your
                //                         space but which planet is for you. Choosing the right plant.
                //                     </p>
                //                 </div>
                //             </div>
                //         </div>
                //     </div>
                // </section>
               

