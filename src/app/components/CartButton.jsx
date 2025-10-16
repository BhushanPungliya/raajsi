
import { addToCart } from "@/api/auth";
import Image from "next/image";
import { toast } from "react-toastify";


const CartButton = ({ productId, quantity = 1 }) => {
  const handleAddToCart = async () => {
    try {
      const result = await addToCart(productId, "", quantity);

      if (result?.status === "exists") {
        toast.info(result?.message || "Item already exists in cart");
      } else if (result?.data?.products || result?.cart?.products) {
        toast.success("Item added to cart!");
      } else if (result?.status === "success") {
        // Show appropriate message for guest users
        const message = result?.message || "Item added to cart!";
        toast.success(message);
      }
    } catch (err) {
      toast.error(err?.error?.message || "Error adding item to cart");
    }
  };

  return (
    <button onClick={handleAddToCart} className="cursor-pointer">
      <Image
        src="/images/home/cart.svg"
        alt="cart"
        height={40}
        width={40}
        className="object-cover md:h-[52px] md:w-[52px]"
      />
    </button>
  );
};

export default CartButton;
