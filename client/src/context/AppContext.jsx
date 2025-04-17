import {
    Children,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);

    const [cartItems, setcartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});


    //Fetch seller status
    const fetchSeller = async () => {
        try {
            const { data } = await axios.get('/api/seller/is-auth');
            if (data.success) {
                setIsSeller(true);
            } else {
                setIsSeller(false);
            }
        } catch (error) {
            setIsSeller(false);
        }
    }

    //fetch user auth status, User Data and cart items
    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth');
            if (data.success) {
                setUser(data.user);
                setcartItems(data.user.cartItems);
            }
            
        } catch (error) {
            setUser(null);
        }
    }
    


    //fetch  all product
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.msg);

            }
        } catch (error) {
            toast.error(error.msg);
        }

    };
    // add product to cart
    const addToCart = (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }
        setcartItems(cartData);
        toast.success("added To Cart");
    };

    //update cart item quantity
    const updateCartItem = (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setcartItems(cartData);
        toast.success("Cart Updated");
    };
    //remove product from cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId];
            }
        }
        toast.success("Removed From Cart")
        setcartItems(cartData);
    };


    // Get Cart Item Count
    const getCartCount = () => {
        let totalCount = 0;
        for (const item in cartItems) {
            totalCount += cartItems[item];
        }
        return totalCount;
    }

    // Get Cart Total Amt

    const getCartAmt = () => {
        let totalAmt = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (cartItems[items] > 0) {
                totalAmt += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmt * 100) / 100;
    }
    useEffect(() => {
        fetchUser();
        fetchSeller();
        fetchProducts();
    }, []);

    // update database cart items
    useEffect(() => {
        const updateCart = async () => {
            try {
                const { data } =await axios.post('/api/cart/update', { cartItems,userId:user._id })
                if (!data.success) {
                    toast.error(data.msg);
                }
            } catch (error) {
                toast.error(error.message);
                
            }
        }
        if (user) {
            updateCart();
        }
                
    },[cartItems])

    const value = {
        navigate,
        user,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        currency,
        addToCart,
        updateCartItem,
        removeFromCart,
        cartItems,
        searchQuery,
        setSearchQuery,
        getCartAmt,
        getCartCount,
        axios,
        fetchProducts,
        setcartItems
        
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useAppContext = () => {
    return useContext(AppContext);
};
