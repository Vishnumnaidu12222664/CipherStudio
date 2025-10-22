export function saveProjectToLocal(project) {
  localStorage.setItem("cipherstudio_project", JSON.stringify(project));
}

export function loadProjectFromLocal() {
  try {
    return JSON.parse(localStorage.getItem("cipherstudio_project"));
  } catch (e) {
    return null;
  }
}

export function clearLocal() {
  localStorage.removeItem("cipherstudio_project");
}
