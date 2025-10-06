export default function OrderItem({ title, price, statusLabel, itemsCount, imageAlt = "Product image" }) {
  return (
    <article className="flex items-start gap-4 w-full">
      <img
   src={"/images/home/img3.jpg"}
   width={96}
   height={96}
   alt={imageAlt}
   className="w-[96px] h-[78px] rounded-xl object-cover"
 />

      <div className="min-w-0 flex-1 flex flex-col justify-between">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-sm">{price}</div>

        <div className="mt-2 flex items-center gap-3">
          <span
            className="inline-flex items-center px-2 py-2 text-xs"
            style={
              {
                background: "var(--success-bg)",
                color: "var(--success-fg)",
              }
            }
          >
            {statusLabel}
          </span>
          <span className="text-xs text-muted-foreground">
            {String(itemsCount).padStart(2, "0")}
            {" Items"}
          </span>
        </div>
      </div>
    </article>
  )
}
