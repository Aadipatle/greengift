import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { databases, storage } from "../components/appwriteConfig"; 

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cartCount, setCartCount] = useState(0);

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
                            imageUrl = storage.getFileView("67160ed9003b708e9c94", product.imageId);
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

    // Extract unique categories and assign an image from one product in each category
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
console.log(selectedCategory)
    // Filter products by selected category
    const filteredProducts = selectedCategory === "All"
        ? products
        : products.filter(product => product.category === selectedCategory);

    const addToCart = () => {
        setCartCount(prevCount => prevCount + 1);
    };

    return (
       
  <div className='allcontainer'>
        {/* Category Filter */}
        <div className="category">
            {uniqueCategories.map(([category, imageUrl],index) => (
                <div 
                    className="category-item a" 
                    onClick={() => setSelectedCategory(category)} 
                    key={index}
                >
                    <img src={imageUrl} alt={category} className="category-image" />
                    <p>{category}</p>
                </div>
            ))}
            <div className="category-item" onClick={() => setSelectedCategory("All")}>
            <p>All Products</p>
          </div>
        </div>

        {/* Products */}
        <section className="product section container" id="products">
            <h2 className="section__title-center">
                {selectedCategory === "All"
                    ? "Check out our products"
                    : `Check out our ${selectedCategory}`}
            </h2>

            <div className="product__container grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product,index) => (
                        
                        <article className="product__card" key={index}>
                        <Link to={`/product/${product.$id}`}>
                            <img src={product.imageUrl} alt={product.name} className="product__img" />
                            <h3 className="product__title">{product.name}</h3>
                            <span className="product__price"> &#8377;{product.price.toFixed(2)}</span>
                            <span className="product__discount">Discount: {product.discount}%</span>
                            </Link>
                           
                        </article>
                    ))
                ) : (
                    <p>No products available for this category.</p>
                )}
            </div>
        </section>
        </div>
      
    );
};

export default ProductPage;
