import sql from "@/lib/pgConnect";
import {
  base64AbrahamLincoln,
  base64AlbertEinstein,
  base64CharlieChaplin,
  base64JohnLennon,
  base64MarilynMonroe,
} from "./exampleImagesBase64";

export default async function createWelcomeList({
  userId,
}: {
  userId: string;
}) {
  console.log("createWelcomeList", userId);
  const peopleList = await sql({
    query: `
        INSERT INTO people_lists (owner_id, name, rrule, rrule_start, reminder_trigger_time)
        VALUES ($1, 'Historic figures (Example)', 'DTSTART:20231014T180817Z
        RRULE:FREQ=WEEKLY;INTERVAL=1;BYHOUR=7;BYMINUTE=0;BYSECOND=0', NOW(), NOW() + INTERVAL '1 day')
        RETURNING id;`,
    values: [userId],
  });
  const imageMarilynMonroe = base64MarilynMonroe;
  const imageAlbertEinstein = base64AlbertEinstein;
  const imageCharlieChaplin = base64CharlieChaplin;
  const imageAbrahamLincoln = base64AbrahamLincoln;
  const imageJohnLennon = base64JohnLennon;
  await sql({
    query: `
        INSERT INTO people (fname, mname, lname, image, list_id)
        VALUES 
          ('Marilyn', '', 'Monroe', $2, $1),
          ('Albert', '', 'Einstein', $3, $1), 
          ('Charlie', '', 'Chaplin', $4, $1),
          ('Abraham', '', 'Lincoln', $5, $1),
          ('John', '', 'Lennon', $6, $1);`,
    values: [
      peopleList.rows[0].id,
      imageMarilynMonroe,
      imageAlbertEinstein,
      imageCharlieChaplin,
      imageAbrahamLincoln,
      imageJohnLennon,
    ],
  });
}
