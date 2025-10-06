
export default function AccountDetails({ name, email }) {
  return (
    <div>
      <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-3" style={{ borderBottom: '1px solid #cdcbcb' }}>
        <p className="text-sm text-muted-foreground">{"Name"}</p>
        <p className="text-sm">{name}</p>
      </div>
      <div className="grid grid-cols-[100px_1fr] items-center gap-4 py-3" style={{ borderBottom: '1px solid #cdcbcb' }}>
        <p className="text-sm text-muted-foreground">{"Email"}</p>
        <p className="text-sm">{email}</p>
      </div>
    </div>
  )
}
