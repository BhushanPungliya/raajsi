import { addToWishlist } from "@/api/auth";
import Image from "next/image";

const WishlistButton = ({ productId }) => {
    const handleWishlist = async () => {
        try {
            const result = await addToWishlist(productId);
            console.log("Wishlist Response:", result);

            let localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            if (!localWishlist.includes(productId)) {
                localWishlist.push(productId);
                localStorage.setItem("wishlist", JSON.stringify(localWishlist));
            }

        } catch (err) {
            console.error("Wishlist Error:", err);
        }
    };

    return (
        <button onClick={handleWishlist} className="cursor-pointer">
            <Image
                src="/images/home/like.svg"
                alt="like"
                height={40}
                width={40}
                className="object-cover md:h-[52px] md:w-[52px]"
            />
        </button>
    );
};

export default WishlistButton;
