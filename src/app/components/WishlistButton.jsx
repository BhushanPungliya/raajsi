import { addToWishlist } from "@/api/auth";
import Image from "next/image";
import { toast } from "react-toastify";

const WishlistButton = ({ productId }) => {
    const handleWishlist = async () => {
        try {
            const result = await addToWishlist(productId);
            console.log("Wishlist Response:", result);

            if (result?.status === "success") {
                toast.success("Product added to wishlist! ❤️");
                // Note: localStorage is already updated by addToWishlist API function
                // No need to manually update it here
            } else {
                toast.error(result?.message || "Failed to add to wishlist");
            }

        } catch (err) {
            console.error("Wishlist Error:", err);
            
            // Check if it's a duplicate error
            if (err?.message?.includes("already exists")) {
                toast.info("Product is already in your wishlist");
            } else {
                toast.error(err?.message || "Failed to add to wishlist");
            }
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

