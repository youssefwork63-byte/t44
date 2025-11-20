
const KEYS = {
  username: "platform_username",
  students: "platform_students",
  lessons: "platform_lessons",
  attendance: "platform_attendance",
  payments: "platform_payments",
  expenses: "platform_expenses",
  settings: "platform_settings"
};

// أداة التخزين
const Store = {
  get: (key, fallback = []) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  },
  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// تحديث الداشبورد
function refreshDashboard() {
  const studentsCount = Store.get(KEYS.students).length;
  const lessonsCount = Store.get(KEYS.lessons).length;
  const attendanceCount = Store.get(KEYS.attendance).length;
  const paymentsCount = Store.get(KEYS.payments).length;
  const expensesCount = Store.get(KEYS.expenses).length;

  const studentsBadge = document.getElementById("studentsBadge");
  const lessonsBadge = document.getElementById("lessonsBadge");
  const attendanceBadge = document.getElementById("attendanceBadge");
  const paymentsBadge = document.getElementById("paymentsBadge");
  const expensesBadge = document.getElementById("expensesBadge");

  if (studentsBadge) {
    studentsBadge.textContent = studentsCount + " طالب";
  }
  if (lessonsBadge) {
    lessonsBadge.textContent = lessonsCount + " درس";
  }
  if (attendanceBadge) {
    attendanceBadge.textContent = attendanceCount + " سجل";
  }
  if (paymentsBadge) {
    paymentsBadge.textContent = paymentsCount + " دفعة";
  }
  if (expensesBadge) {
    expensesBadge.textContent = expensesCount + " مصروف";
  }

  // تحديث الدوائر
  const studentsCountEl = document.getElementById("studentsCount");
  const lessonsCountEl = document.getElementById("lessonsCount");
  const attendanceRateEl = document.getElementById("attendanceRate");
  const budgetTotalEl = document.getElementById("budgetTotal");

  if (studentsCountEl) studentsCountEl.textContent = studentsCount;
  if (lessonsCountEl) lessonsCountEl.textContent = lessonsCount;
  if (attendanceRateEl) attendanceRateEl.textContent = attendanceCount + "%";
  if (budgetTotalEl) {
    const totalPayments = Store.get(KEYS.payments).reduce((sum, p) => sum + p.amount, 0);
    const totalExpenses = Store.get(KEYS.expenses).reduce((sum, e) => sum + e.amount, 0);
    budgetTotalEl.textContent = (totalPayments - totalExpenses).toFixed(2);
  }
}
// عرض الطلاب
function renderStudents() {
  const students = Store.get(KEYS.students);
  const table = document.getElementById("studentsTable");
  if (!table) return;
  table.innerHTML = "";
  students.forEach((s, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.name}</td>
      <td>${s.className}</td>
      <td>${s.phone}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-light" data-edit="${s.id}">تعديل</button>
        <button class="btn btn-sm btn-danger" data-delete="${s.id}">حذف</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// عرض الدروس
function renderLessons() {
  const lessons = Store.get(KEYS.lessons);
  const table = document.getElementById("lessonsTable");
  if (!table) return;
  table.innerHTML = "";
  lessons.forEach((l, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${l.title}</td>
      <td>${l.subject}</td>
      <td>${l.time}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-danger" data-delete="${l.id}">حذف</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// عرض الحضور
function renderAttendance() {
  const att = Store.get(KEYS.attendance);
  const table = document.getElementById("attendanceTable");
  if (!table) return;
  table.innerHTML = "";
  att.forEach((a, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${a.student}</td>
      <td>${a.date}</td>
      <td>${a.status}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-danger" data-delete="${a.id}">حذف</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// عرض المدفوعات
function renderPayments() {
  const pays = Store.get(KEYS.payments);
  const table = document.getElementById("paymentsTable");
  if (!table) return;
  table.innerHTML = "";
  pays.forEach((p, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.student}</td>
      <td>${p.amount}</td>
      <td>${p.date}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-danger" data-delete="${p.id}">حذف</button>
      </td>
    `;
    table.appendChild(row);
  });

  // تحديث الملخص المالي
  const totalPayments = pays.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = Store.get(KEYS.expenses).reduce((sum, e) => sum + e.amount, 0);
  const balance = totalPayments - totalExpenses;

  const totalPaymentsEl = document.getElementById("totalPayments");
  const totalExpensesEl = document.getElementById("totalExpenses");
  const balanceEl = document.getElementById("balance");

  if (totalPaymentsEl) totalPaymentsEl.textContent = totalPayments.toFixed(2);
  if (totalExpensesEl) totalExpensesEl.textContent = totalExpenses.toFixed(2);
  if (balanceEl) balanceEl.textContent = balance.toFixed(2);
}

// عرض المصاريف
function renderExpenses() {
  const exps = Store.get(KEYS.expenses);
  const table = document.getElementById("expensesTable");
  if (!table) return;
  table.innerHTML = "";
  exps.forEach((e, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${e.desc}</td>
      <td>${e.amount}</td>
      <td>${e.date}</td>
      <td class="text-center">
        <button class="btn btn-sm btn-danger" data-delete="${e.id}">حذف</button>
      </td>
    `;
    table.appendChild(row);
  });

  // تحديث الملخص المالي
  const totalPayments = Store.get(KEYS.payments).reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = exps.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalPayments - totalExpenses;

  const totalPaymentsEl = document.getElementById("totalPayments");
  const totalExpensesEl = document.getElementById("totalExpenses");
  const balanceEl = document.getElementById("balance");

  if (totalPaymentsEl) totalPaymentsEl.textContent = totalPayments.toFixed(2);
  if (totalExpensesEl) totalExpensesEl.textContent = totalExpenses.toFixed(2);
  if (balanceEl) balanceEl.textContent = balance.toFixed(2);
}

// إضافة طالب
document.getElementById("studentForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("studentId").value || Date.now();
  const name = document.getElementById("studentName").value;
  const className = document.getElementById("studentClass").value;
  const phone = document.getElementById("studentPhone").value;

  let students = Store.get(KEYS.students);
  const existing = students.find(s => s.id == id);
  if (existing) {
    existing.name = name;
    existing.className = className;
    existing.phone = phone;
  } else {
    students.push({ id, name, className, phone });
  }
  Store.set(KEYS.students, students);
  renderStudents();
  refreshDashboard();
  e.target.reset();
});

// حذف طالب
document.getElementById("studentsTable")?.addEventListener("click", e => {
  if (e.target.dataset.delete) {
    let students = Store.get(KEYS.students);
    students = students.filter(s => s.id != e.target.dataset.delete);
    Store.set(KEYS.students, students);
    renderStudents();
    refreshDashboard();
  }
});

// إضافة درس
document.getElementById("lessonForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("lessonId").value || Date.now();
  const title = document.getElementById("lessonTitle").value;
  const subject = document.getElementById("lessonSubject").value;
  const time = document.getElementById("lessonTime").value;

  let lessons = Store.get(KEYS.lessons);
  lessons.push({ id, title, subject, time });
  Store.set(KEYS.lessons, lessons);
  renderLessons();
  refreshDashboard();
  e.target.reset();
});

// حذف درس
document.getElementById("lessonsTable")?.addEventListener("click", e => {
  if (e.target.dataset.delete) {
    let lessons = Store.get(KEYS.lessons);
    lessons = lessons.filter(l => l.id != e.target.dataset.delete);
    Store.set(KEYS.lessons, lessons);
    renderLessons();
    refreshDashboard();
  }
});

// إضافة حضور
document.getElementById("attendanceForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const id = Date.now();
  const student = document.getElementById("attendanceStudent").value;
  const date = document.getElementById("attendanceDate").value;
  const status = document.getElementById("attendanceStatus").value;

  let att = Store.get(KEYS.attendance);
  att.push({ id, student, date, status });
  Store.set(KEYS.attendance, att);
  renderAttendance();
  refreshDashboard();
  e.target.reset();
});

// حذف حضور
document.getElementById("attendanceTable")?.addEventListener("click", e => {
  if (e.target.dataset.delete) {
    let att = Store.get(KEYS.attendance);
    att = att.filter(a => a.id != e.target.dataset.delete);
    Store.set(KEYS.attendance, att);
    renderAttendance();
    refreshDashboard();
  }
});

// إضافة دفعة
document.getElementById("paymentForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const id = Date.now();
  const student = document.getElementById("paymentStudent").value;
  const amount = parseFloat(document.getElementById("paymentAmount").value);
  const date = document.getElementById("paymentDate").value;

  let pays = Store.get(KEYS.payments);
  pays.push({ id, student, amount, date });
  Store.set(KEYS.payments, pays);
  renderPayments();
  refreshDashboard();
  e.target.reset();
});

// حذف دفعة
document.getElementById("paymentsTable")?.addEventListener("click", e => {
  if (e.target.dataset.delete) {
    let pays = Store.get(KEYS.payments);
    pays = pays.filter(p => p.id != e.target.dataset.delete);
    Store.set(KEYS.payments, pays);
    renderPayments();
    refreshDashboard();
  }
});
// إضافة مصروف
document.getElementById("expenseForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const id = Date.now();
  const desc = document.getElementById("expenseDesc").value;
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  const date = document.getElementById("expenseDate").value;

  let exps = Store.get(KEYS.expenses);
  exps.push({ id, desc, amount, date });
  Store.set(KEYS.expenses, exps);
  renderExpenses();
  refreshDashboard();
  e.target.reset();
});

// حذف مصروف
document.getElementById("expensesTable")?.addEventListener("click", e => {
  if (e.target.dataset.delete) {
    let exps = Store.get(KEYS.expenses);
    exps = exps.filter(x => x.id != e.target.dataset.delete);
    Store.set(KEYS.expenses, exps);
    renderExpenses();
    refreshDashboard();
  }
});

// الإعدادات
document.getElementById("settingsForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("usernameInput").value;
  const animateCircles = document.getElementById("animateCircles").checked;
  const enableLoader = document.getElementById("enableLoader").checked;

  Store.set(KEYS.username, username);
  Store.set(KEYS.settings, { animateCircles, enableLoader });

  const usernameDisplay = document.getElementById("usernameDisplay");
  if (usernameDisplay) usernameDisplay.textContent = username;

  alert("تم حفظ الإعدادات بنجاح ✅");
});

// اللودر
function showLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;
  loader.classList.add("show");
  setTimeout(() => loader.classList.remove("show"), 1200);
}

// تصدير البيانات
document.getElementById("exportData")?.addEventListener("click", () => {
  const data = {
    students: Store.get(KEYS.students),
    lessons: Store.get(KEYS.lessons),
    attendance: Store.get(KEYS.attendance),
    payments: Store.get(KEYS.payments),
    expenses: Store.get(KEYS.expenses),
    settings: Store.get(KEYS.settings)
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "platform_data.json";
  a.click();
  URL.revokeObjectURL(url);
});

// تفريغ النظام
document.getElementById("resetAll")?.addEventListener("click", () => {
  if (confirm("هل أنت متأكد من تفريغ كل البيانات؟")) {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    renderStudents();
    renderLessons();
    renderAttendance();
    renderPayments();
    renderExpenses();
    refreshDashboard();
    alert("تم تفريغ النظام بالكامل ❌");
  }
});
// سجل النشاطات
function logActivity(msg) {
  const log = document.getElementById("activityLog");
  if (!log) return;
  const li = document.createElement("li");
  li.textContent = new Date().toLocaleString() + " — " + msg;
  log.prepend(li);
}

// تهيئة الصفحة عند التحميل
window.addEventListener("DOMContentLoaded", () => {
  // عرض البيانات
  renderStudents();
  renderLessons();
  renderAttendance();
  renderPayments();
  renderExpenses();
  refreshDashboard();

  // عرض اسم المستخدم
  const username = Store.get(KEYS.username, "");
  const usernameDisplay = document.getElementById("usernameDisplay");
  if (usernameDisplay) usernameDisplay.textContent = username;

  // إعدادات
  const settings = Store.get(KEYS.settings, { animateCircles: true, enableLoader: true });
  if (settings.enableLoader) showLoader();

  logActivity("تم تحميل النظام بنجاح ✅");
});