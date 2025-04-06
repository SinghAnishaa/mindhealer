// // DashboardSnapshot.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const DashboardSnapshot = () => {
//   const [snapshot, setSnapshot] = useState(null);

//   useEffect(() => {
//     const fetchSnapshot = async () => {
//       try {
//         const res = await axios.get('/api/dashboard/snapshot', {
//             headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
//           });
//         setSnapshot(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchSnapshot();
//   }, []);

//   {Array.isArray(snapshot?.recentMoods) && snapshot.recentMoods.map((entry, index) => (
//     <div key={index}>
//       <p><b>Mood:</b> {entry.mood}</p>
//       <p><b>Journal:</b> {entry.journal || '—'}</p>
//     </div>
//   ))}  

//   return (
//     <div className="p-4 rounded-xl bg-white shadow-md">
//       <h2 className="text-xl font-semibold mb-2">🧘 Your Dashboard</h2>

//       <div className="mb-4">
//         <p className="font-medium">📝 Journal Prompt:</p>
//         <p className="italic">{snapshot.journalPrompt}</p>
//       </div>

//       <div>
//         <p className="font-medium mb-2">📊 Recent Mood Entries:</p>
//         {snapshot.recentMoods.map((entry, index) => (
//           <div key={index} className="border-l-4 pl-3 mb-2 border-blue-300">
//             <p><b>Mood:</b> {entry.mood}</p>
//             <p><b>Journal:</b> {entry.journal || '—'}</p>
//             <p className="text-sm text-gray-500">{new Date(entry.createdAt).toLocaleString()}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DashboardSnapshot;

import React from 'react';

function DashboardSnapshot({ snapshot }) {
  // 2. Handle loading state at the top if `snapshot` is null or undefined.
  if (!snapshot) {
    return <div>Loading...</div>;
  }

  // Determine if `recentMoods` is a valid array; if not, use an empty array.
  const recentMoods = Array.isArray(snapshot.recentMoods) ? snapshot.recentMoods : [];

  return (
    <div className="dashboard-snapshot">
      {/* Render the recent moods list only if it's a valid non-empty array */}
      {recentMoods.length > 0 ? (
        <ul className="recent-moods-list">
          {recentMoods.map((moodEntry, index) => (
            <li key={index}>
              {/* Render each mood entry (adjust content as needed) */}
              {moodEntry}
            </li>
          ))}
        </ul>
      ) : (
        // 4. Fallback message if the array is empty or missing
        <p>No mood entries yet</p>
      )}
    </div>
  );
}

export default DashboardSnapshot;

