const apiUrl = 'http://localhost:5000/students';

const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');
const studentIdInput = document.getElementById('studentId');

async function fetchStudents() {
  const res = await fetch(apiUrl);
  const students = await res.json();
  studentList.innerHTML = '';
  students.forEach(student => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${student.name} (${student.age}) - ${student.email}
      <button onclick="editStudent('${student._id}')">Edit</button>
      <button onclick="deleteStudent('${student._id}')">Delete</button>
    `;
    studentList.appendChild(li);
  });
}

studentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const studentData = {
    name: document.getElementById('name').value,
    age: parseInt(document.getElementById('age').value),
    email: document.getElementById('email').value
  };

  const id = studentIdInput.value;
  if (id) {
    await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    studentIdInput.value = '';
  } else {
    await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
  }

  studentForm.reset();
  fetchStudents();
});

window.editStudent = async function(id) {
  const res = await fetch(`${apiUrl}/${id}`);
  const student = await res.json();
  studentIdInput.value = student._id;
  document.getElementById('name').value = student.name;
  document.getElementById('age').value = student.age;
  document.getElementById('email').value = student.email;
};

window.deleteStudent = async function(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  fetchStudents();
};

// Initial load
fetchStudents();
