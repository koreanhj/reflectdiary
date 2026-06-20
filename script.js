const form = document.getElementById("diaryForm");

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  document.getElementById(pageId).classList.add("active");

  if (pageId === "student") {
    document.querySelectorAll(".tab")[0].classList.add("active");
  } else {
    document.querySelectorAll(".tab")[1].classList.add("active");
    renderDashboard();
  }
}

function getDiaries() {
  return JSON.parse(localStorage.getItem("koreanDiaries") || "[]");
}

function saveDiaries(diaries) {
  localStorage.setItem("koreanDiaries", JSON.stringify(diaries));
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const diary = {
    classNum: document.getElementById("classNum").value,
    studentNum: document.getElementById("studentNum").value,
    studentName: document.getElementById("studentName").value,
    unit: document.getElementById("unit").value,
    impressive: document.getElementById("impressive").value,
    difficult: document.getElementById("difficult").value,
    learned: document.getElementById("learned").value,
    good: document.getElementById("good").value,
    promise: document.getElementById("promise").value,
    time: new Date().toLocaleString("ko-KR")
  };

  const diaries = getDiaries();

  const duplicateIndex = diaries.findIndex(item =>
    item.classNum === diary.classNum &&
    item.studentNum === diary.studentNum
  );

  if (duplicateIndex >= 0) {
    diaries[duplicateIndex] = diary;
    alert("이미 제출한 기록을 새 내용으로 수정했어요!");
  } else {
    diaries.push(diary);
    alert("찐쌤께 국어 수업일지가 제출되었어요!");
  }

  saveDiaries(diaries);
  form.reset();
});

function renderDashboard() {
  const selectedClass = document.getElementById("teacherClass").value;
  const diaries = getDiaries().filter(item => item.classNum === selectedClass);
  const tbody = document.getElementById("diaryTable");

  tbody.innerHTML = "";

  diaries.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.studentNum}</td>
      <td>${item.studentName}</td>
      <td>${item.unit}</td>
      <td>${item.impressive}</td>
      <td>${item.difficult}</td>
      <td>${item.learned}</td>
      <td>${item.good}</td>
      <td>${item.promise}</td>
      <td>${item.time}</td>
    `;

    tbody.appendChild(row);
  });

  document.getElementById("submittedCount").textContent = `${diaries.length}명`;

  const totalStudents = 28;
  const notSubmitted = Math.max(totalStudents - diaries.length, 0);
  document.getElementById("notSubmittedCount").textContent = `${notSubmitted}명`;
}

function downloadCSV() {
  const selectedClass = document.getElementById("teacherClass").value;
  const diaries = getDiaries().filter(item => item.classNum === selectedClass);

  if (diaries.length === 0) {
    alert("다운로드할 데이터가 없습니다.");
    return;
  }

  let csv = "\uFEFF학번,이름,단원,인상 깊은 내용,어려웠던 점,깨달은 점,잘한 점,나의 다짐,제출시간\n";

  diaries.forEach(item => {
    const row = [
      item.studentNum,
      item.studentName,
      item.unit,
      item.impressive,
      item.difficult,
      item.learned,
      item.good,
      item.promise,
      item.time
    ].map(value => `"${String(value).replaceAll('"', '""')}"`);

    csv += row.join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${selectedClass}_국어수업일지.csv`;
  link.click();

  URL.revokeObjectURL(url);
}

function resetData() {
  const check = confirm("정말 전체 데이터를 초기화할까요? 이 작업은 되돌릴 수 없습니다.");

  if (check) {
    localStorage.removeItem("koreanDiaries");
    renderDashboard();
    alert("전체 데이터가 초기화되었습니다.");
  }
}
