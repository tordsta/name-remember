export default function Features() {
  return (
    <div>
      <h2 className="text-2xl">Features ✨</h2>
      <ul className="list-inside pl-4">
        <li className="text-lg py-1">
          📌 Photo Integration: Upload class photos and tag them with their
          name.
        </li>
        <li className="text-lg py-1">
          📌 Quizzes: Challenge yourself with quizzes that test your name recall
          ability.
        </li>
        <li className="text-lg py-1">
          📌 Mobile Friendly: Practice on-the-go with our mobile-optimized
          website.
        </li>
        <li className="text-lg py-1">
          📌 Email Reminders: Receive daily or weekly reminders directly in your
          inbox, helping you stay consistent in your practice.
        </li>
        {/* <li>📌 Track Progress: Watch your improvement over time with our analytics dashboard.</li> */}
      </ul>
    </div>
  );
}
