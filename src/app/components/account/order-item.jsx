export default function OrderItem({ 
  title, 
  price, 
  statusLabel, 
  itemsCount, 
  imageAlt = "Product image", 
  imageSrc, 
  orderDate,
  orderId,
  order,
  onCancel,
  onReturn,
  onReplace,
  canCancel,
  canReturn,
  canReplace,
  canBuyAgain,
  rejectionReason,
  returnRequest,
  replacementRequest,
  onViewDetails,
  onBuyAgain,
}) {
  const src = imageSrc || "/images/home/img3.jpg";

  // Map backend order_status values to badge colors and friendly labels
  const statusStyles = {
    PLACED: { background: '#FEF3C7', color: '#92400E' }, // amber
    SHIPPED: { background: '#DBEAFE', color: '#1E3A8A' }, // blue
    DELIVERED: { background: 'var(--success-bg)', color: 'var(--success-fg)' }, // green
    CANCELLED_BY_ADMIN: { background: '#FECACA', color: '#991B1B' }, // red
    CANCELLED_BY_USER: { background: '#FECACA', color: '#991B1B' }, // red
    CANCELLED: { background: '#FECACA', color: '#991B1B' }, // red
    RETURN_REQUESTED: { background: '#E0E7FF', color: '#312E81' }, // indigo
    RETURN_APPROVED: { background: '#D1FAE5', color: '#065F46' }, // green
    RETURN_REJECTED: { background: '#FECACA', color: '#991B1B' }, // red
    RETURNED: { background: 'var(--success-bg)', color: 'var(--success-fg)' }, // green
    REPLACEMENT_REQUESTED: { background: '#E0E7FF', color: '#312E81' }, // indigo
    REPLACEMENT_APPROVED: { background: '#D1FAE5', color: '#065F46' }, // green
    REPLACEMENT_REJECTED: { background: '#FECACA', color: '#991B1B' }, // red
    REPLACEMENT_IN_PROGRESS: { background: '#FED7AA', color: '#92400E' }, // orange
  };

  const style = statusStyles[statusLabel] || { background: 'var(--success-bg)', color: 'var(--success-fg)' };
  let displayStatus = statusLabel?.replace(/_/g, ' ') || '';
  if (statusLabel === 'CANCELLED_BY_USER' || statusLabel === 'CANCELLED_BY_ADMIN') {
    displayStatus = 'CANCELLED';
  }

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
    <article className="flex items-start gap-4 w-full pb-4 border-b cursor-pointer hover:bg-gray-50 transition p-2" onClick={() => onViewDetails?.()}>
      <img
        src={src}
        width={96}
        height={96}
        alt={imageAlt}
        className="w-[96px] h-[78px] rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1 flex flex-col justify-between">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          {order?.parent_order && (
            <span className="inline-flex items-center px-2 py-1 text-xs rounded bg-purple-100 text-purple-800 font-semibold">
              Replacement
            </span>
          )}
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

        {/* Action buttons */}
        <div className="mt-3 flex items-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
          {canBuyAgain && (
            <button
              onClick={() => onBuyAgain?.()}
              className="text-xs px-3 py-1 bg-[#BA7E38] text-white rounded hover:bg-[#a96f2e] transition"
            >
              Buy Again
            </button>
          )}
          <button
              onClick={() => onViewDetails?.()}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition ml-auto"
          >
              View Details
          </button>
        </div>
      </div>
    </article>
  )
}
