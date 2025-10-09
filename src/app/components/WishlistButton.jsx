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

                // Update localStorage
                let localWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
                if (!localWishlist.includes(productId)) {
                    localWishlist.push(productId);
                    localStorage.setItem("wishlist", JSON.stringify(localWishlist));
                }
            } else {
                toast.error(result?.message || "Failed to add to wishlist");
            }

        } catch (err) {
            console.error("Wishlist Error:", err);
            toast.error(err?.message || "Failed to add to wishlist");
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
