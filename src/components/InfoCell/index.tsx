export function InfoCell({ title, value }: {
  title: string, value: string
}) {
  return <div>
    <h3 className="font-semibold">{title}</h3>
    <p className="text-gray-700 break-all">{value}</p>
  </div>
}