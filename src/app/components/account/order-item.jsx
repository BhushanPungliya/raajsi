export default function OrderItem({ title, price, statusLabel, itemsCount, imageAlt = "Product image", imageSrc, orderDate }) {
  const src = imageSrc || "/images/home/img3.jpg";

  // Map backend order_status values to badge colors and friendly labels
  const statusStyles = {
    PLACED: { background: '#FEF3C7', color: '#92400E' }, // amber
    SHIPPED: { background: '#DBEAFE', color: '#1E3A8A' }, // blue
    DELIVERED: { background: 'var(--success-bg)', color: 'var(--success-fg)' }, // green
    CANCELLED_BY_ADMIN: { background: '#FECACA', color: '#991B1B' }, // red
  };

  const style = statusStyles[statusLabel] || { background: 'var(--success-bg)', color: 'var(--success-fg)' };
  const displayStatus = statusLabel === 'CANCELLED_BY_ADMIN' ? 'CANCELLED' : (statusLabel || '');

  // Format date and time
  const formatDateTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const dateStr = d.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
    const timeStr = d.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return `${dateStr} • ${timeStr}`;
  };

  return (
    <article className="flex items-start gap-4 w-full pb-2">
      <img
        src={src}
        width={96}
        height={96}
        alt={imageAlt}
        className="w-[96px] h-[78px] rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1 flex flex-col justify-between">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="mt-2 flex items-center gap-3">
        <span className="text-sm">₹{price * itemsCount}</span>
        <span className="text-xs text-muted-foreground">
            {"Quantity: "}
            {String(itemsCount).padStart(2, "0")}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <span
            className="inline-flex items-center px-2 py-1 text-xs rounded"
            style={{ background: style.background, color: style.color }}
          >
            {displayStatus}
          </span>
          {orderDate && (
            <span className="text-xs text-muted-foreground">
              {formatDateTime(orderDate)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
