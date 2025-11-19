// Git Dashboard Logic

document.addEventListener("DOMContentLoaded", () => {
  // Initialize dashboard
  initDashboard();
  loadStatus();
  setupEventListeners();
});

function initDashboard() {
  console.log("Git Dashboard initialized");
  soundManager.playNotificationSound();
}

function loadStatus() {
  const statusBadge = document.getElementById("status-badge");
  const uncommittedFiles = document.getElementById("uncommitted-files");

  // Simulate loading
  statusBadge.textContent = "Loading...";
  uncommittedFiles.innerHTML = "<div class='loading'>Loading files...</div>";

  // Simulate fetching status
  setTimeout(() => {
    // Mock data
    const files = [
      { name: "css/style.css", status: "modified" },
      { name: "js/script.js", status: "modified" },
      { name: "index.html", status: "modified" },
      { name: "git-dashboard.html", status: "untracked" },
      { name: "js/git-manager.js", status: "untracked" },
    ];

    statusBadge.textContent = "3 files changed";
    statusBadge.classList.add("warning");

    // Render files
    uncommittedFiles.innerHTML = files
      .map(
        (file) => `
      <div class="file-item">
        <i data-feather="file-text"></i>
        <span class="filename">${file.name}</span>
        <div class="status-icon" title="${file.status}">${
          file.status === "modified" ? "M" : "?"
        }</div>
      </div>
    `
      )
      .join("");

    feather.replace();
  }, 500);
}

function setupEventListeners() {
  // Refresh Status
  document.getElementById("refresh-status")?.addEventListener("click", () => {
    soundManager.playClickSound();
    loadStatus();
  });

  // Git Commands
  document.getElementById("cmd-add")?.addEventListener("click", () => {
    const command = gitManager.generateGitAdd(".");
    outputCommand(command, "add");
  });

  document.getElementById("cmd-commit")?.addEventListener("click", () => {
    const message =
      document.getElementById("commit-message").value ||
      "Update: changes from git dashboard";
    const command = gitManager.generateGitCommit(message);
    outputCommand(command, "commit");
  });

  document.getElementById("cmd-push")?.addEventListener("click", () => {
    const command = gitManager.generateGitPush();
    outputCommand(command, "push");
  });

  document.getElementById("cmd-pull")?.addEventListener("click", () => {
    const command = gitManager.generateGitPull();
    outputCommand(command, "pull");
  });

  // Quick Actions
  document.getElementById("quick-sync")?.addEventListener("click", () => {
    const message =
      document.getElementById("commit-message").value ||
      "Update: changes from git dashboard";
    const commands = gitManager.generateFullWorkflow(message);
    outputCommands(commands, "sync");
  });

  document.getElementById("quick-view-log")?.addEventListener("click", () => {
    const command = "git log --oneline -10";
    outputCommand(command, "log");
  });

  // Commit message input
  document.getElementById("commit-message")?.addEventListener("focus", () => {
    soundManager.playClickSound(700, 0.05);
  });

  // Checklist with sound
  const checkboxes = document.querySelectorAll(".task-check");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      soundManager.playSuccessSound();
      updateChecklist();
    });
  });

  // Volume slider
  document.getElementById("volume-slider")?.addEventListener("input", (e) => {
    soundManager.setVolume(parseFloat(e.target.value));
  });

  // Sound toggle in navbar
  document.getElementById("sound-toggle")?.addEventListener("change", (e) => {
    soundManager.setVolume(e.target.checked ? 0.3 : 0);
  });
}

function outputCommand(command, type = "generic") {
  const output = document.getElementById("command-output");

  // Add command to output
  const cmdElement = document.createElement("p");
  cmdElement.className = "command";
  cmdElement.innerHTML = `$ ${command}`;
  cmdElement.style.cursor = "pointer";

  cmdElement.addEventListener("click", async () => {
    await gitManager.copyToClipboard(command);
    const tooltip = document.createElement("span");
    tooltip.textContent = "Copied!";
    cmdElement.appendChild(tooltip);
    setTimeout(() => tooltip.remove(), 1500);
  });

  output.appendChild(cmdElement);

  // Scroll to bottom
  output.scrollTop = output.scrollHeight;

  // Play sound
  soundManager.playSuccessSound();

  // Add helper text
  setTimeout(() => {
    const helper = document.createElement("p");
    helper.className = "info";
    helper.innerHTML = `💡 Click the command above to copy to clipboard, then paste in your terminal.`;
    output.appendChild(helper);
    output.scrollTop = output.scrollHeight;
  }, 300);
}

function outputCommands(commands, type = "workflow") {
  const output = document.getElementById("command-output");

  // Clear previous
  output.innerHTML = "";

  const typeLabel = {
    sync: "Full Sync Workflow",
    add: "Stage Files",
    commit: "Create Commit",
    push: "Push to Remote",
    pull: "Pull from Remote",
    log: "View Log",
  };

  // Add header
  const header = document.createElement("p");
  header.className = "info";
  header.innerHTML = `<strong>${
    typeLabel[type] || type
  }:</strong> Run these commands in order:`;
  output.appendChild(header);

  // Add each command
  commands.forEach((command, index) => {
    const cmdElement = document.createElement("p");
    cmdElement.className = "command";
    cmdElement.innerHTML = `<strong>${index + 1}.</strong> ${command}`;
    cmdElement.style.cursor = "pointer";

    cmdElement.addEventListener("click", async () => {
      await gitManager.copyToClipboard(command);
      const tooltip = document.createElement("span");
      tooltip.textContent = " ✓ Copied!";
      tooltip.style.marginLeft = "0.5rem";
      tooltip.style.color = "#4caf50";
      cmdElement.appendChild(tooltip);
      setTimeout(() => tooltip.remove(), 1500);
    });

    output.appendChild(cmdElement);
  });

  output.scrollTop = output.scrollHeight;
  soundManager.playSuccessSound();
}

function updateChecklist() {
  const checkboxes = document.querySelectorAll(".task-check");
  let allChecked = true;

  checkboxes.forEach((checkbox) => {
    if (!checkbox.checked) {
      allChecked = false;
    }
  });

  if (allChecked) {
    soundManager.playSuccessSound();
    soundManager.playSuccessSound();
    // Show celebration
    const output = document.getElementById("command-output");
    const celebration = document.createElement("p");
    celebration.className = "success";
    celebration.innerHTML =
      "🎉 All tasks completed! Your changes are ready to push to GitHub!";
    output.appendChild(celebration);
  }
}

// Modal functions
function openSettings() {
  document.getElementById("settings-modal").classList.add("active");
  soundManager.playNotificationSound();
}

function closeSettings() {
  document.getElementById("settings-modal").classList.remove("active");
  soundManager.playClickSound();
}

// Close modal on outside click
window.addEventListener("click", (event) => {
  const modal = document.getElementById("settings-modal");
  if (event.target === modal) {
    closeSettings();
  }
});

// Keyboard shortcuts
document.addEventListener("keydown", (event) => {
  // Ctrl/Cmd + S for quick sync
  if ((event.ctrlKey || event.metaKey) && event.key === "s") {
    event.preventDefault();
    document.getElementById("quick-sync")?.click();
  }

  // Escape to close modal
  if (event.key === "Escape") {
    closeSettings();
  }
});

console.log("Git Dashboard ready!");
