const uploadForm = document.getElementById("uploadForm");
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const output = document.getElementById("output");
const loader = document.getElementById("loader");
const filenameInput = document.getElementById("filenameInput");
const downloadBtn = document.getElementById("downloadBtn");

// ✅ Create and append output message
const outputMessage = document.createElement("p");
outputMessage.id = "outputMessage";
outputMessage.style.color = "#0f0";
outputMessage.style.textAlign = "center";
outputMessage.style.fontWeight = "bold";
outputMessage.style.marginTop = "10px";
outputMessage.style.display = "none";
document.querySelector(".right")?.appendChild(outputMessage);

// ✅ Show preview image on input
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// ✅ Handle background removal
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = imageInput.files[0];
  if (!file) {
    alert("Please select an image.");
    return;
  }

  loader.style.display = "block";
  output.style.display = "none";
  downloadBtn.style.display = "none";
  outputMessage.style.display = "none";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("/remove-bg", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Background removal failed");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    output.src = url;
    output.style.display = "block";

    const name = filenameInput.value.trim() || "output";
    downloadBtn.href = url;
    downloadBtn.download = name + ".png";
    downloadBtn.style.display = "inline-block";

    // ✅ Show output complete message
    outputMessage.textContent = "✅ Output Complete";
    outputMessage.style.display = "block";
  } catch (error) {
    alert("❌ Error: " + error.message);
  } finally {
    loader.style.display = "none";
  }
});

// ✅ Live update filename on input
filenameInput.addEventListener("input", () => {
  const name = filenameInput.value.trim() || "output";
  downloadBtn.download = `${name}.png`;
});

// ✅ Mousemove background effect
document.addEventListener("mousemove", (e) => {
  const x = e.clientX + "px";
  const y = e.clientY + "px";
  document.body.style.setProperty("--x", x);
  document.body.style.setProperty("--y", y);
});
