let capsules = JSON.parse(localStorage.getItem("capsules")) || [];
let currentUser = {email: "vivekthepe2005@gmail.com"};

const FIXED_IMAGE =
  "https://images.unsplash.com/photo-1687042277586-971369d3d241?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// Show section function
function showSection(sectionId) {
  document
    .querySelectorAll(".section")
    .forEach((s) => s.classList.add("hidden"));
  document.getElementById(sectionId).classList.remove("hidden");

  if (sectionId === "dashboard") loadCapsules();
  if (sectionId === "public") loadPublicCapsules();
}

// Load and display capsules
function loadCapsules() {
  const capsuleList = document.getElementById("capsuleList");
  capsuleList.innerHTML = "";
  const now = new Date();
  capsules
    .filter((c) => c.creator === currentUser.email)
    .forEach((capsule) => {
      const li = document.createElement("li");
      li.innerHTML = `
      <img src="${FIXED_IMAGE}" alt="capsule image" class="capsule-img" />
      <h3>${capsule.title}</h3>
      <p>${capsule.description}</p>
      <p><strong>Unlock:</strong> ${new Date(
        capsule.unlockDate
      ).toDateString()}</p>
      <p>Status: ${
        new Date(capsule.unlockDate) <= now ? "✅ Unlocked" : "🔒 Locked"
      }</p>
      <button onclick="viewCapsule('${capsule.id}')">View</button>
      <button onclick="editCapsule('${capsule.id}')">Edit</button>
      <button onclick="deleteCapsule('${capsule.id}')">Delete</button>
    `;
      capsuleList.appendChild(li);
    });
}

// Public capsules
function loadPublicCapsules() {
  const publicList = document.getElementById("publicCapsuleList");
  publicList.innerHTML = "";
  const now = new Date();
  capsules
    .filter((c) => c.isPublic && new Date(capsule.unlockDate) <= now)
    .forEach((capsule) => {
      const li = document.createElement("li");
      li.innerHTML = `
      <img src="${FIXED_IMAGE}" alt="capsule image" class="capsule-img" />
      <h3>${capsule.title}</h3>
      <p>${capsule.description}</p>
      <button onclick="viewCapsule('${capsule.id}')">View</button>
    `;
      publicList.appendChild(li);
    });
}

// Create capsule
document.getElementById("capsuleForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const capsule = {
    id: Date.now().toString(),
    title: e.target.title.value,
    description: e.target.description.value,
    unlockDate: e.target.unlockDate.value,
    isPublic: e.target.isPublic.checked,
    creator: currentUser.email,
    media: [],
    image: FIXED_IMAGE, // fixed image for all
  };
  capsules.push(capsule);
  localStorage.setItem("capsules", JSON.stringify(capsules));
  e.target.reset();
  showSection("dashboard");
});

// View capsule
function viewCapsule(id) {
  const capsule = capsules.find((c) => c.id === id);
  if (!capsule) return;
  const now = new Date();
  document.getElementById("capsuleTitle").textContent = capsule.title;
  document.getElementById("capsuleDescription").textContent =
    capsule.description;
  document.getElementById(
    "capsuleUnlockDate"
  ).textContent = `Unlock Date: ${new Date(capsule.unlockDate).toDateString()}`;
  document.getElementById("capsuleMedia").innerHTML =
    new Date(capsule.unlockDate) <= now
      ? `<img src="${FIXED_IMAGE}" alt="capsule image" class="capsule-img" /><p>📂 Media: (Simulated content)</p>`
      : "<p>🔒 This capsule is locked until the unlock date.</p>";
  showSection("capsuleView");
}

// Edit capsule
function editCapsule(id) {
  const capsule = capsules.find((c) => c.id === id);
  if (!capsule) return;
  const form = document.getElementById("editForm");
  form.title.value = capsule.title;
  form.description.value = capsule.description;
  form.unlockDate.value = capsule.unlockDate;
  form.isPublic.checked = capsule.isPublic;

  form.onsubmit = function (e) {
    e.preventDefault();
    capsule.title = e.target.title.value;
    capsule.description = e.target.description.value;
    capsule.unlockDate = e.target.unlockDate.value;
    capsule.isPublic = e.target.isPublic.checked;
    capsule.image = FIXED_IMAGE; // always fixed
    localStorage.setItem("capsules", JSON.stringify(capsules));
    showSection("dashboard");
  };
  showSection("edit");
}

// Delete capsule
function deleteCapsule(id) {
  capsules = capsules.filter((c) => c.id !== id);
  localStorage.setItem("capsules", JSON.stringify(capsules));
  loadCapsules();
}

// Logout
function logout() {
  currentUser = {email: "guest@example.com"};
  capsules = [];
  localStorage.removeItem("capsules");
  loadCapsules();
}

// Initialize
showSection("dashboard");
