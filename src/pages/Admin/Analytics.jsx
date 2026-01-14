// import React, { useEffect, useState } from "react";
// import API from "../../services/api";

// export default function Analytics() {
//   const [kpis, setKpis] = useState({});

//   useEffect(() => {
//     // API.get("/admin/analytics")
//       .then((r) => setKpis(r.data || {}))
//       .catch(() => {});
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
//       <h2 className="text-2xl font-semibold mb-4">Analytics</h2>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="p-4 border rounded">
//           <div className="text-sm text-gray-500">Total Orders</div>
//           <div className="text-xl font-bold">{kpis.totalOrders || 0}</div>
//         </div>
//         <div className="p-4 border rounded">
//           <div className="text-sm text-gray-500">Monthly Revenue</div>
//           <div className="text-xl font-bold">₹{kpis.monthlyRevenue || 0}</div>
//         </div>
//         <div className="p-4 border rounded">
//           <div className="text-sm text-gray-500">Active Users</div>
//           <div className="text-xl font-bold">{kpis.activeUsers || 0}</div>
//         </div>
//       </div>
//     </div>
//   );
// }
