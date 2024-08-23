export const getDashBoardData = async (adminId,setAdmin) => {
  try {
    const response = await fetch(`/api/admin/dashBoardData/${adminId}`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    else if(response.status == 401 || response.status == 403){
      localStorage.setItem('adminId',null)
      setAdmin(null)
      window.location.href = '/admin/signin'
    }
     else {
      return null;
    }
  } catch (err) {
    console.log("Dashboard error : ", err);
  }
};

export const getWeeklyData = (data) => {
  const weeklyData = [0, 0, 0, 0, 0, 0, 0];
  const week = getCurrentWeek();
  const startOfWeek = week.startOfWeek.toISOString();
  const endOfWeek = week.endOfWeek.toISOString();
  data.forEach((order) => {
    if (order.orderDate >= startOfWeek && order.orderDate <= endOfWeek) {
      const orderDate = new Date(order.orderDate);
      const day = orderDate.getDay();
      weeklyData[day] += order.sellingPrice;
    }
  });

  return weeklyData;
};

const getCurrentWeek = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = (dayOfWeek + 6) % 7;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
};
