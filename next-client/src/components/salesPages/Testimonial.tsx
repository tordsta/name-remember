export default function Testimonial({
  display = [false, false, false],
  title,
}: {
  display: Array<boolean>;
  title?: string;
}) {
  return (
    <div>
      {display[0] && (
        <>
          {title && <h2 className="text-2xl">{title}</h2>}
          <p className="text-lg pl-4 pt-1">
            &quot;With NameRemember, the start of the school year has never been
            smoother. I could confidently call each student by their name within
            a week!&quot; - Ms. Johnson, 4th Grade Teacher
          </p>
        </>
      )}
      {display[1] && (
        <>
          <p className="text-lg pl-4 pt-1">
            &quot;The personalized memory techniques are a game changer.
            It&apos;s not just about rote memorization, it&apos;s about really
            connecting with each student.&quot; - Mr. Garcia, High School
            History Teacher
          </p>
        </>
      )}

      {display[2] && (
        <>
          <p className="text-lg pl-4 pt-1">
            &quot;I was nervous about remembering everyone&apos;s name, but
            NameRemember made it so simple. It&apos;s a lifesaver!&quot; - Jane
            D. &quot;The games and quizzes kept me engaged. It&apos;s not just
            about names; it&apos;s fun learning!&quot; - Liam P.
          </p>
        </>
      )}
    </div>
  );
}
