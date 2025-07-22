import * as Appwrite from "https://cdn.jsdelivr.net/npm/appwrite@13.0.0/+esm";

const client = new Appwrite.Client();

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // ✅ Use your endpoint
  .setProject('687dd53b00135980b4b5');              // 🔁 Replace with your actual project ID

const storage = new Appwrite.Storage(client);
const bucketId = '687de2c60003e83cf640';             // 🔁 Replace with your actual bucket ID

window.uploadFile = async function () {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) return alert("Pick a file first");

  console.log("Uploading:", file.name);

  try {
    // ✅ permissions = array of strings
    const uploaded = await storage.createFile(bucketId, Appwrite.ID.unique(), file); // ✅ VALID

    console.log("Uploaded:", uploaded);
    alert("Upload successful!");
    loadImages();
  } catch (err) {
    console.error("Upload failed:", err);
    alert("Upload failed: " + err.message);
  }
};
//

// Close modal when clicking on the background (outside image)

const modal = document.getElementById('imageModal');
const closeBtn = document.getElementById('cross');

function closeModal() {
  modal.style.display = 'none';
}
// modal.addEventListener('click', (event) => {
//   // Only close if the clicked target is the modal itself, NOT the image
//   if (event.target === modal) {
//     closeModal();
//   }
// });
closeBtn.addEventListener('click', closeModal);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

function openModal(src) {
  modal.style.display = 'flex';  // Or 'block' depending on your CSS
  const modalImg = document.getElementById('modalImage');
  modalImg.src = src;
}



// 
async function loadImages() {
  try {
    const files = await storage.listFiles(bucketId);
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    for (const file of files.files) {
      if (file.mimeType.startsWith("image/")) {
        const view = storage.getFileView(bucketId, file.$id);
        const img = document.createElement('img');
        img.src = view.href;
        img.alt = file.name;

        // 🧲 Add click event to open modal
        img.onclick = function () {
          openModal(view.href);
        };

        gallery.appendChild(img);
      }
    }
  } catch (err) {
    console.error("Image load failed:", err.message);
  }
}

loadImages();