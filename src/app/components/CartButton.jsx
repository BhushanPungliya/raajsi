
import { addToCart } from "@/api/auth";
import Image from "next/image";
import { toast } from "react-toastify";


const CartButton = ({ productId, quantity = 1 }) => {
  const handleAddToCart = async () => {
    try {
      const result = await addToCart(productId, "", quantity);

      // Works for both logged-in and guest users
      if (result?.data?.products || result?.cart?.products) {
        toast.success("Item added to cart!");
      } else if (result?.status === "success") {
        toast.success("Item added to cart!");
      }
    } catch (err) {
      toast.error(err?.error?.message || "Error adding item to cart");
    }
  };

  return (
    <button onClick={handleAddToCart}>
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
