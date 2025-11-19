// Git Commands Manager
// Note: This requires a backend server or VS Code Extension context to actually execute git commands
// For browser-only version, we'll simulate git operations and provide the commands

class GitManager {
  constructor() {
    this.currentBranch = "main";
    this.remoteUrl = "https://github.com/andika120226/Gyru.git";
    this.stagedFiles = [];
    this.uncommittedFiles = [];
    this.isLoading = false;
  }

  // Simulate or fetch git status
  async getStatus() {
    this.isLoading = true;
    try {
      // In a real scenario, this would fetch from a backend API that runs git commands
      // For now, we'll return mock data
      const status = {
        branch: this.currentBranch,
        remote: this.remoteUrl,
        stagedFiles: [],
        uncommittedFiles: ["css/style.css", "js/script.js", "index.html"],
        ahead: 0,
        behind: 0,
      };

      soundManager.playNotificationSound();
      return status;
    } catch (error) {
      console.error("Error getting git status:", error);
      soundManager.playErrorSound();
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Generate git command strings that can be copied to terminal
  generateGitAdd(files = ".") {
    return `git add ${files}`;
  }

  generateGitCommit(message) {
    return `git commit -m "${message}"`;
  }

  generateGitPush(branch = "main", remote = "origin") {
    return `git push ${remote} ${branch}`;
  }

  generateGitPull(branch = "main", remote = "origin") {
    return `git pull ${remote} ${branch}`;
  }

  // Full workflow commands
  generateFullWorkflow(message = "Update: changes from git dashboard") {
    return [
      this.generateGitAdd("."),
      this.generateGitCommit(message),
      this.generateGitPush(),
    ];
  }

  // For actual execution (requires backend or Node.js environment)
  async executeCommand(command) {
    this.isLoading = true;
    try {
      // This would need a backend endpoint like /api/git/execute
      const response = await fetch("/api/git/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error("Command execution failed");
      }

      const result = await response.json();
      soundManager.playSuccessSound();
      return result;
    } catch (error) {
      console.error("Error executing git command:", error);
      soundManager.playErrorSound();
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Copy command to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      soundManager.playSuccessSound();
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      soundManager.playErrorSound();
      return false;
    }
  }

  // Open terminal with command (for manual execution)
  async executeInTerminal(command) {
    // This is a helper to show user the command they need to run
    const platform = navigator.platform.toLowerCase();

    // On Windows with VS Code, user can open integrated terminal and paste
    // On Mac/Linux, similar approach
    console.log("Execute this command in your terminal:");
    console.log(`  ${command}`);

    // Auto-copy to clipboard
    await this.copyToClipboard(command);

    return {
      success: true,
      message: "Command copied to clipboard. Paste in your terminal.",
      command,
    };
  }
}

// Create global git manager instance
const gitManager = new GitManager();

// Export for other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = GitManager;
}
