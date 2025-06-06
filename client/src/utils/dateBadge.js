import moment from 'moment';

export const getDateBadgeStatus = (startDate, dueDate) => {
  const now = moment();
  const start = startDate ? moment(startDate) : null;
  const due = dueDate ? moment(dueDate) : null;
  let badgeColor = '#ffe066'; // vàng mặc định
  let dueSoon = false;

  if (due && now.isAfter(due, 'day')) {
    badgeColor = '#ff6b6b'; // đỏ
  } else if (start && now.isBefore(start, 'day')) {
    // Chưa bắt đầu
    if (due) {
      const daysDiff = due.startOf('day').diff(now.startOf('day'), 'days');
      if (daysDiff > 1) {
        badgeColor = '#43a047'; // xanh lá
      } else {
        badgeColor = '#ffe066'; // vàng
        dueSoon = true;
      }
    } else {
      badgeColor = '#43a047'; // xanh lá nếu không có dueDate
    }
  } else {
    // Đang trong quá trình
    if (due) {
      const daysDiff = due.startOf('day').diff(now.startOf('day'), 'days');
      if (daysDiff <= 1 && daysDiff >= 0) {
        dueSoon = true;
      }
    }
    badgeColor = '#ffe066';
  }
  return { badgeColor, dueSoon };
} 