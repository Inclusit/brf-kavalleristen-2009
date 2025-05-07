import ProfileCard from "./ProfileCard";

export default function CardGrid({ people }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {people.map((person) => (
        <ProfileCard key={person.email} person={person} />
      ))}
    </div>
  );
}
