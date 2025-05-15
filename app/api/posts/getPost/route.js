import { query } from "@/lib/db";
import { createPostInstance } from "@/lib/models/Posts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  // filters : friends, major
  const filter = searchParams.get("filter") || "";
  // sections : general, job, market, tutor
  const section = searchParams.get("section") || "";
  // location 
  const location = searchParams.get("location") || "";
  // job type
  const job_type = searchParams.get("job_type") || "";

  const sections = {
    job: 'jobs_details',
    market: 'product_details',
    tutor: 'tutoring_details'
  };

  const filters = {
    user_id: session.user.id,
    major: session.user.major
  };

  // conditions
  const conditions = ['posts.is_deleted = 0'];
  const params = [filters.user_id];

  const joins = [
    'posts JOIN users ON posts.user_id = users.id',
    'LEFT JOIN reactions ON reactions.post_id = posts.id',
    'LEFT JOIN comments ON comments.post_id = posts.id'
  ];

  const additional_attributes = {
    tutor: `
        WHEN posts.category = 'tutor' THEN (
          SELECT JSON_OBJECT(
          'rate', tutoring_details.rate,
          'subject', tutoring_details.subject,
          'location', tutoring_details.location
        ) FROM tutoring_details WHERE tutoring_details.post_id = posts.id LIMIT 1)
    `,
    market: `
        WHEN posts.category = 'market' THEN (
          SELECT JSON_OBJECT(
            'price', product_details.price,
            'location', product_details.location
          ) FROM product_details WHERE product_details.post_id = posts.id LIMIT 1)
    `,
    job: `
        WHEN posts.category = 'job' THEN (
          SELECT JSON_OBJECT(
            'job_type', jobs_details.job_type,
            'salary', jobs_details.salary,
            'location', jobs_details.location
          ) FROM jobs_details WHERE jobs_details.post_id = posts.id LIMIT 1)
        `,
  };

  switch (filter) {
    case 'friends':
      conditions.push(`posts.user_id IN (SELECT friend_id FROM connections WHERE user_id = ?)`);
      params.push(filters.user_id);
      break;

    case 'major':
      conditions.push('users.major = ?');
      params.push(filters.major);
      break;
  }

  if (section && section !== 'home') {
    if (!Object.keys(sections).includes(section)) {
      return Response.json({ error: "Invalid section" }, { status: 400 });
    }

    conditions.push('posts.category = ?');
    params.push(section);

    joins.push(`JOIN ${sections[section]} ON ${sections[section]}.post_id = posts.id`);

    if (location) {
      conditions.push(`${sections[section]}.location = ?`);
      params.push(location);
    }

    switch (section) {
      case 'job':
        if (job_type) {
          conditions.push(`jobs_details.job_type = ?`);
          params.push(job_type);
        }
        break;
    }
  }



  const sqlQuery = `
    SELECT posts.id,posts.content, posts.created_at, posts.category, 
      users.id AS user_id, users.first_name, users.last_name, users.major, users.profile_picture,
      COUNT(CASE WHEN reactions.value = 0 THEN 1 END) AS dislikesCount,
      COUNT(CASE WHEN reactions.value = 1 THEN 1 END) AS likesCount,
      COUNT(DISTINCT CASE WHEN comments.is_deleted = 0 THEN comments.id END) AS commentsCount,
      (SELECT JSON_ARRAYAGG(post_media.path_url) FROM post_media WHERE post_media.post_id = posts.id) AS media_urls,

    -- Current user reaction
      ( SELECT value
        FROM reactions
        WHERE reactions.post_id = posts.id AND reactions.user_id = ?
        LIMIT 1 ) AS currentUserReaction,

      CASE
        ${section !== 'home' && section ? additional_attributes[section] : Object.values(additional_attributes).join('\n')}
        ELSE NULL
      END AS details

    FROM ${joins.join(' ')}
    WHERE ${conditions.join(' AND ')}
    GROUP BY posts.id, posts.content, posts.category, posts.created_at, users.id, users.first_name, users.last_name, users.major
    ORDER BY posts.created_at DESC;
`;
  // console.log(sqlQuery, params);

  try {
    const result = await query(sqlQuery, params);
    //console.log(result);
    const posts = result.map((post) => {
      return createPostInstance(post);
    });
    // console.log(posts);
    return Response.json(posts);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


