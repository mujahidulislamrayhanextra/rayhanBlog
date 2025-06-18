// import React from 'react';
// import ProfileDetails from './ProfileDetails';

// async function getStaticProps({ params }) {
//   try {
//     const res = await fetch(`http://localhost:3000/user/${params.id}`, {
//       cache: "no-store",
//     });

//     if (!res.ok) {
//       throw new Error("Failed to fetch data");
//     }

//     const profile = await res.json();
//     return { props: { profile, params } };
//   } catch (error) {
//     console.error(error);
//     return { notFound: true }; // Handle cases where data is not found
//   }
// }

// const UserProfile = ({ profile, params }) => {
//   // ... rest of your component logic using profile and params
//   return (
//     <div>
//       <ProfileDetails profile={profile} params={params} />
//     </div>
//   );
// }

// export default UserProfile;

import ProfileDetails from "./ProfileDetails";

async function getUserData(params) {
  console.log("this is id",params.id)

  // if (!id) {
  //   return

  // }
  const res = await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/user/${params.id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
}

const UserProfile = async (props) => {
  const params = await props.params; // promise return.

  console.log("this is params",params)
  const profile = await getUserData(params);

  // console.log("this is profile",profile)
  return (
    <div>
      <ProfileDetails profile={profile} params={params} />
    </div>
  );
};

export default UserProfile;

// const UserProfile = async ({id}) => {

//     const profile = await getUserData(id)
//   return (
//     <div>
//   <ProfileDetails    />
//     </div>
//   )
// }
