
import { addToCart } from "@/api/auth";
import Image from "next/image";
import { toast } from "react-toastify";


const CartButton = ({ productId, quantity = 1 }) => {
  const handleAddToCart = async () => {
    try {
      const result = await addToCart(productId, "", quantity);
      if (result?.data?.products) {
        localStorage.setItem("userCart", JSON.stringify(result.data.products));
      }
      // console.log("Cart Response:", result);
      toast.success("Item added to cart!");
    } catch (err) {
      // console.error("Cart Error:", err);
      toast.error(err?.error?.message);
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
