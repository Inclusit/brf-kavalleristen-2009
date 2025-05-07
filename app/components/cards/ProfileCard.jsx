export default function ProfileCard({ person }) {
  const { name, role, imageUrl, email, phone } = person;

  return (
    <div className="bg-white shadow rounded p-4 text-center">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          className="w-24 h-24 mx-auto rounded-full object-cover mb-2"
        />
      )}
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">{role}</p>
      {email && <p className="text-sm mt-2">{email}</p>}
      {phone && <p className="text-sm">{phone}</p>}
    </div>
  );
}
